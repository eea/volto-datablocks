import React, {
  useEffect,
  useCallback,
  useMemo,
  useState,
  useRef,
} from 'react';
import { withRouter } from 'react-router';
import { connect, useDispatch } from 'react-redux';
import { isEqual } from 'lodash';
import hash from 'object-hash';
import { flattenToAppURL } from '@plone/volto/helpers';
import { getDataFromProvider } from '../actions';
import { getConnectorPath, getForm, getDataQuery } from '../helpers';
import { ConnectorContext } from '.';

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
 * connectToPopupProviderData.
 *
 * @param {} getProviderUrl
 */
export function connectToPopupProviderData(getConfig = () => ({})) {
  return (WrappedComponent) => {
    return connect((state) => ({
      route_parameters: state.route_parameters,
      connected_data_parameters: state.connected_data_parameters,
      data_providers: state.data_providers,
    }))(
      withRouter((props) => {
        const dispatch = useDispatch();
        const config = useMemo(() => getConfig(props), [props]);
        const [mounted, setMounted] = useState(false);
        const [state, setState] = useState({});
        const [pagination, setPagination] = useState(
          getInitialPagination(config),
        );
        const prevHashValue = useRef(null);

        const popup_provider_url = useMemo(
          () => flattenToAppURL(config.popup_provider_url)?.replace(/\/$/, ''),
          [config.popup_provider_url],
        );
        const form = useMemo(
          () =>
            getForm({
              ...props,
              pagination,
              extraQuery: state.extraQuery,
            }),
          [props, pagination, state.extraQuery],
        );
        const data_query = useMemo(
          () => getDataQuery({ ...props, pagination, popup_provider_url }),
          [props, pagination, popup_provider_url],
        );

        const hashValue = useMemo(() => {
          const _hash_1 = hash(form);
          const _hash_2 = hash(data_query);
          return hash(_hash_1 + _hash_2);
        }, [form, data_query]);

        const connectorPath = useMemo(
          () => getConnectorPath(popup_provider_url, hashValue),
          [popup_provider_url, hashValue],
        );

        const popup_provider_data = popup_provider_url
          ? props.data_providers?.data?.[popup_provider_url]?.[hashValue]
          : null;

        console.log('hashval', hashValue);
        console.log('connectorPath', connectorPath);
        console.log('popup_provider_data', popup_provider_data);

        const prev_popup_provider_data = popup_provider_url
          ? props.data_providers?.data?.[popup_provider_url]?.[
              prevHashValue.current
            ]
          : null;

        const provider_metadata = popup_provider_url
          ? props.data_providers?.metadata?.[popup_provider_url]?.[hashValue]
          : null;

        const prev_provider_metadata = popup_provider_url
          ? props.data_providers?.metadata?.[popup_provider_url]?.[
              prevHashValue.current
            ]
          : null;

        const isPending = popup_provider_url
          ? props.data_providers?.pendingConnectors?.[connectorPath]
          : false;

        const isFailed = popup_provider_url
          ? props.data_providers?.failedConnectors?.[connectorPath]
          : false;

        const activePageHasData = pagination.enabled
          ? !!pagination.data[pagination.activePage]
          : false;

        const readyToDispatch =
          mounted &&
          popup_provider_url &&
          !popup_provider_data &&
          !isPending &&
          !isFailed;

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
              getDataFromProvider(
                popup_provider_url,
                form,
                data_query,
                hashValue,
              ),
            );
          }

          if (
            popup_provider_data &&
            !isPending &&
            pagination.enabled &&
            !activePageHasData
          ) {
            const dataLength =
              popup_provider_data[Object.keys(popup_provider_data)[0]]
                ?.length || 0;
            newPagination.totalItems =
              (pagination.totalItems || 0) + dataLength;
            newPagination = {
              ...newPagination,
              activePage:
                !dataLength && pagination.activePage > 1
                  ? pagination.prevPage
                  : pagination.activePage,
              prevPage:
                !dataLength && pagination.activePage > 1
                  ? null
                  : pagination.prevPage,
              data: {
                ...pagination.data,
                [pagination.activePage]: popup_provider_data,
              },
            };
            if (!dataLength && pagination.activePage > 1) {
              newPagination.lastPage = pagination.prevPage;
            } else if (dataLength < pagination.itemsPerPage) {
              newPagination.lastPage = pagination.activePage;
            }
            setPagination({ ...newPagination });
          } else if (
            popup_provider_data &&
            !isPending &&
            pagination.enabled &&
            activePageHasData &&
            !isEqual(
              popup_provider_data,
              pagination.data[pagination.activePage],
            )
          ) {
            const dataLength =
              popup_provider_data[Object.keys(popup_provider_data)[0]]
                ?.length || 0;
            newPagination.totalItems = dataLength;
            newPagination = {
              ...newPagination,
              activePage: 1,
              prevPage: null,
              data: {
                1:
                  pagination.activePage > 1
                    ? pagination.data[pagination.activePage]
                    : popup_provider_data,
              },
            };
            if (
              dataLength < newPagination.itemsPerPage &&
              pagination.activePage === 1
            ) {
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
          isPending,
          mounted,
          pagination,
          popup_provider_data,
          popup_provider_url,
          readyToDispatch,
        ]);

        return (
          <ConnectorContext.Provider value={{ state, setState }}>
            <WrappedComponent
              {...props}
              popup_provider_data={
                pagination.enabled
                  ? popup_provider_data
                  : popup_provider_data || prev_popup_provider_data
              }
              prev_popup_provider_data={prev_popup_provider_data}
              provider_metadata={provider_metadata}
              prev_provider_metadata={prev_provider_metadata}
              loadingProviderData={isPending}
              updatePagination={updatePagination}
              pagination={pagination}
            />
          </ConnectorContext.Provider>
        );
      }),
    );
  };
}

export default connectToPopupProviderData;
