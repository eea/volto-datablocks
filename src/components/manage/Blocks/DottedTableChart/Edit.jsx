import React from 'react';
import { compose } from 'redux';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import DottedTableChartView from './View';
import { DottedTableChartSchema } from './schema';
import { DEFAULT_MAX_DOT_COUNT } from './constants';

class DottedTableChartEdit extends React.Component {
  getSchema = () => {
    const provider_data = this.props.provider_data || {};
    const schema = DottedTableChartSchema();

    const choices = Object.keys(provider_data)
      .sort((a, b) => a - b)
      .map((n) => [n, n]);

    ['column_data', 'row_data', 'size_data'].forEach(
      (n) => (schema.properties[n].choices = choices),
    );

    const { row_data } = this.props.data;
    const possible_rows = Array.from(new Set(provider_data?.[row_data])).sort(
      (a, b) => a - b,
    );

    schema.properties.row_colors.options = possible_rows.map((r) => ({
      id: r,
      title: r,
    }));

    if (!this.props.data.max_dot_count) {
      this.props.data.max_dot_count = DEFAULT_MAX_DOT_COUNT;
    }

    return schema;
  };

  render() {
    const { block, data, selected, onChangeBlock } = this.props;

    const schema = this.getSchema();

    return (
      <>
        <DottedTableChartView {...this.props} />

        <SidebarPortal selected={selected}>
          <InlineForm
            schema={schema}
            title={schema.title}
            onChangeField={(id, value) => {
              onChangeBlock(block, {
                ...data,
                [id]: value,
              });
            }}
            formData={data}
          />
        </SidebarPortal>
      </>
    );
  }
}

export default compose(
  connectToProviderData((props) => ({
    provider_url: props.data.url || props.data.provider_url,
  })),
)(DottedTableChartEdit);
