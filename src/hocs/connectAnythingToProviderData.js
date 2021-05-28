import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { flattenToAppURL } from '@plone/volto/helpers';
import { getDataFromProvider } from '../actions';
import { getConnector } from '../helpers';

/**
 * connectAnythingToProviderData.
 *
 * @param {} getProviderUrl
 */
export function connectAnythingToProviderData(getProviderUrl, config = {}) {
  return (WrappedComponent) => {
    return withRouter((props) => {
      const dispatch = useDispatch();
      const [mounted, setMounted] = useState(false);
      const [pagination, setPagination] = useState({
        activePage: 1,
        enabled: config.pagination?.getEnabled?.(props) || false,
        itemsPerPage: config.pagination?.getItemsPerPage?.(props) || 5,
        prevPage: null,
        totalItems: null,
        maxItems: Infinity,
        renderedPages: [],
      });

      const base = getProviderUrl(props);
      const provider_url = base ? flattenToAppURL(base) : base;

      const state = useSelector((state) => {
        return {
          route_parameters: state.route_parameters,
          data_providers: state.data_providers,
        };
      });

      const allowedParams = props.data.allowedParams?.length
        ? props.data.allowedParams
        : null;

      const connector = getConnector(
        provider_url,
        props.location,
        state.route_parameters,
        allowedParams,
        pagination,
      );

      const prevConnector =
        pagination.enabled && pagination.prevPage
          ? getConnector(
              provider_url,
              props.location,
              state.route_parameters,
              allowedParams,
              {
                ...pagination,
                activePage: pagination.prevPage,
              },
            )
          : null;

      const isPending = provider_url
        ? state.data_providers?.pendingConnectors?.[connector.url]
        : false;

      const isFailed = provider_url
        ? state.data_providers?.failedConnectors?.[connector.url]
        : false;

      const provider_data = provider_url
        ? state.data_providers?.data?.[connector.urlConnector]
        : null;

      const prev_provider_data =
        prevConnector && provider_url
          ? state.data_providers?.data?.[prevConnector.urlConnector]
          : null;

      const readyToDispatch =
        mounted && provider_url && !provider_data && !isPending && !isFailed;

      const updatePagination = React.useCallback(
        (data) => {
          const newPagination = { ...pagination, ...data };
          if (data.activePage && data.activePage !== pagination.activePage) {
            newPagination.prevPage = pagination.activePage;
          }
          setPagination(newPagination);
        },
        [pagination],
      );

      React.useEffect(() => {
        if (!mounted) {
          setMounted(true);
        }

        if (readyToDispatch) {
          dispatch(getDataFromProvider(provider_url, null, connector.params));
        }

        if (provider_data && !isPending) {
          let newPagination = { ...pagination };
          const dataLength =
            provider_data[Object.keys(provider_data)[0]]?.length || 0;
          newPagination.totalItems = pagination.totalItems + dataLength;

          if (!pagination.enabled && pagination.totalItems === null) {
            setPagination({ ...newPagination });
          }

          if (
            pagination.enabled &&
            !pagination.renderedPages.includes(pagination.activePage)
          ) {
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
              maxItems:
                dataLength < pagination.itemsPerPage
                  ? newPagination.totalItems
                  : pagination.maxItems,
              renderedPages: [
                ...pagination.renderedPages,
                pagination.activePage,
              ],
            };
            setPagination({ ...newPagination });
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
          prev_provider_data={prev_provider_data}
          isPending={isPending}
          updatePagination={updatePagination}
          pagination={pagination}
        />
      );
    });
  };
}

export default connectAnythingToProviderData;
