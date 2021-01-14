import React, { Component } from 'react';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import CountryFlagSchema from './schema';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import CountryFlagView from './View';
import countryNames from './data/countries.json';

class Edit extends Component {
  getSchema = () => {
    const schema = CountryFlagSchema();
    schema.properties.country_name.choices = Object.keys(
      countryNames,
    ).map((k) => [k, countryNames[k]]);
    return schema;
  };

  render() {
    const schema = this.getSchema();
    return (
      <div className="block">
        <CountryFlagView data={this.props.data} />

        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={this.getSchema(schema)}
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
      </div>
    );
  }
}

export default connectBlockToProviderData(Edit);
