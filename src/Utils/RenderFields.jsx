import React from 'react';
import { connect } from 'react-redux';
import { Portal } from 'react-portal';
import { Segment, Button } from 'semantic-ui-react';
import {
  Field,
  SidebarPortal,
  SchemaWidget,
  TextWidget,
} from '@plone/volto/components';
import { addAppURL } from '@plone/volto/helpers';

import AddLinkForm from './AddLinkForm';
import { getDataFromProvider } from '../actions';

const makeChoices = (keys) => keys.map((k) => [k, k]);

const RenderFields = (props) => {
  const { schema, title, withFormManager, noValueKey } = props;
  const onChangeBlock = (data) => {
    props.onChangeBlock(props.block, data);
  };
  const data = withFormManager ? { ...props.formData } : { ...props.data };
  const onChangeAction = withFormManager ? props.setFormData : onChangeBlock;

  const getValue = (value, schema, noValueKey, onChangeAction, data, key) => {
    const finalValue = noValueKey ? value : value?.value;
    if (schema.type === 'array') {
      if (schema.items?.choices) {
        if (
          !finalValue &&
          schema.defaultValue &&
          typeof schema.defaultValue === 'string'
        ) {
          return [schema.defaultValue];
        }
        if (
          !finalValue &&
          schema.defaultValue &&
          Array.isArray(schema.defaultValue)
        ) {
          return schema.defaultValue;
        }
        if (finalValue && typeof finalValue === 'string') {
          return [finalValue];
        }
        if (finalValue && Array.isArray(finalValue)) {
          return finalValue;
        }
        return [];
      } else if (schema.choices) {
        if (
          !finalValue &&
          schema.defaultValue &&
          typeof schema.defaultValue === 'string' &&
          schema.choices.filter((item) => {
            return item[0] === schema.defaultValue;
          }).length > 0
        ) {
          return schema.defaultValue;
        }
        if (
          typeof finalValue === 'string' &&
          schema.choices.filter((item) => {
            return item[0] === finalValue;
          }).length === 0
        ) {
          return '';
        } else if (Array.isArray(finalValue) || !finalValue) {
          return '';
        }
      }
    }
    if (
      schema.type === 'boolean' &&
      finalValue !== true &&
      finalValue !== false
    )
      return false;
    if (schema.type === 'text' && !finalValue && !schema.defaultValue)
      return '';
    if (schema.defaultValue && !finalValue) return schema.defaultValue;
    if (!finalValue && schema.type !== 'boolean') return '';
    return finalValue;
  };
  const fieldsView = (
    <Segment.Group>
      <header className="header pulled">
        <h2>{title}</h2>
      </header>
      {schema &&
        Object.keys(schema).map((key) => (
          <React.Fragment key={key}>
            {![
              'schema',
              'sql',
              'chart-sources',
              'link',
              'import-export',
            ].includes(schema[key].type) ? (
              <Segment className="form sidebar-image-data">
                <Field
                  id={`field-widget-${key}`}
                  {...schema[key]}
                  onChange={(id, value) => {
                    onChangeAction({
                      ...data,
                      [key]: noValueKey
                        ? value
                        : {
                            ...data?.[key],
                            value,
                          },
                    });
                  }}
                  value={getValue(
                    data?.[key],
                    schema?.[key],
                    noValueKey,
                    onChangeAction,
                    data,
                    key,
                  )}
                />
              </Segment>
            ) : (
              ''
            )}
            {/* SCHEMA TYPE */}
            {schema[key].type === 'schema' ? (
              <Segment className="form">
                <SchemaWidget
                  {...props}
                  id={`checkbox-widget-column-${key}`}
                  title={schema[key].title}
                  schema={schema[key].fieldSetSchema}
                  required={false}
                  onChange={(id, value) => {
                    props.onChangeBlock(props.block, {
                      ...props.data,
                      [key]: {
                        ...props.data[key],
                        value,
                      },
                    });
                  }}
                  editFieldset={schema[key].editFieldset}
                  deleteFieldset={schema[key].deleteFieldset}
                  value={
                    props.data?.[key]?.value ||
                    `{"fieldsets":[{"id":"${schema[key].fieldSetId}","title":"${schema[key].title}","fields":[]}],"properties":{}}`
                  }
                />
              </Segment>
            ) : (
              ''
            )}
            {/* SQL TYPE */}
            {schema[key].type === 'sql' ? (
              <Segment className="form sidebar-image-data">
                <div>
                  <p
                    style={{
                      padding: '1rem 1rem 0 1rem',
                      margin: '0',
                      fontSize: '16px',
                    }}
                  >
                    {schema[key].title}
                  </p>
                  <p
                    style={{
                      padding: '0.5rem 1rem',
                      margin: '0',
                      fontSize: '12px',
                    }}
                    className="info"
                  >
                    SELECT * FROM "{props.data?.[key]?.selectQuery?.table}"
                    WHERE "{props.data?.[key]?.selectQuery?.columnKey}" = "
                    {props.data?.[key]?.selectQuery?.columnValue}"
                    {props.data?.[key]?.additionalQuery && (
                      <span>
                        {' '}
                        AND "{props.data?.[key]?.additionalQuery?.columnKey}" =
                        "{props.data?.[key]?.additionalQuery?.columnValue}"
                      </span>
                    )}
                  </p>
                  {schema[key].selectQueryFields?.map((field, index) => (
                    <TextWidget
                      id={`additional-query-widget-column-${index}`}
                      key={`additional-query-widget-column-${index}`}
                      title={field.title}
                      required={false}
                      onChange={(id, value) => {
                        props.onChangeBlock(props.block, {
                          ...props.data,
                          [key]: {
                            ...props.data?.[key],
                            selectQuery: {
                              ...props.data?.[key]?.selectQuery,
                              [field.id]: value,
                            },
                          },
                        });
                      }}
                      value={props.data?.[key]?.selectQuery?.[field.id]}
                    />
                  ))}
                  {schema[key].additionalQueryFields && (
                    <p
                      style={{
                        padding: '1rem 1rem 0 1rem',
                        fontSize: '16px',
                      }}
                    >
                      Additional query
                    </p>
                  )}
                  {schema[key].additionalQueryFields?.map((field, index) => (
                    <TextWidget
                      id={`select-query-widget-column-${index}`}
                      key={`select-query-widget-column-${index}`}
                      title={field.title}
                      required={false}
                      onChange={(id, value) => {
                        props.onChangeBlock(props.block, {
                          ...props.data,
                          [key]: {
                            ...props.data?.[key],
                            additionalQuery: {
                              ...props.data?.[key]?.additionalQuery,
                              [field.id]: value,
                            },
                          },
                        });
                      }}
                      value={props.data?.[key]?.additionalQuery?.[field.id]}
                    />
                  ))}
                </div>
              </Segment>
            ) : (
              ''
            )}
            {/* CHART SOURCE TYPE */}
            {schema[key].type === 'chart-sources' ? (
              <Segment className="form sidebar-image-data">
                {props.data[key] &&
                  props.data[key].length &&
                  props.data[key].map((item, index) => (
                    <React.Fragment key={`chart-source-${index}`}>
                      <TextWidget
                        title="Source"
                        id={`chart-source_${index}`}
                        type="text"
                        value={item.chart_source}
                        required={false}
                        onChange={(e, d) => {
                          const dataClone = JSON.parse(
                            JSON.stringify(props.data[key]),
                          );
                          dataClone[index].chart_source = d;
                          props.onChangeBlock(props.block, {
                            ...props.data,
                            [key]: dataClone,
                          });
                        }}
                      />
                      <TextWidget
                        title="Source Link"
                        id={`chart-source_link_${index}`}
                        type="text"
                        value={item.chart_source_link}
                        required={false}
                        onChange={(e, d) => {
                          const dataClone = JSON.parse(
                            JSON.stringify(props.data[key]),
                          );
                          dataClone[index].chart_source_link = d;
                          props.onChangeBlock(props.block, {
                            ...props.data,
                            [key]: dataClone,
                          });
                        }}
                      />
                    </React.Fragment>
                  ))}
                <Button
                  style={{ marginLeft: '16px', marginTop: '16px' }}
                  primary
                  onClick={() => {
                    const chartSources =
                      props.data[key] && props.data[key].length
                        ? JSON.parse(JSON.stringify(props.data[key]))
                        : [];
                    chartSources.push({
                      chart_source_link: '',
                      chart_source: '',
                    });
                    props.onChangeBlock(props.block, {
                      ...props.data,
                      [key]: chartSources,
                    });
                  }}
                >
                  Add source
                </Button>
              </Segment>
            ) : (
              ''
            )}
            {/* LINK TYPE */}
            {schema[key].type === 'link' ? (
              <Segment className="form sidebar-image-data">
                <AddLinkForm
                  title={schema[key].title}
                  onAddLink={({ value }) => {
                    props.onChangeBlock(props.block, {
                      ...props.data,
                      [key]: {
                        ...props.data?.[key],
                        value,
                      },
                    });
                  }}
                  value={data?.[key]?.value}
                />
              </Segment>
            ) : (
              ''
            )}
            {/* IMPORT EXPORT TYPE */}
            {schema[key].type === 'import-export' ? (
              <Segment className="form sidebar-image-data">
                <Field
                  widget="textarea"
                  id={`field-widget-${key}`}
                  {...schema[key]}
                  onChange={(id, value) => {
                    try {
                      const newData = JSON.parse(value);
                      delete newData.id;
                      delete newData.rowId;
                      onChangeAction({
                        ...data,
                        ...newData,
                      });
                    } catch {}
                  }}
                  value={JSON.stringify(data)}
                />
              </Segment>
            ) : (
              ''
            )}
          </React.Fragment>
        ))}
    </Segment.Group>
  );
  return withFormManager ? (
    <Portal node={__CLIENT__ && document.getElementById('sidebar-metadata')}>
      {fieldsView}
    </Portal>
  ) : (
    <SidebarPortal selected={props.selected}>{fieldsView}</SidebarPortal>
  );
};

function getProviderData(state, props) {
  let providers = null;
  if (props?.data?.providers)
    providers = { ...JSON.parse(JSON.stringify(props.data.providers)) };
  if (props?.data?.provider_url && !providers)
    providers = {
      default: {
        path: props?.data?.provider_url,
      },
    };
  if (!providers) return;
  Object.keys(providers).forEach((provider) => {
    const path = `${providers[provider].path}/@connector-data`;
    const url = `${addAppURL(path)}/@connector-data`;
    const data = state.data_providers.data || {};
    providers[provider].data = path ? data[path] || data[url] : [];
    providers[provider].choices = makeChoices(
      Object.keys(providers[provider].data || {}),
    );
  });
  return providers;
}

export default connect(
  (state, props) => ({
    providers: props.withProvider ? getProviderData(state, props) : null,
  }),
  {
    getDataFromProvider,
  },
)(RenderFields);
