import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getRouteParameters } from 'volto-datablocks/helpers';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { flattenToAppURL } from '@plone/volto/helpers';
import qs from 'querystring';

/**
 * connectAnythingToProviderData.
 *
 * @param {} getProviderUrl
 */
export function connectAnythingToProviderData(getProviderUrl, config = {}) {
  return (WrappedComponent) => {
    return withRouter((props) => {
      const dispatch = useDispatch();
      const [pagination, setPagination] = useState({
        activePage: 1,
        itemsPerPage: config.pagination?.getItemsPerPage?.(props) || 5,
        totalItems: 0,
        enabled: config.pagination?.getEnabled?.(props) || false,
      });

      const base = getProviderUrl(props);
      const provider_url = base ? flattenToAppURL(base) : base;

      const state = useSelector((state) => {
        return {
          connected_data_parameters: state.connected_data_parameters,
          data_providers: state.data_providers,
        };
      });

      const params =
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

      const url = `${provider_url}${params}`;
      const urlConnector = `${provider_url}/@connector-data${params}`;

      const isPending = provider_url
        ? state.data_providers?.pendingConnectors?.[url]
        : false;

      const provider_data = provider_url
        ? state.data_providers?.data?.[urlConnector]
        : null;

      const updatePagination = (data) => {
        setPagination({ ...pagination, ...data });
      };

      React.useEffect(() => {
        if (provider_url && !provider_data && !isPending) {
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
  };
}

export default connectAnythingToProviderData;
