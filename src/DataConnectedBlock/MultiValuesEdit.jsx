import { connect } from 'react-redux';
import React, { useEffect, useRef } from 'react';
import { Segment } from 'semantic-ui-react';
import { SelectWidget, TextWidget } from '@plone/volto/components';
import { addAppURL } from '@plone/volto/helpers';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import { Button } from 'semantic-ui-react';
import { getDataFromProvider } from '../actions';
import { dataFormatChoices } from '../format';

const makeChoices = keys => keys.map(k => [k, k]);

const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

const MultiValuesEdit = props => {
  const { data, providers, schema, getDataFromProvider } = props;
  const prevProviders = usePrevious(providers);
  if (providers && !prevProviders) {
    Object.keys(providers).forEach(key => {
      const path = providers[key].path;
      if (path) getDataFromProvider(path);
    });
  }
  return Object.keys(schema || {}).length > 0 ? (
    <>
      {Object.entries(schema).map(([k, field]) => (
        <React.Fragment key={`${k}`}>
          {field.static && (
            <Segment className="form sidebar-image-data">
              <TextWidget
                id={`text-widget-column-${k}`}
                title={field.title}
                required={false}
                onChange={(id, value) =>
                  props.onChange({
                    ...data,
                    columns: {
                      ...data.columns,
                      [k]: {
                        ...data.columns?.[k],
                        value,
                      },
                    },
                  })
                }
                value={data.columns?.[k]?.value}
              />
            </Segment>
          )}
          {field.type === 'data-provider' && !field.static && (
            <Segment className="form sidebar-image-data">
              <TextWidget
                id={`data-provider-${k}`}
                title={field.title}
                required={false}
                value={
                  providers && providers[k]?.path
                    ? providers[k].path.split('/').slice(-1)[0]
                    : ''
                }
                icon={aheadSVG}
                iconAction={() =>
                  props.openObjectBrowser({
                    mode: 'link',
                    onSelectItem: path => {
                      const newData = { ...JSON.parse(JSON.stringify(data)) };
                      if (!newData.providers) newData.providers = {};
                      if (!newData.providers[k]) newData.providers[k] = {};
                      if (
                        !providers ||
                        !providers[k] ||
                        (providers &&
                          providers[k] &&
                          providers[k].path !== path)
                      ) {
                        getDataFromProvider(path);
                      }
                      newData.providers[k].path = path;
                      return props.onChange(newData);
                    },
                    onChangeBlock: () => {},
                    ...props,
                  })
                }
                onChange={() => props.onChange({})}
              />
            </Segment>
          )}
          {field.type === 'data-query' && !field.static && (
            <Segment className="form sidebar-image-data">
              <div>
                <TextWidget
                  id={`text-widget-column-${k}_i`}
                  title={'Key'}
                  required={false}
                  onChange={(id, value) =>
                    props.onChange({
                      ...data,
                      columns: {
                        ...data.columns,
                        [k]: {
                          ...data.columns?.[k],
                          value: {
                            ...data.columns?.[k]?.value,
                            i: value || '',
                            o: 'plone.app.querystring.operation.selection.any',
                          },
                        },
                      },
                    })
                  }
                  value={data.columns?.[k]?.value.i}
                />
                <TextWidget
                  id={`text-widget-column-${k}_v`}
                  title={'For'}
                  required={false}
                  onChange={(id, value) =>
                    props.onChange({
                      ...data,
                      columns: {
                        ...data.columns,
                        [k]: {
                          ...data.columns?.[k],
                          value: {
                            ...data.columns?.[k]?.value,
                            v: value?.split(',') || [],
                            o: 'plone.app.querystring.operation.selection.any',
                          },
                        },
                      },
                    })
                  }
                  value={data.columns?.[k]?.value?.v?.join(',')}
                />
              </div>
            </Segment>
          )}
          {field.type === 'data-provider-entity' &&
            !field.static &&
            providers?.[field.provider] && (
              <Segment className="form sidebar-image-data">
                <div>
                  <SelectWidget
                    id={`data-entity-column-${k}`}
                    title={field.title}
                    choices={providers?.[field.provider]?.choices || []}
                    onChange={(id, value) =>
                      props.onChange({
                        ...data,
                        columns: {
                          ...data.columns,
                          [k]: {
                            ...data.columns?.[k],
                            value,
                          },
                        },
                      })
                    }
                    value={data.columns?.[k]?.value}
                  />
                  <SelectWidget
                    id={`data-entity-format-${k}`}
                    title="Format"
                    choices={dataFormatChoices.map(option => [
                      option.id,
                      option.label,
                    ])}
                    onChange={(id, value) =>
                      props.onChange({
                        ...data,
                        columns: {
                          ...data.columns,
                          [k]: {
                            ...data.columns?.[k],
                            format: value,
                          },
                        },
                      })
                    }
                    value={data.columns?.[k]?.format || field.defaultformat}
                  />
                </div>
              </Segment>
            )}
        </React.Fragment>
      ))}
      <Segment className="form sidebar-image-data">
        <TextWidget
          title="Source"
          id="chart-source"
          type="text"
          value={props.data.chart_source}
          required={false}
          onChange={(e, d) =>
            props.onChange({
              ...data,
              chart_source: d,
            })
          }
        />
        <TextWidget
          title="Source Link"
          id="chart-source-link"
          type="text"
          value={data.chart_source_link}
          required={false}
          onChange={(e, d) =>
            props.onChange({
              ...data,
              chart_source_link: d,
            })
          }
        />
        {data.chartSources && data.chartSources.length
          ? data.chartSources.map((item, index) => (
              <React.Fragment>
                <TextWidget
                  title="Source"
                  id={`chart-source_${index}`}
                  type="text"
                  value={item.chart_source}
                  required={false}
                  onChange={(e, d) => {
                    const dataClone = JSON.parse(
                      JSON.stringify(data.chartSources),
                    );
                    dataClone[index].chart_source = d;
                    props.onChange({
                      ...data,
                      chartSources: dataClone,
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
                      JSON.stringify(data.chartSources),
                    );
                    dataClone[index].chart_source_link = d;
                    props.onChange({
                      ...data,
                      chartSources: dataClone,
                    });
                  }}
                />
              </React.Fragment>
            ))
          : ''}
        <Button
          primary
          onClick={() => {
            const chartSources =
              data.chartSources && data.chartSources.length
                ? JSON.parse(JSON.stringify(data.chartSources))
                : [];
            chartSources.push({
              chart_source_link: '',
              chart_source: '',
            });
            props.onChange({
              ...data,
              chartSources: chartSources,
            });
          }}
        >
          Add source
        </Button>
      </Segment>
    </>
  ) : (
    ''
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
  Object.keys(providers).forEach(provider => {
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

const ConnectedMultiValuesEdit = connect(
  (state, props) => ({
    providers: getProviderData(state, props),
  }),
  {
    getDataFromProvider,
  },
)(MultiValuesEdit);

export default withObjectBrowser(ConnectedMultiValuesEdit);
