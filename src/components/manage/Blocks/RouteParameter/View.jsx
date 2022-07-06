import React from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { flattenToAppURL } from '@plone/volto/helpers';
import { setRouteParameter, deleteRouteParameter } from '../../../../actions';

const View = (props) => {
  const dispatch = useDispatch();
  const mounted = React.useRef(false);
  const { parameterKey = null, defaultValue = null } = props.data;
  const parameters = props.match.params;
  const contentPath = flattenToAppURL(props.properties['@id']);
  const path = props.mode === 'edit' ? contentPath : props.path;

  React.useEffect(() => {
    if (!mounted.current) return;
    if (parameterKey && defaultValue && path === contentPath) {
      dispatch(deleteRouteParameter(parameterKey));
      dispatch(
        setRouteParameter({
          i: parameterKey,
          o: 'plone.app.querystring.operation.selection.any',
          v: [parameters[parameterKey] || defaultValue],
        }),
      );
    }
    /* eslint-disable-next-line */
  }, [parameterKey, defaultValue]);

  React.useEffect(() => {
    mounted.current = true;
    if (parameterKey && defaultValue && path === contentPath) {
      dispatch(
        setRouteParameter({
          i: parameterKey,
          o: 'plone.app.querystring.operation.selection.any',
          v: [parameters[parameterKey] || defaultValue],
        }),
      );
    }

    return () => {
      mounted.current = false;
      if (parameterKey) {
        dispatch(deleteRouteParameter(parameterKey));
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
          {parameterKey && defaultValue ? (
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

export default withRouter(View);
