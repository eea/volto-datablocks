import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { searchContent } from '@plone/volto/actions';

class DataProvidersView extends Component {
  static propTypes = {
    getDataProviders: PropTypes.func.isRequired,
    providers: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      providers: props.providers,
    };
    // console.log('providers props', props);
  }

  componentWillReceiveProps(nextProps) {
    // console.log('nextprops', nextProps);
    let old = JSON.stringify(this.props.providers);
    let neu = JSON.stringify(nextProps.providers);

    if (old !== neu) {
      this.setState({ providers: nextProps.providers });
    }
  }

  componentWillMount() {
    this.props.searchContent('', { portal_type: 'discodataconnector' });
  }

  render() {
    // console.log('state', this.state.providers);
    return this.state.providers ? (
      <div>
        {this.state.providers.map(el => {
          return (
            <div key={el['@id']}>
              {el['@id']} {el.title}
            </div>
          );
        })}
      </div>
    ) : (
      ''
    );
  }
}

export default connect(
  state => ({
    providers: state.search.items,
  }),
  { searchContent },
)(DataProvidersView);
