import React from 'react';
import { connect } from 'react-redux';
import loadable from '@loadable/component';
import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
import { setConnectedDataParameters } from 'volto-datablocks/actions';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';

const Select = loadable(() => import('react-select'));

const ViewSelect = (props) => {
  const { data = {}, id, provider_data = {} } = props;
  const { select_field } = data;
  // const { connected_data_parameters } = props; // data_query, querystring
  // console.log('ViewSelect connected:', connected_data_parameters);
  const providerUrl = props.data?.provider_url || '';

  const choices = React.useMemo(() => {
    return Array.from(new Set(provider_data?.[select_field] || [])).map((n) => [
      n,
      n,
    ]);
  }, [provider_data, select_field]);

  if (!providerUrl && props.mode === 'edit')
    return <div>Select a provider from the sidebar</div>;

  // const value = findValueFromParams(connected_data_parameters, i);

  const value = '';

  const data_query = [
    {
      i: select_field,
      o: 'plone.app.querystring.operation.selection.any',
      v: ['....'],
    },
  ];

  return select_field ? (
    <Select
      id={`field-${id}`}
      key={`select-i`}
      name={id}
      disabled={false}
      className="react-select-container"
      classNamePrefix="react-select"
      options={[
        ...choices.map((option) => ({
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
        props.setConnectedDataParameters(
          providerUrl,
          adjustedParams(data_query, select_field, value),
          true, // this is a filter
        );
      }}
      placeholder={data.placeholder}
    />
  ) : (
    'Not configured yet'
  );
};

export default connect(
  (state, props) => {
    const providerUrl = props.data?.provider_url || '';
    return {
      connected_data_parameters:
        state.connected_data_parameters?.byPath?.[providerUrl],
      // data_query: state.content.data?.data_query,
      // querystring: state.querystring?.indexes,
    };
  },
  { setConnectedDataParameters },
)(connectBlockToProviderData(ViewSelect));

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
  return (data_query || []).map((iov) =>
    iov.i !== index
      ? iov
      : {
          ...iov,
          v: [value],
        },
  );
}

// function indexValuesToChoices(values) {
//   // values is an object such as
//   // values: { BG: { title: "BG"}}
//   return Object.keys(values).map((k) => [k, values[k].title]);
// }
// function findValueFromParams(params_data, index) {
//   return find(params_data, { i: index })?.v?.[0];
// }
// import { getQuerystring } from '@plone/volto/actions';
// import { find } from 'lodash';
