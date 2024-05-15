import React, {
  useEffect,
  useCallback,
  useMemo,
  useState,
  useRef,
} from 'react';
import { useParams } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect, useDispatch } from 'react-redux';
import isEqual from 'lodash/isEqual';
import isUndefined from 'lodash/isUndefined';
import hash from 'object-hash';
import { getDataFromProvider } from '../actions';
import {
  getProviderUrl,
  getConnectorPath,
  getForm,
  getDataQuery,
} from '../helpers';
import { ConnectorContext } from './';

const splitArray = (array, size) =>
  Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
    array.slice(i * size, i * size + size),
  );

const getInitialPagination = (config = {}) => {
  return {
    activePage: 1,
    enabled: config.pagination?.enabled || false,
    itemsPerPage: config.pagination?.itemsPerPage || 5,
    prevPage: null,
    totalItems: null,
    lastPage: Infinity,
    data: {},
  };
};

/**
 * connectToProviderData.
 *
 * @param {} getProviderUrl
 */
export function connectToProviderData(getConfig = () => ({})) {
  return (WrappedComponent) => {
    return connect((state) => ({
      content: state.content.data,
      connected_data_parameters: state.connected_data_parameters,
      data_providers: state.data_providers,
    }))(
      withRouter((props) => {
        // console.log('props', props);
        const dispatch = useDispatch();
        const params = useParams();
        const config = useMemo(() => getConfig(props), [props]);
        const [mounted, setMounted] = useState(false);
        const [state, setState] = useState({});
        const [pagination, setPagination] = useState(
          getInitialPagination(config),
        );
        const prevHashValue = useRef(null);

        const provider_url = useMemo(
          () => getProviderUrl(config.provider_url),
          [config.provider_url],
        );

        const form = useMemo(
          () =>
            getForm({
              ...props,
              pagination,
              extraQuery: state.extraQuery,
              extraConditions: state.extraConditions,
            }),
          [props, pagination, state.extraQuery, state.extraConditions],
        );
        const data_query = useMemo(
          () =>
            // some blocks need unfiltered access to the data, for example
            // a chart that shows data for all the countries
            props.data?.filter_connector_data_at_source === false
              ? []
              : getDataQuery({ ...props, params, pagination, provider_url }),
          [props, params, pagination, provider_url],
        );

        const hashValue = useMemo(() => {
          const _hash_1 = hash(form);
          const _hash_2 = hash(data_query);
          return hash(_hash_1 + _hash_2);
        }, [form, data_query]);

        const connectorPath = useMemo(
          () => getConnectorPath(provider_url, hashValue),
          [provider_url, hashValue],
        );

        const provider_data = provider_url
          ? props.data_providers?.data?.[provider_url]?.[hashValue]
          : null;

        const prev_provider_data = provider_url
          ? props.data_providers?.data?.[provider_url]?.[prevHashValue.current]
          : null;

        const provider_metadata = provider_url
          ? props.data_providers?.metadata?.[provider_url]?.[hashValue]
          : null;

        const prev_provider_metadata = provider_url
          ? props.data_providers?.metadata?.[provider_url]?.[
              prevHashValue.current
            ]
          : null;

        const isPending = provider_url
          ? props.data_providers?.pendingConnectors?.[connectorPath] ?? false
          : false;

        const isFailed = provider_url
          ? props.data_providers?.failedConnectors?.[connectorPath] ?? false
          : false;

        const activePageHasData = pagination.enabled
          ? !!pagination.data[pagination.activePage]
          : false;

        const readyToDispatch =
          mounted && provider_url && !provider_data && !isPending && !isFailed;

        const updatePagination = useCallback(
          (data) => {
            const newPagination = { ...pagination, ...data };
            if (data.activePage && data.activePage !== pagination.activePage) {
              newPagination.prevPage = pagination.activePage;
            }
            setPagination({ ...newPagination });
          },
          [pagination],
        );

        useEffect(() => {
          if (!isPending) {
            prevHashValue.current = hashValue;
          }
          /* eslint-disable-next-line */
        }, [isPending]);

        useEffect(() => {
          setPagination(getInitialPagination(config));
          /* eslint-disable-next-line */
        }, [config.pagination?.enabled, config.pagination?.itemsPerPage]);

        useEffect(() => {
          let newPagination = { ...pagination };

          if (!mounted && __CLIENT__) {
            setMounted(true);
          }

          if (readyToDispatch) {
            dispatch(
              getDataFromProvider(provider_url, form, data_query, hashValue),
            );
          }
          console.log(pagination.activePage);
          if (
            provider_data &&
            !isPending &&
            pagination.enabled &&
            !activePageHasData
          ) {
            const dataLength =
              provider_data[Object.keys(provider_data)[0]]?.length || 0;
            newPagination.totalItems =
              (pagination.totalItems || 0) + dataLength;
            newPagination = {
              ...newPagination,
              ...pagination.data,
              activePage:
                !dataLength && pagination.activePage > 1
                  ? pagination.prevPage
                  : pagination.activePage,
              prevPage:
                !dataLength && pagination.activePage > 1
                  ? null
                  : pagination.prevPage,
              lastPage: parseInt(
                provider_data[Object.keys(provider_data || {})?.[0]].length /
                  pagination.itemsPerPage +
                  1,
              ),
              data: {
                [pagination.activePage]: Object.keys(
                  provider_data || {},
                )?.reduce((res, currentKey) => {
                  let values = splitArray(
                    provider_data[currentKey],
                    pagination.itemsPerPage,
                  )?.[
                    pagination.activePage - 1 <=
                    (provider_data[currentKey].length %
                      pagination.itemsPerPage ===
                    0
                      ? provider_data[currentKey].length /
                          pagination.itemsPerPage -
                        1
                      : parseInt(
                          provider_data[currentKey].length /
                            pagination.itemsPerPage,
                        ))
                      ? pagination.activePage - 1
                      : provider_data[currentKey].length %
                          pagination.itemsPerPage ===
                        0
                      ? provider_data[currentKey].length /
                          pagination.itemsPerPage -
                        1
                      : parseInt(
                          provider_data[currentKey].length /
                            pagination.itemsPerPage,
                        )
                  ];

                  return { ...res, [currentKey]: values || [] };
                }, {}),
              },
            };
            if (!dataLength && pagination.activePage > 1) {
              newPagination.lastPage = pagination.prevPage;
            } else if (dataLength < pagination.itemsPerPage) {
              newPagination.lastPage = pagination.activePage;
            }
            setPagination({ ...newPagination });
          } else if (
            provider_data &&
            !isPending &&
            pagination.enabled &&
            activePageHasData &&
            !isEqual(provider_data, pagination.provider_data)
          ) {
            console.log(provider_data);
            const dataLength =
              provider_data[Object.keys(provider_data)[0]]?.length || 0;
            newPagination.totalItems = dataLength;
            newPagination = {
              ...newPagination,
              activePage:
                !dataLength && pagination.activePage > 1
                  ? pagination.prevPage
                  : pagination.activePage,
              prevPage: null,
              provider_data: provider_data,
              lastPage: parseInt(
                provider_data[Object.keys(provider_data || {})?.[0]].length /
                  pagination.itemsPerPage +
                  1,
              ),
              data: {
                [pagination.activePage]: Object.keys(
                  provider_data || {},
                )?.reduce((res, currentKey) => {
                  let values = splitArray(
                    provider_data[currentKey],
                    pagination.itemsPerPage,
                  )?.[
                    pagination.activePage - 1 <=
                    (provider_data[currentKey].length %
                      pagination.itemsPerPage ===
                    0
                      ? provider_data[currentKey].length /
                          pagination.itemsPerPage -
                        1
                      : parseInt(
                          provider_data[currentKey].length /
                            pagination.itemsPerPage,
                        ))
                      ? pagination.activePage - 1
                      : provider_data[currentKey].length %
                          pagination.itemsPerPage ===
                        0
                      ? provider_data[currentKey].length /
                          pagination.itemsPerPage -
                        1
                      : parseInt(
                          provider_data[currentKey].length /
                            pagination.itemsPerPage,
                        )
                  ];

                  return { ...res, [currentKey]: values || [] };
                }, {}),
              },
            };
            if (!dataLength && pagination.activePage > 1) {
              newPagination.lastPage = pagination.prevPage;
            } else if (dataLength < pagination.itemsPerPage) {
              newPagination.lastPage = pagination.activePage;
            }
            if (!dataLength && pagination.activePage > 1) {
              newPagination.lastPage = pagination.prevPage;
            } else if (dataLength < pagination.itemsPerPage) {
              newPagination.lastPage = pagination.activePage;
            } else {
              newPagination.lastPage = Infinity;
            }
            setPagination({ ...newPagination });
          }
        }, [
          activePageHasData,
          config,
          data_query,
          dispatch,
          form,
          hashValue,
          pagination,
          isPending,
          mounted,
          provider_data,
          provider_url,
          readyToDispatch,
        ]);

        return (
          <ConnectorContext.Provider value={{ state, setState }}>
            <WrappedComponent
              {...props}
              provider_data={
                pagination.enabled
                  ? provider_data
                  : provider_data || prev_provider_data
              }
              prev_provider_data={prev_provider_data}
              provider_metadata={provider_metadata}
              prev_provider_metadata={prev_provider_metadata}
              loadingProviderData={isPending || isUndefined(provider_data)}
              hasProviderUrl={!!provider_url}
              updatePagination={updatePagination}
              pagination={
                process.env.JEST_WORKER_ID
                  ? {
                      ...pagination,
                      data: {
                        1: provider_data,
                      },
                    }
                  : pagination
              }
            />
          </ConnectorContext.Provider>
        );
      }),
    );
  };
}

export default connectToProviderData;
