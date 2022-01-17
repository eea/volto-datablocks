import React, { useMemo, useState } from 'react';
import { withRouter } from 'react-router';
import { connect, useDispatch } from 'react-redux';
import hash from 'object-hash';
import { flattenToAppURL } from '@plone/volto/helpers';
import { getDataFromProvider } from '../actions';
import { getConnectorPath } from '../helpers';

/**
 * connectBlockToMultipleProviders.
 *
 * @param {} WrappedComponent
 */
export function connectBlockToMultipleProviders(getConfig = () => ({})) {
  return (WrappedComponent) => {
    return connect((state) => ({
      data_providers: state.data_providers,
    }))(
      withRouter((props) => {
        const dispatch = useDispatch();

        const providersSource = React.useMemo(() => {
          return props.data.providers?.filter((provider) => provider.url) || [];
        }, [props.data.providers?.filter]);

        const providers_data = React.useMemo(() => {
          const data = {};
          providersSource.forEach((source) => {
            data[source.name] =
              props.data_providers?.data?.[source.url]?._default;
          });
          return data;
        }, [providersSource, props.data_providers.data]);

        React.useEffect(() => {
          providersSource.forEach((source) => {
            const connectorPath = getConnectorPath(source.url);

            const provider_data = source.url
              ? props.data_providers?.data?.[source.url]?._default
              : null;

            const isPending = source.url
              ? props.data_providers?.pendingConnectors?.[connectorPath]
              : false;

            const isFailed = source.url
              ? props.data_providers?.failedConnectors?.[connectorPath]
              : false;

            const readyToDispatch =
              source.url && !provider_data && !isPending && !isFailed;

            if (readyToDispatch) {
              dispatch(getDataFromProvider(source.url));
            }
          });
        }, [
          dispatch,
          props.location,
          props.route_parameters,
          props.data_providers,
          props.data_providers?.pendingConnectors,
          props.data_providers?.failedConnectors,
          props.data_providers?.data,
          providersSource,
        ]);

        return <WrappedComponent {...props} providers_data={providers_data} />;
      }),
    );
  };
}

export default connectBlockToMultipleProviders;
