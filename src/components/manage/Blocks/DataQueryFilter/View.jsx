import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import loadable from '@loadable/component';
import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
import {
  setConnectedDataParameters,
  deleteConnectedDataParameters,
} from '@eeacms/volto-datablocks/actions';

const Select = loadable(() => import('react-select'));

const View = (props) => {
  const { data = {}, id } = props;
  const { select_field, options, placeholder } = data;
  const provider_url = props.data?.provider_url || '';

  useEffect(() => {
    return () => {
      props.deleteConnectedDataParameters(
        provider_url,
        `${data['@type']}_${select_field}`,
      );
    };
    /* eslint-disable-next-line */
  }, []);

  if (!provider_url && props.mode === 'edit')
    return <div>Select a provider from the sidebar</div>;

  const value =
    props.connected_data_parameters.byProviderPath[provider_url]?.[
      `${data['@type']}_${select_field}`
    ]?.v?.[0] || null;

  return select_field ? (
    <Select
      id={`field-${id}`}
      key={`select-i`}
      name={id}
      disabled={false}
      className="react-select-container"
      classNamePrefix="react-select"
      options={[
        ...(options || []),
        {
          label: 'No value',
          value: null,
        },
      ]}
      styles={customSelectStyles}
      theme={selectTheme}
      components={{ DropdownIndicator, Option }}
      defaultValue={value}
      onChange={({ value }) => {
        if (value) {
          props.setConnectedDataParameters(
            provider_url,
            {
              i: select_field,
              o: 'plone.app.querystring.operation.selection.any',
              v: [value],
            },
            `${data['@type']}_${select_field}`,
          );
        } else {
          props.deleteConnectedDataParameters(
            provider_url,
            `${data['@type']}_${select_field}`,
          );
        }
      }}
      placeholder={placeholder}
    />
  ) : (
    'Not configured yet'
  );
};

export default connect(
  (state) => {
    return {
      connected_data_parameters: state.connected_data_parameters,
    };
  },
  { setConnectedDataParameters, deleteConnectedDataParameters },
)(View);
