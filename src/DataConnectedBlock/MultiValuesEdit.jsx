import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import { SelectWidget, TextWidget } from '@plone/volto/components';
import { addAppURL } from '@plone/volto/helpers';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';

import { getDataFromProvider } from '../actions';
import { dataFormatChoices } from '../format';

const makeChoices = keys => keys.map(k => [k, k]);

class MultiValuesEdit extends Component {
  componentDidMount() {
    const url = this.props.data.provider_url;
    if (url) this.props.getDataFromProvider(url);
  }

  componentDidUpdate(prevProps, prevState) {
    const url = this.props.data.provider_url;
    const prevUrl = prevProps.data.provider_url;
    if (url && url !== prevUrl) {
      this.props.getDataFromProvider(url);
    }
  }

  render() {
    const { data, provider_data, schema } = this.props;
    let choices = makeChoices(Object.keys(provider_data || {}));

    return Object.keys(schema || {}).length > 0 ? (
      <>
        <Segment className="form sidebar-image-data">
          <TextWidget
            id="data-provider"
            title="Data provider"
            required={false}
            value={
              data.provider_url ? data.provider_url.split('/').slice(-1)[0] : ''
            }
            icon={aheadSVG}
            iconAction={() =>
              this.props.openObjectBrowser({
                mode: 'link',
                onSelectItem: url =>
                  this.props.onChange({ ...data, provider_url: url }),
                ...this.props,
              })
            }
            onChange={() => this.props.onChange({})}
          />
        </Segment>
        {Object.entries(schema).map(([k, field]) => (
          <Segment key={`${k}`} className="form sidebar-image-data">
            <SelectWidget
              id={`data-entity-column-${k}`}
              title={field.title}
              choices={choices}
              onChange={(id, value) =>
                this.props.onChange({
                  ...data,
                  columns: {
                    ...data.columns,
                    [k]: {
                      ...data.columns?.[k],
                      value,
                    },
                  },
                })
              }
              value={data.columns?.[k]?.value}
            />
            <SelectWidget
              id="data-entity-format"
              title="Format"
              choices={dataFormatChoices.map(option => [
                option.id,
                option.label,
              ])}
              onChange={(id, value) =>
                this.props.onChange({
                  ...data,
                  columns: {
                    ...data.columns,
                    [k]: {
                      ...data.columns?.[k],
                      format: value,
                    },
                  },
                })
              }
              value={data.columns?.[k]?.format || field.defaultformat}
            />
          </Segment>
        ))}
      </>
    ) : (
      ''
    );
  }
}

function getProviderData(state, props) {
  let path = props?.data?.provider_url || null;

  if (!path) return;

  path = `${path}/@connector-data`;
  const url = `${addAppURL(path)}/@connector-data`;

  const data = state.data_providers.data || {};
  return path ? data[path] || data[url] : [];
}

const ConnectedMultiValuesEdit = connect(
  (state, props) => ({
    provider_data: getProviderData(state, props),
  }),
  {
    getDataFromProvider,
  },
)(MultiValuesEdit);

export default withObjectBrowser(ConnectedMultiValuesEdit);
