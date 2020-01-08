/*
 * Watch the content route changes and update the redux store data query
 * parameters
 */

import { useEffect } from 'react';
import { connect } from 'react-redux';
import { setConnectedDataParameters } from '../actions';

function ConnectedDataParameterWatcher(props) {
  const contentPath = props.content?.['@id'] || null;
  const dataQuery = props.content?.data_query || null;
  const setConnectedDataParameters = props.setConnectedDataParameters;
  // const location = props.location;

  useEffect(() => {
    if (contentPath !== null && dataQuery)
      setConnectedDataParameters(contentPath, dataQuery, true);
  }, [contentPath, dataQuery, setConnectedDataParameters]);
  return '';
}

export default connect(
  (state, props) => ({
    content: state.content.data,
    // location: state.router.location,
  }),
  { setConnectedDataParameters },
)(ConnectedDataParameterWatcher);
