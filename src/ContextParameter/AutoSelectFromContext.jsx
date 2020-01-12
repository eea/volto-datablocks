/*
 * A simple select that would automatically populate its options based on the
 * context selected data queries
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getQuerystring } from '@plone/volto/actions';
import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';

class SelectContextParameter extends Component {
  componentDidMount() {
    this.props.getQuerystring();
  }

  componentDidUpdate(prevProps) {}

  render() {
    return <>Nothing to configure yet</>;
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
