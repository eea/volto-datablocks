import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { useDispatch, useSelector } from 'react-redux';

/**
 * connectBlockToProviderData.
 *
 * @param {} WrappedComponent
 */
export function connectBlockToProviderData(WrappedComponent) {
  return (props) => {
    let history = useHistory();
    const dispatch = useDispatch();
    const [pagination, setPagination] = useState({
      activePage: 1,
      itemsPerPage: 5,
      totalItems: 0,
      enabled: false,
    });

    const { data = {} } = props;
    const { provider_url = null } = data;
    const search = history.location.search;
    const paginationString = pagination.enabled
      ? search.length
        ? `p=${pagination.activePage}&nrOfHits=${pagination.itemsPerPage}`
        : `?p=${pagination.activePage}&nrOfHits=${pagination.itemsPerPage}`
      : '';

    const updatePagination = (data) => {
      setPagination({ ...pagination, ...data });
    };

    const isPending = useSelector((state) => {
      if (provider_url === null) return false;

      const url = `${provider_url}${search}`;
      const rv = provider_url
        ? state.data_providers?.pendingConnectors?.[url]
        : false;
      return rv;
    });

    const provider_data = useSelector((state) => {
      if (provider_url === null) return null;
      const url = `${provider_url}/@connector-data${search}${paginationString}`;
      return provider_url ? state.data_providers?.data?.[url] : null;
    });

    React.useEffect(() => {
      if (provider_url && !provider_data && !isPending) {
        dispatch(
          getDataFromProvider(provider_url, null, search, paginationString),
        );
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
  };
}

export default connectBlockToProviderData;
