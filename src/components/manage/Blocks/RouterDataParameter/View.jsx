import React from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { getRouterParameterValue } from './';
import {
  setRouterParameter,
  deleteRouterParameter,
} from 'volto-datablocks/actions';

const View = (props) => {
  const dispatch = useDispatch();
  const { param = null, defaultValue = null } = props.data;
  const { params = {} } = props.match;

  React.useEffect(() => {
    dispatch(
      setRouterParameter(
        param,
        getRouterParameterValue(params[param], defaultValue),
      ),
    );
    return () => {
      dispatch(deleteRouterParameter(param));
    };
    /* eslint-disable-next-line */
  }, []);

  return (
    <>
      {props.mode === 'edit' ? (
        <>
          {!param ? <p>Set parameter key</p> : ''}
          {!defaultValue ? <p>Set default value</p> : ''}
          {param && defaultValue ? (
            <p>Router data parameter is up and running for {param}</p>
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

export default withRouter(View);
