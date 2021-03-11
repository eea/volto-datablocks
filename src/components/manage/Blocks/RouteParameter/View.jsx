import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { getRouteParameterValue } from './';
import {
  setRouteParameter,
  deleteRouteParameter,
} from 'volto-datablocks/actions';
import { getConnectedDataParametersForRoute } from 'volto-datablocks/helpers';

const View = (props) => {
  const {
    providerUrl = null,
    parameterKey = null,
    defaultValue = null,
  } = props.data;
  const parameters = props.match.params;

  const getRouteParameter = (parameterKey, parameterValue, defaultValue) => {
    return {
      i: parameterKey,
      o: 'plone.app.querystring.operation.selection.any',
      v: [getRouteParameterValue(parameterValue, defaultValue)],
    };
  };

  React.useEffect(() => {
    if (providerUrl) {
      props.setRouteParameter(
        providerUrl,
        0,
        getRouteParameter(parameterKey, parameters[parameterKey], defaultValue),
      );
    }
    return () => {
      if (providerUrl) {
        props.deleteRouteParameter(providerUrl, 0);
      }
    };
    /* eslint-disable-next-line */
  }, []);

  return (
    <>
      {props.mode === 'edit' ? (
        <>
          {!providerUrl ? <p>Set data provider</p> : ''}
          {!parameterKey ? <p>Set parameter key</p> : ''}
          {!defaultValue ? <p>Set default value</p> : ''}
          {providerUrl && parameterKey && defaultValue ? (
            <p>
              Router data parameter is up and running for {providerUrl} with '
              {parameterKey}' key
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

export default compose(
  connect(
    (state, props) => ({
      dataParameters: getConnectedDataParametersForRoute(
        state.connected_data_parameters,
        props.data.providerUrl,
      ),
    }),
    { setRouteParameter, deleteRouteParameter },
  ),
)(withRouter(View));
