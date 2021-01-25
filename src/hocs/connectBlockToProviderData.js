import React from 'react';
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

    const { data = {} } = props;
    const { provider_url = null } = data;
    const search = history.location.search;

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

      const url = `${provider_url}/@connector-data${search}`;
      return provider_url ? state.data_providers?.data?.[url] : null;
    });

    React.useEffect(() => {
      if (provider_url && !provider_data && !isPending) {
        dispatch(getDataFromProvider(provider_url, null, search));
      }
    });
    return <WrappedComponent {...props} provider_data={provider_data} />;
  };
}

export default connectBlockToProviderData;
