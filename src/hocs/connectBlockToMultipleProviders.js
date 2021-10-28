import React from 'react';
import { withRouter } from 'react-router';
import { connect, useDispatch } from 'react-redux';
import { getDataFromProvider } from '../actions';
import { getConnector } from '../helpers';

/**
 * connectBlockToMultipleProviders.
 *
 * @param {} WrappedComponent
 */
export function connectBlockToMultipleProviders(WrappedComponent, config = {}) {
  return connect((state) => ({
    route_parameters: state.route_parameters,
    data_providers: state.data_providers,
  }))(
    withRouter((props) => {
      const dispatch = useDispatch();
      const allowedParams = props.data?.allowedParams?.length
        ? props.data.allowedParams
        : null;

      const providersSource = React.useMemo(() => {
        return props.data.providers?.filter((provider) => provider.url) || [];
      }, [props.data.providers?.filter]);

      const providers_data = React.useMemo(() => {
        const data = {};
        providersSource.forEach((source) => {
          const connector = getConnector(
            source.url,
            props.location,
            props.route_parameters,
            allowedParams,
          );
          data[source.name] =
            props.data_providers?.data?.[connector.urlConnector];
        });
        return data;
      }, [
        allowedParams,
        providersSource,
        props.location,
        props.route_parameters,
        props.data_providers?.data,
      ]);

      React.useEffect(() => {
        providersSource.forEach((source) => {
          const connector = getConnector(
            source.url,
            props.location,
            props.route_parameters,
            allowedParams,
          );
          const isPending =
            props.data_providers?.pendingConnectors?.[connector.url];
          const isFailed =
            props.data_providers?.failedConnectors?.[connector.url];
          const provider_data =
            props.data_providers?.data?.[connector.urlConnector];

          const readyToDispatch = !provider_data && !isPending && !isFailed;

          if (readyToDispatch) {
            dispatch(getDataFromProvider(source.url, null, connector.params));
          }
        });
      }, [
        dispatch,
        allowedParams,
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
}

export default connectBlockToMultipleProviders;
