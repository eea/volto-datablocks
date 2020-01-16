import { defineMessages } from 'react-intl'; // , injectIntl
import { find, isBoolean, isObject } from 'lodash'; // map,
import React, { Component } from 'react';
import { addAppURL } from '@plone/volto/helpers';
import { connect } from 'react-redux';
import { DATA_PROVIDER_TYPES } from 'volto-datablocks/constants';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { searchContent } from '@plone/volto/actions';
import { Button, Segment, Grid } from 'semantic-ui-react';
import Select from 'react-select';
import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
import {
  getBoolean,
  getVocabFromHint,
  getVocabFromField,
  getVocabFromItems,
} from '@plone/volto/helpers';

// import { SelectWidget } from '@plone/volto/components';

const messages = defineMessages({
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  idTitle: {
    id: 'Short Name',
    defaultMessage: 'Short Name',
  },
  idDescription: {
    id: 'Used for programmatic access to the fieldset.',
    defaultMessage: 'Used for programmatic access to the fieldset.',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  description: {
    id: 'Description',
    defaultMessage: 'Description',
  },
  close: {
    id: 'Close',
    defaultMessage: 'Close',
  },
  choices: {
    id: 'Choices',
    defaultMessage: 'Choices',
  },
  required: {
    id: 'Required',
    defaultMessage: 'Required',
  },
  no_value: {
    id: 'No value',
    defaultMessage: 'No value',
  },
});

function getDefaultValues(choices, value) {
  if (!isObject(value) && isBoolean(value)) {
    // We have a boolean value, which means we need to provide a "No value"
    // option
    const label = find(choices, o => getBoolean(o[0]) === value);
    return label
      ? {
          label: label[1],
          value,
        }
      : {};
  }
  if (value === 'no-value') {
    return {
      label: this.props.intl.formatMessage(messages.no_value),
      value: 'no-value',
    };
  }
  if (isObject(value)) {
    return { label: value.title, value: value.token };
  }
  if (value && choices.length > 0) {
    return { label: find(choices, o => o[0] === value)[1], value };
  } else {
    return {};
  }
}

class PickProvider extends Component {
  componentDidMount() {
    // TODO: this needs to use a subrequest
    this.props.searchContent(
      '',
      {
        object_provides: DATA_PROVIDER_TYPES,
      },
      'getProviders',
    );
    if (this.props.value) {
      this.props.getDataFromProvider(this.props.value);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value && this.props.value !== prevProps.value) {
      this.props.getDataFromProvider(this.props.value);
    }

    // Optimization to help land the proper providerData to the chart
    if (
      JSON.stringify(this.props.providerData) !==
      JSON.stringify(this.props.currentProviderData)
    ) {
      this.props.onLoadProviderData(this.props.providerData);
    }
  }

  render() {
    const selectProviders = this.props.providers.map(el => {
      return [el['@id'], el.title];
    });

    const choices = selectProviders;
    const value = this.props.value;

    return (
      <Grid>
        <Grid.Column width={2}>
          <label htmlFor={`field-${this.props.id}`}>Provider:</label>
        </Grid.Column>
        <Grid.Column width={8}>
          <Select
            id={`field-${this.props.id}`}
            name={this.props.id}
            className="react-select-container"
            classNamePrefix="react-select"
            options={[
              ...selectProviders.map(option => ({
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
            defaultValue={getDefaultValues(choices, value)}
            onChange={data =>
              this.props.onChange(
                data.value === 'no-value' ? undefined : data.value,
              )
            }
          />
        </Grid.Column>
        <Grid.Column width={2}>
          <Button onClick={this.refresh} disabled={!this.props.value}>
            Reload data
          </Button>
        </Grid.Column>
      </Grid>
    );
  }
}

function getProviderData(state, props) {
  let path = props?.value || null;

  if (!path) return;

  path = `${path}/@connector-data`;
  const url = `${addAppURL(path)}/@connector-data`;

  const data = state.data_providers.data || {};
  const res = path ? data[path] || data[url] : [];
  return res;
}

export default connect(
  (state, props) => {
    const providerData = getProviderData(state, props);

    return {
      providers: state.search.subrequests?.getProviders?.items || [],
      providerData,
    };
  },
  { searchContent, getDataFromProvider },
)(PickProvider);
