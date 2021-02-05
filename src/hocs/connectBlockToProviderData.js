import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMatchParams } from 'volto-datablocks/helpers';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { flattenToAppURL } from '@plone/volto/helpers';
import qs from 'querystring';

/**
 * connectBlockToProviderData.
 *
 * @param {} WrappedComponent
 */
export function connectBlockToProviderData(WrappedComponent, config = {}) {
  return withRouter((props) => {
    let history = useHistory();
    const dispatch = useDispatch();
    const [pagination, setPagination] = useState({
      activePage: 1,
      itemsPerPage: 5,
      totalItems: 0,
      enabled: config.hasPagination || false,
    });

    const { data = {} } = props;
    const { provider_url = null } = data;
    const contentPath = flattenToAppURL(props.properties?.['@id'] || '');
    const matchParams = getMatchParams(props.match);

    const router_parameters = useSelector((state) => {
      return { ...matchParams, ...state.router_parameters.data };
    });

    const params =
      '?' +
      qs.stringify({
        ...qs.parse(history.location.search.replace('?', '')),
        ...(router_parameters || {}),
        ...(pagination.enabled
          ? { p: pagination.activePage, nrOfHits: pagination.itemsPerPage }
          : {}),
      });

    const isPending = useSelector((state) => {
      if (provider_url === null) return false;

      const url = `${provider_url}${params}`;
      const rv = provider_url
        ? state.data_providers?.pendingConnectors?.[url]
        : false;
      return rv;
    });

    const provider_data = useSelector((state) => {
      if (provider_url === null) return null;
      const url = `${provider_url}/@connector-data${params}`;
      return provider_url ? state.data_providers?.data?.[url] : null;
    });

    const ready = contentPath === props.path;

    const updatePagination = (data) => {
      setPagination({ ...pagination, ...data });
    };

    React.useEffect(() => {
      if (ready && provider_url && !provider_data && !isPending) {
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
