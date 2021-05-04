import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getRouteParameters } from 'volto-datablocks/helpers';
import { getDataFromProvider } from 'volto-datablocks/actions';
import qs from 'querystring';

const getConnectorURL = (
  provider_url,
  location,
  routeParmeters,
  allowedParams,
  pagination,
) => {
  const params = {
    ...qs.parse(location.search.replace('?', '')),
    ...routeParmeters,
  };
  let allowedParamsObj = null;
  if (allowedParams) {
    allowedParamsObj = {};
    allowedParams.forEach((param) => {
      allowedParamsObj[param] = params[param];
    });
  }

  let paramsStr =
    '?' +
    qs.stringify({
      ...(allowedParamsObj || params),
      ...(pagination.enabled
        ? { p: pagination.activePage, nrOfHits: pagination.itemsPerPage }
        : {}),
    });

  paramsStr = paramsStr.length === 1 ? '' : paramsStr;

  return {
    url: provider_url ? `${provider_url}${paramsStr}` : null,
    urlConnector: provider_url
      ? `${provider_url}/@connector-data${paramsStr}`
      : null,
    params: paramsStr,
  };
};

/**
 * connectBlockToProviderData.
 *
 * @param {} WrappedComponent
 */
export function connectBlockToProviderData(WrappedComponent, config = {}) {
  return withRouter((props) => {
    const dispatch = useDispatch();
    const [pagination, setPagination] = useState({
      activePage: 1,
      enabled: config.pagination?.getEnabled?.(props) || false,
      itemsPerPage: config.pagination?.getItemsPerPage?.(props) || 5,
      prevPage: null,
      totalItems: null,
      maxItems: Infinity,
      renderedPages: [],
    });
    const { provider_url = null } = props.data;

    const allowedParams = props.data.allowedParams?.length
      ? props.data.allowedParams
      : null;

    const state = useSelector((state) => {
      return {
        connected_data_parameters: state.connected_data_parameters,
        data_providers: state.data_providers,
        search: state.search,
      };
    });

    const routeParameters = getRouteParameters(
      provider_url,
      state.connected_data_parameters,
      props.match,
    );

    const connector = getConnectorURL(
      provider_url,
      props.location,
      routeParameters,
      allowedParams,
      pagination,
    );

    const prevConnector =
      pagination.enabled && pagination.prevPage
        ? getConnectorURL(
            provider_url,
            props.location,
            routeParameters,
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

    const updatePagination = useCallback(
      (data) => {
        const newPagination = { ...pagination, ...data };
        if (data.activePage && data.activePage !== pagination.activePage) {
          newPagination.prevPage = pagination.activePage;
        }
        setPagination(newPagination);
      },
      [pagination],
    );

    useEffect(() => {
      if (provider_url && !provider_data && !isPending && !isFailed) {
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
            renderedPages: [...pagination.renderedPages, pagination.activePage],
          };
          setPagination({ ...newPagination });
        }
      }
    }, [
      connector.params,
      isFailed,
      isPending,
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
}

export default connectBlockToProviderData;
