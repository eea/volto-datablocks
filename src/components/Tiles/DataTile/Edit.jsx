/**
 * View text tile.
 * @module components/manage/Tiles/Text/View
 */

import navTreeSVG from '@plone/volto/icons/nav.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import { Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SidebarPortal } from '@plone/volto/components';
import { TextWidget } from '@plone/volto/components';
import { getSparqlData } from 'volto-datablocks/actions';
import { connect } from 'react-redux';
import { getBaseUrl } from '@plone/volto/helpers';

/**
 * View text tile class.
 * @class View
 * @extends Component
 */

class Edit extends Component {
  constructor(props) {
    super(props);
    console.log('constructor props', props);

    // this.state = {
    //   sparql_object_url: props.data.sparql_object_url || '',
    // };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.data.sparql_object_url !== this.props.data.sparql_object_url
    ) {
      const path = this.props.data.sparql_object_url;
      const url = `${getBaseUrl(path)}`;
      console.log('new sparql', url);
      if (path) this.props.getSparqlData(url);
    }
  }

  render() {
    // const data = { sparql_object_url: '' };
    // const sparql_object_url = this.state.sparql_object_url;
    const data = {
      ...this.props.data,
      sparql_object_url: this.props.data.sparql_object_url || '',
    };

    return (
      <div>
        <strong>Use the sidebar blocks to edit this.</strong>

        <SidebarPortal selected={this.props.selected}>
          <Segment.Group raised>
            <header className="header pulled">
              <h2>Data Block</h2>
            </header>
            <Segment>
              <TextWidget
                id="sparqlquery"
                title="Query"
                required={false}
                value={data.sparql_object_url.split('/').slice(-1)[0]}
                icon={data.sparql_object_url ? clearSVG : navTreeSVG}
                iconAction={
                  data.sparql_object_url
                    ? () => {
                        console.log('icon action', data);
                        this.props.onChangeBlock(this.props.block, {
                          ...data,
                          sparql_object_url: data.href,
                        });
                      }
                    : () =>
                        this.props.openObjectBrowser({
                          dataName: 'sparql_object_url',
                          mode: 'link',
                        })
                }
                onChange={(name, value) => {
                  console.log('onchange', data);
                  this.props.onChangeBlock(this.props.block, {
                    ...data,
                    sparql_object_url: value,
                  });
                }}
              />
            </Segment>
          </Segment.Group>
        </SidebarPortal>
      </div>
    );
  }
}

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Edit.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default connect(
  (state, props) => ({
    sparql_data: state.sparql_data,
  }),
  {
    getSparqlData,
  },
)(Edit);
