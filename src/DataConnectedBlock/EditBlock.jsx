/*
 * A generic form to pick ConnectedDataValues metadata
 *
 * Pass schema for columns schema. See forests-frontend ForestCoverageBlock
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Segment } from 'semantic-ui-react';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import { addAppURL } from '@plone/volto/helpers';
import {
  SidebarPortal,
  TextWidget,
  SelectWidget,
} from '@plone/volto/components';
import { changeSidebarState } from 'volto-sidebar/actions';
import { getDataFromProvider } from '../actions';
import { dataFormatChoices } from '../format';

const makeChoices = keys => keys.map(k => [k, k]);

class EditForm extends Component {
  componentDidMount() {
    const url = this.props.data.url;
    if (url) this.props.getDataFromProvider(url);
  }

  componentDidUpdate(prevProps, prevState) {
    const url = this.props.data.url;
    const prevUrl = prevProps.data.url;
    if (url && url !== prevUrl) {
      this.props.getDataFromProvider(url);
    }
  }

  onChangeBlock() {
    // needed by ObjectBrowser
  }

  render() {
    const { data, title, provider_data, onChange, schema } = this.props;
    if (this.props.selected) this.props.changeSidebarState(true);
    /*
     * data is like:
     * { columns: { first: {title: 'Percentage', value: 'PERC_01', format: 'raw'}, }}
     */
    let choices = makeChoices(Object.keys(provider_data || {}));

    return (
      <SidebarPortal selected={this.props.selected}>
        <Segment.Group raised>
          <header className="header pulled">
            <h2>{title}</h2>
          </header>

          {!(data && data.url) && (
            <>
              <Segment className="sidebar-metadata-container" secondary>
                <FormattedMessage
                  id="No data provider"
                  defaultMessage="No data provider specified"
                />
                <img src={aheadSVG} alt="" />
              </Segment>
            </>
          )}

          <Segment className="form sidebar-image-data">
            <TextWidget
              id="data-provider"
              title="Data provider"
              required={false}
              value={data.url ? data.url.split('/').slice(-1)[0] : ''}
              icon={aheadSVG}
              iconAction={() =>
                this.props.openObjectBrowser({
                  mode: 'link',
                  onSelectItem: url => onChange({ url }),
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
        </Segment.Group>
      </SidebarPortal>
    );
  }
}

function getProviderData(state, props) {
  let path = props?.data?.url || null;

  if (!path) return;

  path = `${path}/@connector-data`;
  const url = `${addAppURL(path)}/@connector-data`;

  const data = state.data_providers.data || {};
  return path ? data[path] || data[url] : [];
}

// TODO: use the redux store to cache the provider data, as it doesn't change
// often

const ConnectedEditForm = connect(
  (state, props) => ({
    provider_data: getProviderData(state, props),
  }),
  {
    getDataFromProvider,
    changeSidebarState,
  },
)(EditForm);

export default withObjectBrowser(ConnectedEditForm);
