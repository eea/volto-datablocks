import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { flattenToAppURL } from '@plone/volto/helpers';
import {
  setRouteParameter,
  deleteRouteParameter,
} from 'volto-datablocks/actions';

const View = (props) => {
  const {
    providerUrl = null,
    parameterKey = null,
    defaultValue = null,
  } = props.data;
  const route_parameters = props.route_parameters;
  const parameters = props.match.params;
  const contentPath = flattenToAppURL(props.properties['@id']);
  const path = props.mode === 'edit' ? contentPath : props.path;

  React.useEffect(() => {
    if (parameterKey && defaultValue && path === contentPath) {
      props.dispatch(
        setRouteParameter(
          parameterKey,
          parameters[parameterKey] || defaultValue,
        ),
      );
    }

    return () => {
      if (parameterKey && route_parameters[parameterKey]) {
        props.dispatch(deleteRouteParameter(parameterKey));
      }
    };
    /* eslint-disable-next-line */
  }, []);

  return (
    <>
      {props.mode === 'edit' ? (
        <>
          {!parameterKey ? <p>Set parameter key</p> : ''}
          {!defaultValue ? <p>Set default value</p> : ''}
          {providerUrl && parameterKey && defaultValue ? (
            <p>
              Router parameter is up and running for '{parameterKey}' with '
              {defaultValue}' as default value
            </p>
          ) : (
            ''
          )}
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default connect((state) => ({
  route_parameters: state.route_parameters,
}))(withRouter(View));
