import React from 'react';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { useDispatch, useSelector } from 'react-redux';
import { flattenToAppURL } from '@plone/volto/helpers';

export function connectAnythingToProviderData(getProviderUrl) {
  return (WrappedComponent) => {
    return (props) => {
      const dispatch = useDispatch();

      const base = getProviderUrl(props);
      const provider_url = base ? flattenToAppURL(base) : base;

      // console.log('provider_url', provider_url, props);

      const isPending = useSelector((state) => {
        if (provider_url === null) return false;

        const url = `${provider_url}`;
        const rv = provider_url
          ? state.data_providers?.pendingConnectors?.[url]
          : false;
        return rv;
      });

      const provider_data = useSelector((state) => {
        if (provider_url === null) return null;

        const url = `${provider_url}/@connector-data`;
        return provider_url ? state.data_providers?.data?.[url] : null;
      });

      React.useEffect(() => {
        if (provider_url && !provider_data && !isPending) {
          dispatch(getDataFromProvider(provider_url));
        }
      });
      return <WrappedComponent {...props} provider_data={provider_data} />;
    };
  };
}

export default connectAnythingToProviderData;
