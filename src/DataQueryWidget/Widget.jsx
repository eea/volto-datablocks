import QueryWidget from '@plone/volto/components/manage/Widgets/QuerystringWidget';
import { connect } from 'react-redux';
import { getDataQuerystring } from '../actions';

class DataQueryWidget extends QueryWidget {
  componentDidMount() {
    if (this.props.focus) {
      this.node.focus();
    }
    this.props.getDataQuerystring();
  }
}

export default connect(
  state => ({
    indexes: state.dataquerystring.indexes,
  }),
  { getDataQuerystring },
)(DataQueryWidget);
