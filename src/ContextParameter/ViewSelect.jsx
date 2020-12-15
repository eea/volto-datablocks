// TODO: this module needs to be restructured, the setConnectedDataParameters
// needs to be adjusted
import React, { Component } from 'react';
import { connect } from 'react-redux';
import loadable from '@loadable/component';
import { getQuerystring } from '@plone/volto/actions';
import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
import { setConnectedDataParameters } from '../actions';
import { find } from 'lodash';

const Select = loadable(() => import('react-select'));

function indexValuesToChoices(values) {
  // values is an object such as
  // values: { BG: { title: "BG"}}
  return Object.keys(values).map(k => [k, values[k].title]);
}

function adjustedParams(data_query, index, value) {
  // tweak a data_query by replacing the value
  // "data_query": [
  //       {
  //               "i": "NUTS_CODE",
  //               "o": "plone.app.querystring.operation.selection.any",
  //               "v": [
  //                 "BG"
  //               ]
  //             }
  //     ],
  return (data_query || []).map(iov =>
    iov.i !== index
      ? iov
      : {
          ...iov,
          v: [value],
        },
  );
}

function findValueFromParams(params_data, index) {
  return find(params_data, { i: index })?.v?.[0];
}

class ViewSelect extends Component {
  componentDidMount() {
    this.props.getQuerystring();
  }

  componentDidUpdate(prevProps) {
    if (!this.props.querystring) {
      this.props.getQuerystring();
    }
  }

  render() {
    const { data_query, connected_data_parameters, querystring } = this.props;
    const providerUrl = this.props.data?.provider_url || '';

    // console.log('connected data parameters:', connected_data_parameters);
    // console.log('context data query: ', data_query);
    // console.log('querystring', querystring);

    return data_query && querystring ? (
      <>
        {data_query.map(({ i, o, v }) => {
          const id = `sel-${i}`;
          const onEdit = () => {};

          const value = findValueFromParams(connected_data_parameters, i);
          // console.log('my value', value);

          const choices = indexValuesToChoices(querystring[i]?.values || {});
          // onChange(id, data.value === 'no-value' ? undefined : data.value)
          return (
            <Select
              id={`field-${id}`}
              key={`select-i`}
              name={id}
              disabled={onEdit !== null}
              className="react-select-container"
              classNamePrefix="react-select"
              options={[
                ...choices.map(option => ({
                  value: option[0],
                  label: option[1],
                })),
                {
                  label: 'No value',
                  value: 'no-value',
                },
              ]}
              styles={customSelectStyles}
              theme={selectTheme}
              components={{ DropdownIndicator, Option }}
              defaultValue={value}
              onChange={({ value }) => {
                // console.log('onchange', value);
                this.props.setConnectedDataParameters(
                  providerUrl,
                  adjustedParams(data_query, i, value),
                  true,
                );
              }}
              placeholder="Select NUTS code"
            />
          );
        })}
      </>
    ) : (
      ''
    );
  }
}

export default connect(
  (state, props) => {
    const providerUrl = props.data?.provider_url || '';
    return {
      connected_data_parameters:
        state.connected_data_parameters?.byPath?.[providerUrl],
      data_query: state.content.data?.data_query,
      querystring: state.querystring?.indexes,
    };
  },
  { getQuerystring, setConnectedDataParameters },
)(ViewSelect);
