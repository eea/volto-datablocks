import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router';
import { connect, useDispatch } from 'react-redux';
import { getDataFromProvider } from '../actions';
import { getConnector } from '../helpers';

/**
 * connectBlockToProviderData.
 *
 * @param {} WrappedComponent
 */
export function connectBlockToProviderData(WrappedComponent, config = {}) {
  return connect((state) => ({
    route_parameters: state.route_parameters,
    data_providers: state.data_providers,
  }))(
    withRouter((props) => {
      const dispatch = useDispatch();
      const [mounted, setMounted] = useState(false);
      const [pagination, setPagination] = useState({
        activePage: 1,
        enabled: config.pagination?.getEnabled?.(props) || false,
        itemsPerPage: config.pagination?.getItemsPerPage?.(props) || 5,
        prevPage: null,
        lastPage: Infinity,
        renderedPages: [],
        providerData: {},
      });
      const { provider_url = null } = props.data;

      const allowedParams = props.data?.allowedParams?.length
        ? props.data.allowedParams
        : null;

      const connector = getConnector(
        provider_url,
        props.location,
        props.route_parameters,
        allowedParams,
        pagination,
      );

      const isPending = provider_url
        ? props.data_providers?.pendingConnectors?.[connector.url]
        : false;

      const isFailed = provider_url
        ? props.data_providers?.failedConnectors?.[connector.url]
        : false;

      const provider_data = provider_url
        ? props.data_providers?.data?.[connector.urlConnector]
        : null;

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
        const newPagination = {
          ...pagination,
          providerData: { ...pagination.providerData },
        };

        if (!mounted) {
          setMounted(true);
        }

        if (readyToDispatch) {
          dispatch(getDataFromProvider(provider_url, null, connector.params));
        }

        if (provider_data && pagination.enabled && !isPending) {
          const dataLength =
            provider_data[Object.keys(provider_data)[0]]?.length || 0;
          if (!pagination.renderedPages.includes(pagination.activePage)) {
            if (!dataLength && pagination.activePage > 1) {
              newPagination.activePage = pagination.prevPage;
            }
            newPagination.renderedPages = [
              ...pagination.renderedPages,
              pagination.activePage,
            ];
          }

          newPagination.providerData[pagination.activePage] = {
            ...(provider_data || {}),
          };

          if (
            JSON.stringify(
              newPagination.providerData[pagination.activePage],
            ) !== JSON.stringify(pagination.providerData[pagination.activePage])
          ) {
            newPagination.lastPage = Infinity;
          }

          if (!dataLength && pagination.activePage > 1) {
            newPagination.lastPage = pagination.prevPage;
          } else if (dataLength < pagination.itemsPerPage) {
            newPagination.lastPage = pagination.activePage;
          }

          if (JSON.stringify(newPagination) !== JSON.stringify(pagination)) {
            setPagination({
              ...newPagination,
            });
          }
        }
      }, [
        mounted,
        readyToDispatch,
        isPending,
        connector.params,
        dispatch,
        pagination,
        provider_data,
        provider_url,
      ]);

      return (
        <WrappedComponent
          {...props}
          provider_data={provider_data}
          isPending={isPending}
          updatePagination={updatePagination}
          pagination={pagination}
        />
      );
    }),
  );
}

export default connectBlockToProviderData;
