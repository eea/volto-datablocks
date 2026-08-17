/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect, useDispatch } from 'react-redux';
import { getDataFromProvider } from '@eeacms/volto-datablocks/actions';
import {
  getProviderUrl,
  getConnectorPath,
  getForm,
  getDataQuery,
  getDataProviderHash,
  getDataProviderPayload,
  getDataProviderKey,
} from '@eeacms/volto-datablocks/helpers';

/**
 * connectToMultipleProviders.
 *
 * @param {} WrappedComponent
 */
export function connectToMultipleProviders(getConfig = () => ({})) {
  return (WrappedComponent) => {
    return connect((state) => ({
      content: state.content.data,
      connected_data_parameters: state.connected_data_parameters,
      data_providers: state.data_providers,
    }))(
      withRouter((props) => {
        const dispatch = useDispatch();
        const params = useParams();
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
            const provider_url = getProviderUrl(
              provider.provider_url || provider.url,
            );
            // Get form
            newState.form.push(
              getDataProviderPayload(
                getForm({ ...provider, location: props.location }),
              ).form,
            );
            // Get data query
            newState.data_query.push(
              getDataQuery({
                ...props,
                params,
                provider_url,
                data: {
                  ...(provider.data || {}),
                  data_query: provider.data_query,
                  has_data_query_by_context: provider.has_data_query_by_context,
                  has_data_query_by_provider:
                    provider.has_data_query_by_provider,
                },
              }),
            );
            // Get hash value
            newState.hashValues.push(
              getDataProviderHash(
                newState.form[index],
                newState.data_query[index],
              ),
            );
            // Get connector path
            newState.connectorsPath.push(
              getConnectorPath(provider_url, newState.hashValues[index]),
            );
          });
          setState({ ...newState });
        }, [
          providers,
          params,
          props.location,
          props.connected_data_parameters,
        ]);

        const providers_data = useMemo(() => {
          const data = {};
          providers.forEach((provider, index) => {
            const provider_url = getProviderUrl(
              provider.provider_url || provider.url,
            );
            if (!provider_url || !state.hashValues[index]) return;
            const title = provider.name || provider.title || provider_url;
            const providerData = props.data_providers?.data?.[provider_url];
            const providerDataKey = getDataProviderKey(
              providerData,
              state.hashValues[index],
              state.form[index],
              state.data_query[index],
            );
            data[title] = providerData?.[providerDataKey];
          });
          return data;
        }, [state, providers, props.data_providers?.data]);

        const providers_metadata = useMemo(() => {
          const data = {};
          providers.forEach((provider, index) => {
            const provider_url = getProviderUrl(
              provider.provider_url || provider.url,
            );
            if (!provider_url || !state.hashValues[index]) return;
            const title = provider.name || provider.title || provider_url;
            const providerData = props.data_providers?.data?.[provider_url];
            const providerDataKey = getDataProviderKey(
              providerData,
              state.hashValues[index],
              state.form[index],
              state.data_query[index],
            );
            data[title] =
              props.data_providers?.metadata?.[provider_url]?.[providerDataKey];
          });
          return data;
        }, [
          state,
          providers,
          props.data_providers?.data,
          props.data_providers?.metadata,
        ]);

        useEffect(() => {
          if (!mounted && __CLIENT__) {
            setMounted(true);
            return;
          }
          providers.forEach((provider, index) => {
            const provider_url = getProviderUrl(
              provider.provider_url || provider.url,
            );
            const form = state.form[index];
            const data_query = state.data_query[index];
            const allParams = {
              ...form,
              ...(data_query || []).reduce((acc, item) => {
                acc[item.i] = item.v;
                return acc;
              }, {}),
            };
            const hashValue = state.hashValues[index];
            const connectorPath = state.connectorsPath[index];

            const providerData = props.data_providers?.data?.[provider_url];
            const providerDataKey = getDataProviderKey(
              providerData,
              hashValue,
              form,
              data_query,
            );
            const provider_data = provider_url
              ? providerData?.[providerDataKey]
              : null;

            const isPending = provider_url
              ? props.data_providers?.pendingConnectors?.[connectorPath]
              : false;

            const isFailed = provider_url
              ? props.data_providers?.failedConnectors?.[connectorPath]
              : false;

            const waitForParams =
              provider.waitForParams ?? provider.data?.waitForParams ?? false;

            const hasAllAllowedParams = waitForParams
              ? (provider.data?.allowedParams || []).every(
                  (param) => param in allParams,
                )
              : true;

            const readyToDispatch =
              provider_url &&
              hashValue &&
              connectorPath &&
              hasAllAllowedParams &&
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
