import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { ObjectBrowserWidget } from '@plone/volto/components';
import { getDataFromProvider } from '../../../actions';
import { getConnector } from '../../../helpers';

function getId(url) {
  const split = url.split('/');
  return split[split.length - 1];
}

function getUrl(value) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length) return value[0]['@id'];
  if (typeof value === 'object') return value['@id'];

  return value;
}

const PickProvider = (props) => {
  const dispatch = useDispatch();
  const [mounted, setMounted] = React.useState(false);
  let { value, onChange } = props;
  if (typeof value === 'string') {
    value = [{ '@id': value, title: getId(value) }];
  }
  const provider_url = getUrl(value);
  const connector = getConnector(
    provider_url,
    props.location,
    props.route_parameters,
  );

  const isPending = provider_url
    ? props.data_providers?.pendingConnectors?.[connector.url]
    : false;

  const isFailed = provider_url
    ? props.data_providers?.failedConnectors?.[connector.url]
    : false;

  const provider_data = provider_url
    ? props.data_providers?.data?.[connector.urlConnector]
    : null;

  const readyToDispatch =
    mounted && provider_url && !provider_data && !isPending && !isFailed;

  React.useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }

    if (readyToDispatch) {
      dispatch(getDataFromProvider(provider_url, null, connector.params));
    }
  }, [
    mounted,
    readyToDispatch,
    connector.params,
    dispatch,
    provider_data,
    provider_url,
  ]);

  return (
    <ObjectBrowserWidget
      {...props}
      value={value}
      mode="link"
      onChange={(id, value) => {
        if (value && value.length) {
          onChange(id, value[0]['@id']);
        } else if (value) {
          onChange(id, value['@id']);
        } else {
          onChange(id, null);
        }
      }}
    />
  );
};

export default connect(
  (state, props) => ({
    data_providers: state.data_providers,
    connected_data_parameters: state.connected_data_parameters,
    route_parameters: state.route_parameters,
  }),
  { getDataFromProvider },
)(withRouter(PickProvider));
