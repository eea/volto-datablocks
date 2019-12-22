import { connect } from 'react-redux';
import { QuerystringWidget } from '@plone/volto/components/manage/Widgets/QuerystringWidget';
import { getQuerystring } from '@plone/volto/actions';
import { DATACONNECTOR_PARAMS_GROUP } from '../constants';

// import { getDataQuerystring } from '../actions';

function filterIndexes(indexes) {
  const res = {};
  Object.keys(indexes).forEach(k => {
    if (indexes[k].group === DATACONNECTOR_PARAMS_GROUP) res[k] = indexes[k];
  });
  return res;
}

export default connect(
  state => ({
    indexes: filterIndexes(state.querystring.indexes),
  }),
  // { getQuerystring: getDataQuerystring },
  { getQuerystring },
)(QuerystringWidget);
