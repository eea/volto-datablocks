import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Segment, Select } from 'semantic-ui-react';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import { addAppURL } from '@plone/volto/helpers';
import {
  SidebarPortal,
  TextWidget,
  SelectWidget,
} from '@plone/volto/components';
import { getDataFromProvider } from 'volto-datablocks/actions';

const prettyChoices = [
  { text: 'As it is', value: {} },
  {
    text: 'No decimal percent',
    value: { precision: 1, percentage: true, justification: 'L' },
  },
  {
    text: 'Single decimal percent',
    value: { precision: 1, percentage: true, justification: 'L' },
  },
  {
    text: 'No decimal',
    value: { precision: 1, percentage: false, justification: 'L' },
  },
  {
    text: 'Single decimal',
    value: { precision: 1, percentage: false, justification: 'L' },
  },
];

// const prettyChoices = [
//     ['As it is', {} ],
//     ['No decimals', { precision: 0, percent: true } ],
//     ['Single decimal percent', { precision: 1, percent: true }  ],
//     ['Single decimal', { precision: 1, percent: false } ],
//   ];

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

  render() {
    const { data, title } = this.props;
    let choices = makeChoices(Object.keys(this.props.provider_data || {}));
    return (
      <SidebarPortal selected={true}>
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
                  onSelectItem: url => {
                    this.props.updateData({
                      url,
                    });
                  },
                  ...this.props,
                })
              }
              onChange={() => this.props.updateData({})}
            />
          </Segment>
          {Object.keys(data.columns).map((column, index) => (
            <Segment
              key={`${column}_${index}`}
              className="form sidebar-image-data"
            >
              <SelectWidget
                id="data-entity-column"
                title="Column"
                choices={choices}
                onChange={(id, value) =>
                  this.props.updateData({
                    ...data,
                    columns: {
                      ...data.columns,
                      [column]: {
                        ...data.columns[column],
                        value,
                      },
                    },
                  })
                }
                value={data.columns[column]?.value}
              />
              <Select
                id="data-entity-format"
                Placeholder="Formatting"
                options={prettyChoices}
                onChange={(event, selectData) =>
                  this.props.updateData({
                    ...data,
                    columns: {
                      ...data.columns,
                      [column]: {
                        ...data.columns[column],
                        format: selectData.value,
                      },
                    },
                  })
                }
                value={data.columns[column]?.format}
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
  },
)(EditForm);

export default withObjectBrowser(ConnectedEditForm);
