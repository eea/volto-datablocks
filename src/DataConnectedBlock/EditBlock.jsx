/*
 * A generic form to pick ConnectedDataValues metadata
 *
 * Pass schema for columns schema. See forests-frontend ForestCoverageBlock
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import { SidebarPortal } from '@plone/volto/components';
import { changeSidebarState } from 'volto-datablocks/actions';
import MultiValuesEdit from './MultiValuesEdit';

class EditForm extends Component {
  onChangeBlock() {
    // needed by ObjectBrowser
  }

  render() {
    const { data, title, schema, block } = this.props;
    if (this.props.selected) this.props.changeSidebarState(true);
    /*
     * data is like:
     * { columns: { first: {title: 'Percentage', value: 'PERC_01', format: 'raw'}, }}
     */

    return (
      <SidebarPortal selected={this.props.selected}>
        <Segment.Group raised>
          <header className="header pulled">
            <h2>{title}</h2>
          </header>
          <MultiValuesEdit
            schema={schema}
            onChange={this.props.onChange}
            data={data}
            block={block}
          />
        </Segment.Group>
      </SidebarPortal>
    );
  }
}

// TODO: use the redux store to cache the provider data, as it doesn't change
// often

const ConnectedEditForm = connect(
  null,
  {
    changeSidebarState,
  },
)(EditForm);

export default withObjectBrowser(ConnectedEditForm);
