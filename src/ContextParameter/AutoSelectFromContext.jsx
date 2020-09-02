/*
 * A simple select that would automatically populate its options based on the
 * context selected data queries
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getQuerystring } from '@plone/volto/actions';

class SelectContextParameter extends Component {
  componentDidMount() {
    this.props.getQuerystring();
  }

  componentDidUpdate(prevProps) {}

  render() {
    return <>Select data parameter block. Nothing to configure yet</>;
  }
}

export default connect(
  (state, props) => {
    return {
      connected_data_parameters: state.connected_data_parameters,
    };
  },
  { getQuerystring },
)(SelectContextParameter);
