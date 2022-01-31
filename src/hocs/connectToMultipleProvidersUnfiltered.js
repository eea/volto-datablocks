import React, { useEffect, useMemo, useState } from 'react';
import { withRouter } from 'react-router';
import { connect, useDispatch } from 'react-redux';
import { flattenToAppURL } from '@plone/volto/helpers';
import { getDataFromProvider } from '../actions';
import { getConnectorPath } from '../helpers';

/**
 * connectToMultipleProvidersUnfiltered.
 *
 * @param {} WrappedComponent
 */
export function connectToMultipleProvidersUnfiltered(getConfig = () => ({})) {
  return (WrappedComponent) => {
    return connect((state) => ({
      connected_data_parameters: state.connected_data_parameters,
      data_providers: state.data_providers,
    }))(
      withRouter((props) => {
        const dispatch = useDispatch();
        const config = useMemo(() => getConfig(props), [props]);
        const [mounted, setMounted] = useState(false);

        const providers = useMemo(() => {
          return config.providers || [];
        }, [config]);

        const providers_data = useMemo(() => {
          const data = {};
          providers.forEach((provider) => {
            const provider_url = flattenToAppURL(
              provider.provider_url || provider.url,
            )?.replace(/\/$/, '');
            if (!provider_url) return;
            const title = provider.name || provider.title || provider_url;
            data[title] = props.data_providers?.data?.[provider_url]?._default;
          });
          return data;
        }, [providers, props.data_providers?.data]);

        const providers_metadata = useMemo(() => {
          const data = {};
          providers.forEach((provider) => {
            const provider_url = flattenToAppURL(
              provider.provider_url || provider.url,
            )?.replace(/\/$/, '');
            if (!provider_url) return;
            const title = provider.name || provider.title || provider_url;
            data[title] =
              props.data_providers?.metadata?.[provider_url]?._default;
          });
          return data;
        }, [providers, props.data_providers?.metadata]);

        useEffect(() => {
          if (!mounted && __CLIENT__) {
            setMounted(true);
            return;
          }
          providers.forEach((provider, index) => {
            const provider_url = flattenToAppURL(
              provider.provider_url || provider.url,
            )?.replace(/\/$/, '');
            const connectorPath = getConnectorPath(provider_url);

            const provider_data = provider_url
              ? props.data_providers?.data?.[provider_url]?._default
              : null;

            const isPending = provider_url
              ? props.data_providers?.pendingConnectors?.[connectorPath]
              : false;

            const isFailed = provider_url
              ? props.data_providers?.failedConnectors?.[connectorPath]
              : false;

            const readyToDispatch =
              provider_url &&
              connectorPath &&
              !provider_data &&
              !isPending &&
              !isFailed;

            if (readyToDispatch) {
              dispatch(getDataFromProvider(provider_url));
            }
          });
        }, [
          dispatch,
          mounted,
          props.location,
          props.data_providers,
          props.data_providers?.pendingConnectors,
          props.data_providers?.failedConnectors,
          props.data_providers?.data,
          providers,
        ]);

        return (
          <WrappedComponent
            {...props}
            providers_data={providers_data}
            providers_metadata={providers_metadata}
          />
        );
      }),
    );
  };
}

export default connectToMultipleProvidersUnfiltered;
