import { addAppURL } from '@plone/volto/helpers';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDataFromProvider } from '../actions';

import 'draft-js-focus-plugin/lib/plugin.css';
import './styles.css';

const propTypes = {
  blockProps: PropTypes.object.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  // theme: PropTypes.object.isRequired,
};

class DataEntity extends Component {
  componentDidMount() {
    const url = this.props.blockProps.url;
    if (url) this.props.getDataFromProvider(url);
  }
  componentDidUpdate(prevProps, prevState) {
    const url = this.props.blockProps.url;
    const prevUrl = prevProps.blockProps.url;
    if (url && url !== prevUrl) {
      this.props.getDataFromProvider(url);
    }
  }
  render() {
    const { blockProps } = this.props;
    console.log('rendering dataentity', this.props);

    return (
      <span className="inline-data-entity">
        <div class="inline-data-entity-text">{blockProps.url}</div>
      </span>
    );
  }
}

DataEntity.propTypes = propTypes;
DataEntity.defaultProps = {
  className: null,
  entityKey: null,
  target: null,
};

function getProviderData(state, props) {
  let path = props?.blockProps?.url || null;

  if (!path) return;

  path = `${path}/@connector-data`;
  const url = `${addAppURL(path)}/@connector-data`;

  const data = state.data_providers.data || {};
  return path ? data[path] || data[url] : [];
}

export default connect(
  (state, props) => ({
    provider_data: getProviderData(state, props),
  }),
  {
    getDataFromProvider,
  },
)(DataEntity);
