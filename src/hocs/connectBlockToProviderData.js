import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { withRouter } from 'react-router';
import { connect, useDispatch } from 'react-redux';
import { getDataFromProvider } from '../actions';
import { getConnectorPath, getForm, getDataQuery } from '../helpers';
import { ConnectorContext } from './';

/**
 * connectBlockToProviderData.
 *
 * @param {} WrappedComponent
 */
export function connectBlockToProviderData(getConfig = () => ({})) {
  return (WrappedComponent) => {
    return connect((state) => ({
      route_parameters: state.route_parameters,
      data_providers: state.data_providers,
      content: state.content,
    }))(
      withRouter((props) => {
        const dispatch = useDispatch();
        const config = useMemo(() => getConfig(props), [props]);
        const [mounted, setMounted] = useState(false);
        const [state, setState] = useState({});
        const [pagination, setPagination] = useState({
          activePage: 1,
          enabled: config.pagination?.enabled || false,
          itemsPerPage: config.pagination?.itemsPerPage || 5,
          prevPage: null,
          totalItems: null,
          lastPage: Infinity,
          data: {},
        });
        const provider_url = useMemo(() => config.provider_url, [config]);
        // console.log('HERE', getConnectedDataParametersForProvider());
        const connectorPath = useMemo(
          () => getConnectorPath(provider_url, pagination),
          [provider_url, pagination],
        );

        const form = useMemo(() => getForm({ ...props, pagination }), [
          props,
          pagination,
        ]);
        const data_query = useMemo(
          () => getDataQuery({ ...props, pagination }),
          [props, pagination],
        );

        const provider_data = provider_url
          ? props.data_providers?.data?.[connectorPath]
          : null;

        const isPending = provider_url
          ? props.data_providers?.pendingConnectors?.[connectorPath]
          : false;

        const isFailed = provider_url
          ? props.data_providers?.failedConnectors?.[connectorPath]
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
          if (!mounted) {
            setMounted(true);
          }

          if (readyToDispatch) {
            dispatch(getDataFromProvider(provider_url, form, data_query));
          }

          if (provider_data && !isPending && pagination.enabled) {
            // Request for active page finalized
            let newPagination = { ...pagination };
            const dataLength =
              provider_data[Object.keys(provider_data)[0]]?.length || 0;
            newPagination.totalItems =
              (pagination.totalItems || 0) + dataLength;
            if (!pagination.data[pagination.activePage]) {
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
                  ...(dataLength
                    ? { [pagination.activePage]: provider_data }
                    : {}),
                },
              };
              if (!dataLength && pagination.activePage > 1) {
                newPagination.lastPage = pagination.prevPage;
              } else if (dataLength < pagination.itemsPerPage) {
                newPagination.lastPage = pagination.activePage;
              }
              setPagination({ ...newPagination });
            }
          }
        }, [
          mounted,
          readyToDispatch,
          isPending,
          dispatch,
          pagination,
          provider_data,
          provider_url,
          data_query,
          form,
        ]);

        return (
          <ConnectorContext.Provider value={{ state, setState }}>
            <WrappedComponent
              {...props}
              provider_data={provider_data}
              isPending={isPending}
              updatePagination={updatePagination}
              pagination={pagination}
            />
          </ConnectorContext.Provider>
        );
      }),
    );
  };
}

export default connectBlockToProviderData;
