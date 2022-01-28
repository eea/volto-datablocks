import React, { useEffect, useMemo, useState } from 'react';
import { withRouter } from 'react-router';
import { connect, useDispatch } from 'react-redux';
import hash from 'object-hash';
import { flattenToAppURL } from '@plone/volto/helpers';
import { getDataFromProvider } from '../actions';
import { getConnectorPath, getForm, getDataQuery } from '../helpers';

/**
 * connectToMultipleProviders.
 *
 * @param {} WrappedComponent
 */
export function connectToMultipleProviders(getConfig = () => ({})) {
  return (WrappedComponent) => {
    return connect((state) => ({
      connected_data_parameters: state.connected_data_parameters,
      data_providers: state.data_providers,
    }))(
      withRouter((props) => {
        const dispatch = useDispatch();
        const config = useMemo(() => getConfig(props), [props]);
        const [mounted, setMounted] = useState(false);
        const [state, setState] = useState({
          form: [],
          data_query: [],
          hashValues: [],
          connectorsPath: [],
        });

        const providers = useMemo(() => {
          return config.providers || [];
        }, [config]);

        useEffect(() => {
          const newState = {
            form: [],
            data_query: [],
            hashValues: [],
            connectorsPath: [],
          };
          providers.forEach((provider, index) => {
            const provider_url = flattenToAppURL(
              provider.provider_url || provider.url,
            )?.replace(/\/$/, '');
            // Get form
            newState.form.push(
              getForm({ ...provider, location: props.location }),
            );
            // Get data query
            newState.data_query.push(
              getDataQuery({
                provider_url,
                location: props.location,
                connected_data_parameters: props.connected_data_parameters,
                data: {
                  data_query: provider.data_query,
                  has_data_query_by_context: provider.has_data_query_by_context,
                  has_data_query_by_provider:
                    provider.has_data_query_by_provider,
                },
              }),
            );
            // Get hash value
            const _hash_1 = hash(newState.form[index]);
            const _hash_2 = hash(newState.data_query[index]);
            newState.hashValues.push(hash(_hash_1 + _hash_2));
            // Get connector path
            newState.connectorsPath.push(
              getConnectorPath(provider_url, newState.hashValues[index]),
            );
          });
          setState({ ...newState });
        }, [providers, props.location, props.connected_data_parameters]);

        const providers_data = useMemo(() => {
          const data = {};
          providers.forEach((provider, index) => {
            const provider_url = flattenToAppURL(
              provider.provider_url || provider.url,
            )?.replace(/\/$/, '');
            if (!provider_url || !state.hashValues[index]) return;
            const title = provider.name || provider.title || provider_url;
            data[title] =
              props.data_providers?.data?.[provider_url]?.[
                state.hashValues[index]
              ];
          });
          return data;
        }, [state, providers, props.data_providers.data]);

        const providers_metadata = useMemo(() => {
          const data = {};
          providers.forEach((provider, index) => {
            const provider_url = flattenToAppURL(
              provider.provider_url || provider.url,
            )?.replace(/\/$/, '');
            if (!provider_url || !state.hashValues[index]) return;
            const title = provider.name || provider.title || provider_url;
            data[title] =
              props.data_providers?.metadata?.[provider_url]?.[
                state.hashValues[index]
              ];
          });
          return data;
        }, [state, providers, props.data_providers.metadata]);

        useEffect(() => {
          if (!mounted && __CLIENT__) {
            setMounted(true);
            return;
          }
          providers.forEach((provider, index) => {
            const provider_url = flattenToAppURL(
              provider.provider_url || provider.url,
            )?.replace(/\/$/, '');
            const form = state.form[index];
            const data_query = state.data_query[index];
            const hashValue = state.hashValues[index];
            const connectorPath = state.connectorsPath[index];

            const provider_data = provider_url
              ? props.data_providers?.data?.[provider_url]?.[hashValue]
              : null;

            const isPending = provider_url
              ? props.data_providers?.pendingConnectors?.[connectorPath]
              : false;

            const isFailed = provider_url
              ? props.data_providers?.failedConnectors?.[connectorPath]
              : false;

            const readyToDispatch =
              provider_url &&
              hashValue &&
              connectorPath &&
              !provider_data &&
              !isPending &&
              !isFailed;

            if (readyToDispatch) {
              dispatch(
                getDataFromProvider(provider_url, form, data_query, hashValue),
              );
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
          state,
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

export default connectToMultipleProviders;
