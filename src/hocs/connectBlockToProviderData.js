import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getRouteParameters } from 'volto-datablocks/helpers';
import { getDataFromProvider } from 'volto-datablocks/actions';
import qs from 'querystring';

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
      itemsPerPage: config.pagination?.getItemsPerPage?.(props) || 5,
      totalItems: 0,
      enabled: config.pagination?.getEnabled?.(props) || false,
    });

    const { provider_url = null } = props.data;

    const state = useSelector((state) => {
      return {
        connected_data_parameters: state.connected_data_parameters,
        data_providers: state.data_providers,
      };
    });

    let params =
      '?' +
      qs.stringify({
        ...qs.parse(props.location.search.replace('?', '')),
        ...getRouteParameters(
          provider_url,
          state.connected_data_parameters,
          props.match,
        ),
        ...(pagination.enabled
          ? { p: pagination.activePage, nrOfHits: pagination.itemsPerPage }
          : {}),
      });

    params = params.length === 1 ? '' : params;

    const url = provider_url ? `${provider_url}${params}` : null;
    const urlConnector = provider_url
      ? `${provider_url}/@connector-data${params}`
      : null;

    const isPending = provider_url
      ? state.data_providers?.pendingConnectors?.[url]
      : false;

    const isFailed = provider_url
      ? state.data_providers?.failedConnectors?.[url]
      : false;

    const provider_data = provider_url
      ? state.data_providers?.data?.[urlConnector]
      : null;

    const updatePagination = (data) => {
      setPagination({ ...pagination, ...data });
    };

    React.useEffect(() => {
      if (provider_url && !provider_data && !isPending && !isFailed) {
        dispatch(getDataFromProvider(provider_url, null, params));
      }
    });

    return (
      <WrappedComponent
        {...props}
        provider_data={provider_data}
        updatePagination={updatePagination}
        pagination={pagination}
      />
    );
  });
}

export default connectBlockToProviderData;
