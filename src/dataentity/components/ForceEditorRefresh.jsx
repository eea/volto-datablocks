import { connect } from 'react-redux';
import { Component } from 'react';
import { forceDraftEditorRefresh } from 'volto-addons/actions';

class ForceRefresh extends Component {
  componentWillUpdate(nextProps) {
    if (nextProps.editorKey !== this.props.editorKey)
      this.props.forceDraftEditorRefresh(nextProps.editorKey);
  }
  render() {
    return '';
  }
}

export default connect(
  null,
  { forceDraftEditorRefresh },
)(ForceRefresh);
