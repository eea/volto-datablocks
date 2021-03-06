/*
 * NOTE: This is not used anymore!
 *
 * Watch the content route changes and update the redux store data query
 * parameters
 */

import { useEffect } from 'react';
import { connect } from 'react-redux';
import { setConnectedDataParameters } from '../actions';
import { getBaseUrl } from '@plone/volto/helpers';

function ConnectedDataParameterWatcher(props) {
  // const contentPath = props.content?.['@id'] || null;
  const contentPath = getBaseUrl(props.content['@id']); // generic fallback path
  const dataQuery = props.content?.data_query || null;
  const setConnectedDataParameters = props.setConnectedDataParameters;
  // const location = props.location;

  useEffect(() => {
    if (contentPath !== null && dataQuery)
      setConnectedDataParameters(contentPath, dataQuery, false);
  }, [contentPath, dataQuery, setConnectedDataParameters]);
  return '';
}

export default connect(
  (state, props) => {
    const pathname = state.router?.location?.pathname || '';
    return {
      content: state.prefetch?.[pathname] || state.content.data,
      // location: state.router.location,
    };
  },
  { setConnectedDataParameters },
)(ConnectedDataParameterWatcher);
