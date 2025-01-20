import React, { useState } from 'react';
import { Button, Form, Grid, Accordion } from 'semantic-ui-react';
import { Field, Icon, TextWidget } from '@plone/volto/components';
import upSVG from '@plone/volto/icons/up-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';

const SourceEdit = ({ data, onChangeBlock, block }) => {
  const [activeAccIndex, setActiveAccIndex] = useState(0);

  function handleAccClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeAccIndex === index ? -1 : index;

    setActiveAccIndex(newIndex);
  }

  return (
    <Accordion fluid styled className="form">
      <Accordion.Title
        active={activeAccIndex === 0}
        index={0}
        onClick={handleAccClick}
      >
        Sources
        {activeAccIndex === 0 ? (
          <Icon name={upSVG} size="20px" />
        ) : (
          <Icon name={downSVG} size="20px" />
        )}
      </Accordion.Title>
      <Accordion.Content active={activeAccIndex === 0}>
        {data.chartSources && data.chartSources.length
          ? data.chartSources.map((item, index) => (
              <React.Fragment key={`chart-source-fragment_${index}`}>
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
                    onChangeBlock(block, {
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
                    onChangeBlock(block, {
                      ...data,
                      chartSources: dataClone,
                    });
                  }}
                />
              </React.Fragment>
            ))
          : ''}

        <Form.Field inline>
          <Grid>
            <Grid.Row stretched>
              <Grid.Column stretched columns={12}>
                <div className="wrapper">
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
                      onChangeBlock(block, {
                        ...data,
                        chartSources: chartSources,
                      });
                    }}
                  >
                    Add source
                  </Button>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form.Field>
      </Accordion.Content>

      <Accordion.Title
        active={activeAccIndex === 1}
        index={1}
        onClick={handleAccClick}
      >
        Source (legacy)
        {activeAccIndex === 1 ? (
          <Icon name={upSVG} size="20px" />
        ) : (
          <Icon name={downSVG} size="20px" />
        )}
      </Accordion.Title>
      <Accordion.Content active={activeAccIndex === 1}>
        <Field
          title="Source"
          id="chart-source"
          type="text"
          value={data.chart_source || ''}
          required={false}
          onChange={(e, d) =>
            onChangeBlock(block, {
              ...data,
              chart_source: d,
            })
          }
        />
        <Field
          title="Source Link"
          id="chart-source-link"
          type="text"
          value={data.chart_source_link || ''}
          required={false}
          onChange={(e, d) =>
            onChangeBlock(block, {
              ...data,
              chart_source_link: d,
            })
          }
        />
      </Accordion.Content>
    </Accordion>
  );
};

export default SourceEdit;
