/*
 * Watch the content route changes and update the redux store data query
 * parameters
 */

import { useEffect } from 'react';
import { connect } from 'react-redux';
import { setConnectedDataParameters } from '../actions';

function ConnectedDataParameterWatcher(props) {
  const contentPath = props.content['@id'];
  const dataQuery = props.content?.data_query || null;
  useEffect(() => {
    if (dataQuery) setConnectedDataParameters(contentPath, dataQuery);
  }, [contentPath, dataQuery]);
  return '';
}

export default connect((state, props) => ({
  content: state.content.data,
}))(ConnectedDataParameterWatcher);
