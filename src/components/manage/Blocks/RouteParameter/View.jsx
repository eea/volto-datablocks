import React, { useState } from 'react';
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
  const [index, setIndex] = useState(-1);
  const { dataParameters = [] } = props;
  const {
    providerUrl = null,
    parameterKey = null,
    defaultValue = null,
  } = props.data;
  const parameters = props.match.params;

  const updateIndex = () => {
    let newIndex = index;
    if (providerUrl && dataParameters?.length) {
      newIndex = dataParameters.length;
    } else if (providerUrl && !dataParameters?.length) {
      newIndex = 0;
    } else {
      newIndex = -1;
    }
    if (newIndex !== index) {
      setIndex(newIndex);
    }
    return newIndex;
  };

  const getRouteParameter = (parameterKey, parameterValue, defaultValue) => {
    return {
      i: parameterKey,
      o: 'plone.app.querystring.operation.selection.any',
      v: [getRouteParameterValue(parameterValue, defaultValue)],
    };
  };

  React.useEffect(() => {
    const nextIndex = updateIndex();
    if (nextIndex > -1 && providerUrl) {
      props.setRouteParameter(
        providerUrl,
        nextIndex,
        getRouteParameter(parameterKey, parameters[parameterKey], defaultValue),
      );
    }
    return () => {
      props.deleteRouteParameter(providerUrl, nextIndex);
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
        props.providerUrl,
      ),
    }),
    { setRouteParameter, deleteRouteParameter },
  ),
)(withRouter(View));
