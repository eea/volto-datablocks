import { find } from 'lodash';
import React, { Component } from 'react';
import { addAppURL } from '@plone/volto/helpers';
import { connect } from 'react-redux';
import { DATA_PROVIDER_TYPES } from 'volto-datablocks/constants';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { searchContent } from '@plone/volto/actions';
import { Button, Grid } from 'semantic-ui-react';
import Select from 'react-select';
import { Link } from 'react-router-dom';
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

function getDefaultValues(choices, value) {
  if (value && choices.length > 0) {
    const found = find(choices, o => o.value === value);
    return found;
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
        b_size: 10000,
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
      this.props.onLoadProviderData &&
      JSON.stringify(this.props.providerData) !==
        JSON.stringify(this.props.currentProviderData)
    ) {
      this.props.onLoadProviderData(this.props.providerData);
    }
  }

  refresh = () => {
    this.props.value && this.props.getDataFromProvider(this.props.value);
  };

  render() {
    const selectProviders = this.props.providers.map(el => {
      return [el['@id'], el.title];
    });

    const choices = [
      ...selectProviders.map(option => ({
        value: option[0],
        label: option[1],
        selected: option[0] === this.props.value,
      })),
      {
        label: 'No value',
        value: 'no-value',
      },
    ];

    return (
      <div class="inline field">
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width={4}>
              <div className="wrapper">
                {this.props.value ? (
                  <Link to={this.props.value}>Provider:</Link>
                ) : (
                  <label htmlFor={`field-${this.props.id}`}>Provider:</label>
                )}
              </div>
            </Grid.Column>
            <Grid.Column width={8}>
              <div>
                <Select
                  id={`field-${this.props.id}`}
                  name={this.props.id}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={choices}
                  styles={customSelectStyles}
                  theme={selectTheme}
                  components={{ DropdownIndicator, Option }}
                  value={getDefaultValues(choices, this.props.value)}
                  onChange={data =>
                    this.props.onChange(
                      data.value === 'no-value' ? undefined : data.value,
                    )
                  }
                />
                {this.props.showReload ? (
                  <Button onClick={this.refresh} disabled={!this.props.value}>
                    Reload data
                  </Button>
                ) : (
                  ''
                )}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
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
