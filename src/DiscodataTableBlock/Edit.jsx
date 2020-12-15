import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import View from './View';
import DiscodataSqlBuilderEdit from '@eeacms/volto-datablocks/DiscodataSqlBuilder/Edit';

const schema = {
  itemsCountKey: {
    title: 'Items count key',
    type: 'text',
  },
  hiddenRowTypes: {
    title: 'Hidden row columns types',
    type: 'array',
  },
  metadata: {
    title: 'Metadata',
    type: 'schema',
    fieldSetTitle: 'Table metadata',
    fieldSetId: 'table-metadata',
    fieldSetSchema: {
      fieldsets: [
        {
          id: 'default',
          title: 'title',
          fields: [
            'tableType',
            'title',
            'id',
            'dataType',
            'show',
            'urlFieldId',
            'queriesToSet',
            'discodataQueriesKeys',
            'hiddenRowType',
            'className',
          ],
        },
      ],
      properties: {
        tableType: {
          type: 'string',
          title: 'Table type',
          description: 'Used for data table fieldset',
          choices: [
            ['Table header', 'Table header'],
            ['Hidden row', 'Hidden row'],
            ['Invisible', 'Invisible'],
          ],
        },
        id: {
          type: 'string',
          title: 'Field id',
          description: 'Description',
        },
        title: {
          type: 'string',
          title: 'Title',
        },
        dataType: {
          type: 'string',
          title: 'Data type',
          choices: [
            ['string', 'String'],
            ['textarea', 'Text area'],
            ['array', 'Array'],
            ['object', 'Object'],
            ['button', 'Button'],
          ],
        },
        show: {
          type: 'string',
          title: 'Display option',
          choices: (formData) => {
            if (['string', 'textarea'].includes(formData.dataType))
              return [
                ['value', 'Value'],
                ['link_value', 'Link value'],
              ];
            if (['button'].includes(formData.dataType))
              return [['link_value', 'Link value']];
            if (['array', 'object'].includes(formData.dataType))
              return [
                ['length', 'Length'],
                ['keys', 'Keys'],
                ['link_length', 'Link length'],
                ['link_keys', 'Link keys'],
              ];
            return [];
          },
        },
        urlFieldId: {
          disabled: (formData) =>
            !['link_value', 'link_length', 'link_keys'].includes(
              formData?.show,
            ),
          type: 'string',
          title: 'Url field id or url',
          description: 'Add only if "Display option" is set to "Link*"',
        },
        queriesToSet: {
          disabled: (formData) =>
            !['link_value', 'link_length', 'link_keys'].includes(
              formData?.show,
            ),
          type: 'array',
          title: 'Queries to set',
          items: {
            choices: [],
          },
        },
        discodataQueriesKeys: {
          disabled: (formData) =>
            !['link_value', 'link_length', 'link_keys'].includes(
              formData?.show,
            ),
          type: 'array',
          title: 'Discodata queries keys',
          items: {
            choices: [],
          },
        },
        hiddenRowType: {
          disabled: (formData) => formData?.tableType !== 'Hidden row',
          type: 'string',
          title: 'Hidden row type',
          description: "Add only if 'Table type' is set to 'Hidden row'",
          choices: [],
        },
        className: {
          disabled: (formData) => formData?.dataType !== 'button',
          type: 'string',
          title: 'Add a classname',
          description: "Add only if 'button' data type is selected",
        },
      },
      required: ['tableType', 'id', 'title', 'dataType', 'show'],
    },
    editFieldset: false,
    deleteFieldset: false,
  },
};

const Edit = React.forwardRef((props) => {
  useEffect(() => {
    if (schema.metadata?.fieldSetSchema?.properties?.hiddenRowType) {
      schema.metadata.fieldSetSchema.properties.hiddenRowType.choices = props
        .data?.hiddenRowTypes?.value
        ? props.data.hiddenRowTypes.value.map((type) => [type, type])
        : [];
    }
    /* eslint-disable-next-line */
  }, [props.data?.hiddenRowTypes?.value]);

  if (__SERVER__) {
    return <div />;
  }

  return (
    <DiscodataSqlBuilderEdit
      {...props}
      optionalSchema={schema}
      title="Discodata components block"
    >
      <View {...props} />
    </DiscodataSqlBuilderEdit>
  );
});

export default compose(
  injectIntl,
  connect((state) => ({
    content: state.content.data,
  })),
)(Edit);
