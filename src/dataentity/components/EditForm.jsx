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
import { getDataFromProvider } from 'volto-datablocks/actions';
import { changeSidebarState } from 'volto-datablocks/actions';

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
    const { data, entityKey, title } = this.props;
    let choices = makeChoices(Object.keys(this.props.provider_data || {}));
    this.props.changeSidebarState(true);

    return (
      <SidebarPortal selected={true}>
        <Segment.Group raised>
          <header className="header pulled">
            <h2>
              {title}${entityKey}
            </h2>
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
                    this.props.onChangeEntityData(entityKey, {
                      url,
                      column: null,
                    });
                  },
                  ...this.props,
                })
              }
              onChange={() => this.props.onChangeEntityData(entityKey, {})}
            />
          </Segment>

          <Segment className="form sidebar-image-data">
            <SelectWidget
              id="data-entity-column"
              title="Column"
              choices={choices}
              onChange={(id, value) =>
                this.props.onChangeEntityData(entityKey, {
                  ...data,
                  column: value,
                })
              }
              value={data.column}
            />
          </Segment>
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
