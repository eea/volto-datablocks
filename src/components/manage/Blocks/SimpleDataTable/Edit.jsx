import React, { Component } from 'react';
import { compose } from 'redux';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import config from '@plone/volto/registry';

import {
  connectToProviderData,
  connectToPopupProviderData,
} from '@eeacms/volto-datablocks/hocs';

import { SimpleDataTableSchema } from './schema';
import { SimpleDataTableView } from './View';

const selectSchemaChoices = (choices, popUpChoices, param, data) => {
  const selectedProvider =
    data && param && data[param] && data[param].provider
      ? data[param].provider
      : '';
  const isPopupProvider =
    selectedProvider &&
    data &&
    data.popup_provider_url &&
    data.popup_provider_url === selectedProvider;

  const selectedChoices = isPopupProvider ? popUpChoices : choices;

  return selectedChoices;
};

class Edit extends Component {
  getSchema = () => {
    const template = this.props.data.template || 'default';
    const templateSchema =
      config.blocks.blocksConfig.simpleDataConnectedTable?.templates?.[template]
        ?.schema || {};

    const schema = SimpleDataTableSchema(config, templateSchema(config));

    // TODO: create picker for columns to include
    const { provider_data } = this.props;

    if (!provider_data) return schema;

    const choices = Array.from(Object.keys(provider_data).sort()).map((n) => [
      n,
      n,
    ]);

    schema.properties.columns.schema.properties.column.choices = choices;
    schema.properties.columns.schema.properties.column_link.choices = choices;

    if (this.props.data.template === 'expandable') {
      const tableProvider = this.props.data.provider_url
        ? this.props.data.provider_url
        : '';
      const popupProvider = this.props.data.popup_provider_url
        ? this.props.data.popup_provider_url
        : '';

      const popUpChoices = this.props.popup_provider_data
        ? Array.from(
            Object.keys(this.props.popup_provider_data).sort(),
          ).map((n) => [n, n])
        : [];

      const initialProviderChoices = [tableProvider, popupProvider];
      const providerChoices = initialProviderChoices
        .filter((item) => {
          return item !== '';
        })
        .map((n) => [n, n]);

      schema.properties.popup_data_query.choices = choices;
      schema.properties.popupTitle.choices = choices;

      //replicate this example for each popupschema attr
      schema.properties.popupDescription.choices = selectSchemaChoices(
        choices,
        popUpChoices,
        'popupDescription',
        this.props.data,
      );
      schema.properties.popupDescription.providerChoices = providerChoices;

      schema.properties.popupUrl.choices = choices;
      schema.properties.popupMapData.choices = choices;

      //set choices for the popup table columns
      schema.properties.popupTableColumns.schema.properties.column.choices = popUpChoices;
      schema.properties.popupTableColumns.schema.properties.column_link.choices = popUpChoices;
    }

    return schema;
  };

  render() {
    const schema = this.getSchema();

    return (
      <>
        <SimpleDataTableView {...this.props} />

        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={this.getSchema()}
            title={schema.title}
            onChangeField={(id, value) => {
              this.props.onChangeBlock(this.props.block, {
                ...this.props.data,
                [id]: value,
              });
            }}
            formData={this.props.data}
          />
        </SidebarPortal>
      </>
    );
  }
}

export default compose(
  connectToPopupProviderData((props) => {
    return {
      popup_provider_url: props.data?.popup_provider_url,
    };
  }),
  connectToProviderData((props) => {
    const { max_count = 5 } = props.data;
    return {
      provider_url:
        props.visualization_data?.provider_url ||
        props.data?.provider_url ||
        props.data?.url,
      pagination: {
        enabled: props.data.has_pagination,
        itemsPerPage:
          typeof max_count !== 'number' ? parseInt(max_count) : max_count,
      },
    };
  }),
)(Edit);
