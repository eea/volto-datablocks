import {
  forwardRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
  useRef,
} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import isEqual from 'lodash/isEqual';
import isUndefined from 'lodash/isUndefined';
import { getDataFromProvider } from '@eeacms/volto-datablocks/actions';
import {
  getProviderUrl,
  getConnectorPath,
  getForm,
  getDataQuery,
  getDataProviderHash,
  getDataProviderPayload,
  getDataProviderKey,
} from '@eeacms/volto-datablocks/helpers';
import { ConnectorContext } from './';

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
    return connect(
      (state) => ({
        content: state.content.data,
        connected_data_parameters: state.connected_data_parameters,
        data_providers: state.data_providers,
      }),
      null,
      null,
      { forwardRef: true },
    )(
      forwardRef((props, ref) => {
        const location = useLocation();
        const dispatch = useDispatch();
        const params = useParams();
        const config = useMemo(() => getConfig(props), [props]);
        const [mounted, setMounted] = useState(false);
        const [state, setState] = useState({});
        const [pagination, setPagination] = useState(
          getInitialPagination(config),
        );
        const lastProviderData = useRef({
          providerUrl: null,
          dataKey: null,
        });

        const provider_url = useMemo(
          () => getProviderUrl(config.provider_url),
          [config.provider_url],
        );

        const form = useMemo(
          () =>
            getDataProviderPayload(
              getForm({
                ...props,
                location,
                pagination,
                extraQuery: state.extraQuery,
                extraConditions: state.extraConditions,
              }),
            ).form,
          [
            props,
            location,
            pagination,
            state.extraQuery,
            state.extraConditions,
          ],
        );
        const data_query = useMemo(
          () =>
            // some blocks need unfiltered access to the data, for example
            // a chart that shows data for all the countries
            props.data?.filter_connector_data_at_source === false
              ? []
              : getDataQuery({
                  ...props,
                  location,
                  params,
                  pagination,
                  provider_url,
                }),
          [props, location, params, pagination, provider_url],
        );
        const allParams = {
          ...form,
          ...(data_query || []).reduce((acc, item) => {
            acc[item.i] = item.v;
            return acc;
          }, {}),
        };

        const hashValue = useMemo(
          () => getDataProviderHash(form, data_query),
          [form, data_query],
        );

        const connectorPath = useMemo(
          () => getConnectorPath(provider_url, hashValue),
          [provider_url, hashValue],
        );

        const providerData = props.data_providers?.data?.[provider_url];
        const providerDataKey = getDataProviderKey(
          providerData,
          hashValue,
          form,
          data_query,
        );

        const provider_data = provider_url
          ? providerData?.[providerDataKey]
          : null;

        const previousProviderDataKey =
          lastProviderData.current.providerUrl === provider_url
            ? lastProviderData.current.dataKey
            : null;

        const prev_provider_data = provider_url
          ? providerData?.[previousProviderDataKey]
          : null;

        const provider_metadata = provider_url
          ? props.data_providers?.metadata?.[provider_url]?.[providerDataKey]
          : null;

        const prev_provider_metadata = provider_url
          ? props.data_providers?.metadata?.[provider_url]?.[
              previousProviderDataKey
            ]
          : null;

        const isPending = provider_url
          ? props.data_providers?.pendingConnectors?.[connectorPath] ?? false
          : false;

        const isFailed = provider_url
          ? props.data_providers?.failedConnectors?.[connectorPath] ?? false
          : false;

        const waitForParams =
          config.waitForParams ?? props.data?.waitForParams ?? false;

        const hasAllAllowedParams = waitForParams
          ? (props.data?.allowedParams || []).every(
              (param) => param in allParams,
            )
          : true;

        const activePageHasData = pagination.enabled
          ? !!pagination.data[pagination.activePage]
          : false;

        const readyToDispatch =
          mounted &&
          provider_url &&
          hasAllAllowedParams &&
          !provider_data &&
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
          if (!isPending && !isUndefined(provider_data)) {
            lastProviderData.current = {
              providerUrl: provider_url,
              dataKey: providerDataKey,
            };
          }
        }, [isPending, provider_data, providerDataKey, provider_url]);

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
                [pagination.activePage]: provider_data,
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
            !isEqual(provider_data, pagination.data[pagination.activePage])
          ) {
            const dataLength =
              provider_data[Object.keys(provider_data)[0]]?.length || 0;
            newPagination.totalItems = dataLength;
            newPagination = {
              ...newPagination,
              activePage: 1,
              prevPage: null,
              data: {
                1:
                  pagination.activePage > 1
                    ? pagination.data[pagination.activePage]
                    : provider_data,
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
          provider_data,
          provider_url,
          readyToDispatch,
        ]);

        return (
          <ConnectorContext.Provider value={{ state, setState }}>
            <WrappedComponent
              {...props}
              ref={ref}
              location={location}
              provider_data={
                pagination.enabled
                  ? provider_data
                  : provider_data || prev_provider_data
              }
              prev_provider_data={prev_provider_data}
              provider_metadata={provider_metadata}
              prev_provider_metadata={prev_provider_metadata}
              loadingProviderData={
                !!provider_url && (isPending || isUndefined(provider_data))
              }
              failedProviderData={isFailed}
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
