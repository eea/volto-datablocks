import React, { useEffect, useMemo, useState } from 'react';
import { withRouter } from 'react-router';
import { connect, useDispatch } from 'react-redux';
import { getDataFromProvider } from '../actions';
import { getProviderUrl, getConnectorPath } from '../helpers';
/**
 * connectToProviderData.
 *
 * @param {} getProviderUrl
 */
export function connectToProviderDataUnfiltered(getConfig = () => ({})) {
  return (WrappedComponent) => {
    return connect((state) => ({
      data_providers: state.data_providers,
    }))(
      withRouter((props) => {
        const dispatch = useDispatch();
        const config = useMemo(() => getConfig(props), [props]);
        const [mounted, setMounted] = useState(false);

        const provider_url = useMemo(
          () => getProviderUrl(config.provider_url),
          [config.provider_url],
        );

        const connectorPath = useMemo(() => getConnectorPath(provider_url), [
          provider_url,
        ]);

        const provider_data = provider_url
          ? props.data_providers?.data?.[provider_url]?._default
          : null;

        const provider_metadata = provider_url
          ? props.data_providers?.metadata?.[provider_url]?._default
          : null;

        const isPending = provider_url
          ? props.data_providers?.pendingConnectors?.[connectorPath]
          : false;

        const isFailed = provider_url
          ? props.data_providers?.failedConnectors?.[connectorPath]
          : false;

        const readyToDispatch =
          mounted && provider_url && !provider_data && !isPending && !isFailed;

        useEffect(() => {
          if (!mounted) {
            setMounted(true);
          }

          if (readyToDispatch) {
            dispatch(getDataFromProvider(provider_url));
          }
        }, [
          mounted,
          readyToDispatch,
          isPending,
          dispatch,
          provider_data,
          provider_url,
        ]);

        return (
          <WrappedComponent
            {...props}
            provider_data={provider_data}
            provider_metadata={provider_metadata}
            loadingProviderData={isPending}
          />
        );
      }),
    );
  };
}

export default connectToProviderDataUnfiltered;
