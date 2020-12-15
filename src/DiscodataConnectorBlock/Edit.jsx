import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _uniqueId from 'lodash/uniqueId';
import View from './View';
import {
  getConnectedDataParametersForProvider,
  getConnectedDataParametersForContext,
} from '../helpers';
import RenderFields from '../Utils/RenderFields';
import { dataFormatChoices } from '../format';

const makeChoices = (keys) => keys && keys.map((k) => [k, k]);

const dataParameters = (props) => {
  return (
    getConnectedDataParametersForProvider(
      props.connected_data_parameters,
      '',
    ) ||
    getConnectedDataParametersForContext(
      props.connected_data_parameters,
      props.content['@id'],
    )
  );
};

const getSchema = (props) => {
  const data_providers = props.data.data_providers?.value
    ? JSON.parse(props.data.data_providers?.value).properties
    : {};
  return {
    block_title: {
      title: 'Title',
      type: 'text',
    },
    download_button: {
      title: 'Download button',
      type: 'boolean',
    },
    data_providers: {
      title: 'Data providers',
      type: 'schema',
      fieldSetTitle: 'Data provider metadata',
      fieldSetId: 'data_provider_metadata',
      fieldSetSchema: {
        fieldsets: [
          {
            id: 'default',
            title: 'title',
            fields: [
              'title',
              'id',
              'hasDiscodataConnector',
              'path',
              'displayColumn',
              'displayFormat',
              'measurmentUnit',
              'additionalText',
              'hasParent',
              'className',
              'parent',
              'wrapperClassName',
              'hasQueryParameters',
              'queryParameterColumn',
              'queryParameterValue',
            ],
          },
        ],
        properties: {
          title: {
            type: 'text',
            title: 'Title',
          },
          id: {
            type: 'text',
            title: 'Id',
          },
          hasDiscodataConnector: {
            type: 'boolean',
            title: 'Has discodata connector',
            defaultValue: true,
          },
          path: {
            type: 'dataProvider',
            title: 'Discodata connector',
            disabled: (formData) => !formData.hasDiscodataConnector,
          },
          displayColumn: {
            type: 'select',
            title: 'Display column',
            disabled: (formData) => !formData.hasDiscodataConnector,
            choices: (formData) =>
              makeChoices(
                Object.keys(
                  props.data_providers?.data?.[
                    `${formData.path}/@connector-data`
                  ] || {},
                ),
              ),
          },
          displayFormat: {
            type: 'select',
            title: 'Display format',
            disabled: (formData) => !formData.hasDiscodataConnector,
            choices: dataFormatChoices.map((option) => [
              option.id,
              option.label,
            ]),
          },
          measurmentUnit: {
            type: 'text',
            title: 'Measurment unit',
          },
          additionalText: {
            type: 'text',
            title: 'Additional text',
          },
          hasParent: {
            type: 'boolean',
            title: 'Has parent',
            defaultValue: false,
          },
          className: {
            type: 'select',
            title: 'Class name',
            choices: [
              ['data', 'Data'],
              ['data-content', 'Data content'],
            ],
          },
          parent: {
            type: 'select',
            title: 'Parent',
            disabled: (formData) => !formData.hasParent,
            choices: (formData) => {
              const data_providers_filtered = { ...data_providers };
              data_providers_filtered[formData.id] &&
                delete data_providers_filtered[formData.id];
              return makeChoices(Object.keys(data_providers_filtered));
            },
          },
          wrapperClassName: {
            type: 'select',
            title: 'Wrapper class name',
            disabled: (formData) => !!formData?.hasParent,
            choices: [
              ['data-wrapper brown', 'Brown wrapper'],
              ['data-wrapper green', 'Green wrapper'],
              ['data-wrapper blue', 'Blue wrapper'],
              ['data-wrapper purple', 'Purple wrapper'],
            ],
          },
          hasQueryParameters: {
            type: 'boolean',
            title: 'Has query parameters',
            defaultValue: true,
          },
          queryParameterColumn: {
            type: 'select',
            title: 'Query parameter column',
            disabled: (formData) => formData?.hasQueryParameters !== true,
            defaultValue: dataParameters(props)?.[0]?.i,
            choices: (formData) => {
              return formData.path
                ? [
                    [
                      dataParameters(props)?.[0]?.i,
                      `${dataParameters(props)?.[0]?.i} (default value)`,
                    ],
                    ...makeChoices(
                      Object.keys(
                        props.data_providers?.data?.[
                          `${formData.path}/@connector-data`
                        ] || {},
                      ),
                    ),
                  ]
                : [
                    [
                      dataParameters(props)?.[0]?.i,
                      `${dataParameters(props)?.[0]?.i} (default value)`,
                    ],
                  ];
            },
          },
          queryParameterValue: {
            type: 'array',
            title: 'Query parameter value',
            disabled: (formData) => formData?.hasQueryParameters !== true,
            defaultValue: dataParameters(props)?.[0]?.v,
          },
        },
        required: ['title', 'id'],
      },
      editFieldset: false,
      deleteFieldset: false,
    },
    bullet_list: {
      title: 'Additional text',
      type: 'schema',
      fieldSetTitle: 'Additional text metadata',
      fieldSetId: 'additional_text_metadata',
      fieldSetSchema: {
        fieldsets: [
          {
            id: 'default',
            title: 'title',
            fields: ['title', 'id', 'leftText', 'rightText'],
          },
        ],
        properties: {
          title: {
            type: 'text',
            title: 'Title',
          },
          id: {
            type: 'text',
            title: 'Id',
          },
          leftText: {
            type: 'text',
            title: 'Text (left)',
          },
          rightText: {
            type: 'text',
            title: 'Text (right)',
          },
        },
        required: ['title', 'id'],
      },
      editFieldset: false,
      deleteFieldset: false,
    },
    chart_sources: {
      title: 'Sources',
      type: 'chart-sources',
    },
  };
};

const Edit = (props) => {
  const [state, setState] = useState({
    id: _uniqueId('block_'),
    schema: getSchema(props),
  });
  useEffect(() => {
    setState({
      ...state,
      schema: getSchema(props),
    });
    /* eslint-disable-next-line */
  }, [props.data_providers, props.data.data_providers]);
  console.log('state schema', state.schema);
  return (
    <div>
      <RenderFields
        schema={state.schema}
        {...props}
        title="Discodata connector block"
      />
      <View {...props} id={state.id} />
    </div>
  );
};

export default connect((state, props) => ({
  content: state.content.data,
  connected_data_parameters: state.connected_data_parameters,
  data_providers: state.data_providers,
}))(Edit);
