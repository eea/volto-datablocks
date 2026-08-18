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
  hasAllDataProviderParams,
} from '@eeacms/volto-datablocks/helpers';

const getProviderConnection = (provider, props, params) => {
  const providerUrl = getProviderUrl(provider.provider_url || provider.url);
  const form = getDataProviderPayload(
    getForm({ ...provider, location: props.location }),
  ).form;
  const dataQuery = getDataQuery({
    ...props,
    params,
    provider_url: providerUrl,
    data: {
      ...(provider.data || {}),
      data_query: provider.data_query,
      has_data_query_by_context: provider.has_data_query_by_context,
      has_data_query_by_provider: provider.has_data_query_by_provider,
    },
  });
  const hashValue = getDataProviderHash(form, dataQuery);
  const connectorPath = getConnectorPath(providerUrl, hashValue);
  const providerData = props.data_providers?.data?.[providerUrl];
  const providerDataKey = getDataProviderKey(
    providerData,
    hashValue,
    form,
    dataQuery,
  );
  const waitForParams =
    provider.waitForParams ?? provider.data?.waitForParams ?? false;
  const waitingForParams =
    waitForParams &&
    !hasAllDataProviderParams({
      allowedParams: provider.data?.allowedParams,
      form,
      dataQuery,
    });

  return {
    providerUrl,
    title: provider.name || provider.title || providerUrl,
    form,
    dataQuery,
    hashValue,
    connectorPath,
    waitingForParams,
    data: providerData?.[providerDataKey],
    metadata: props.data_providers?.metadata?.[providerUrl]?.[providerDataKey],
    pending: props.data_providers?.pendingConnectors?.[connectorPath] ?? false,
    failed: props.data_providers?.failedConnectors?.[connectorPath] ?? false,
  };
};

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
        const providers = config.providers || [];

        const connections = useMemo(
          () =>
            providers
              .map((provider) => getProviderConnection(provider, props, params))
              .filter(({ providerUrl }) => providerUrl),
          [providers, props, params],
        );

        const connectedProps = useMemo(
          () =>
            connections.reduce(
              (result, connection) => {
                const { title, waitingForParams } = connection;
                result.data[title] = waitingForParams
                  ? undefined
                  : connection.data;
                result.metadata[title] = waitingForParams
                  ? undefined
                  : connection.metadata;
                result.waitingForParams[title] = waitingForParams;
                return result;
              },
              { data: {}, metadata: {}, waitingForParams: {} },
            ),
          [connections],
        );

        useEffect(() => {
          if (!mounted && __CLIENT__) {
            setMounted(true);
            return;
          }

          connections.forEach((connection) => {
            const {
              providerUrl,
              form,
              dataQuery,
              hashValue,
              connectorPath,
              waitingForParams,
              data,
              pending,
              failed,
            } = connection;
            const readyToDispatch =
              providerUrl &&
              hashValue &&
              connectorPath &&
              !waitingForParams &&
              !data &&
              !pending &&
              !failed;

            if (readyToDispatch) {
              dispatch(
                getDataFromProvider(providerUrl, form, dataQuery, hashValue),
              );
            }
          });
        }, [dispatch, mounted, connections]);

        return (
          <WrappedComponent
            {...props}
            providers_data={connectedProps.data}
            providers_metadata={connectedProps.metadata}
            providers_waiting_for_params={connectedProps.waitingForParams}
          />
        );
      }),
    );
  };
}

export default connectToMultipleProviders;
