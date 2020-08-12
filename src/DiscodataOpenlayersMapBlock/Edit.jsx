import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import RenderFields from 'volto-addons/Widgets/RenderFields';
import View from './View';
import { settings } from '~/config';

const getSchema = props => {
  return {
    draggable: {
      type: 'boolean',
      title: 'Drraggable',
    },
    query_parameters: {
      title: 'Query parameters',
      type: 'schema',
      fieldSetTitle: 'Query parameters metadata',
      fieldSetId: 'query_parameters_metadata',
      fieldSetSchema: {
        fieldsets: [
          {
            id: 'default',
            title: 'title',
            fields: ['title', 'id'],
          },
        ],
        properties: {
          title: {
            title: 'Title',
            type: 'text',
          },
          id: {
            title: 'Id',
            type: 'text',
          },
        },
        required: ['id', 'title'],
      },
      editFieldset: false,
      deleteFieldset: false,
    },
  };
};

const Edit = props => {
  const [state, setState] = useState({
    schema: getSchema({ ...props, providerUrl: settings.providerUrl }),
    id: _uniqueId('block_'),
  });
  useEffect(() => {
    setState({
      ...state,
      schema: getSchema({
        ...props,
      }),
    });
    /* eslint-disable-next-line */
  }, [props.data.isExpandable])
  return (
    <div>
      <RenderFields
        schema={state.schema}
        {...props}
        title="Discodata openlayers map"
      />
      <View {...props} id={state.id} />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
  })),
)(Edit);
