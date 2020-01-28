import React from 'react';
import downloadSVG from '@plone/volto/icons/download.svg';
import { Icon as VoltoIcon } from '@plone/volto/components';
import { Grid } from 'semantic-ui-react';

const SourceView = ({
  initialSource,
  initialSourceLink,
  multipleSources,
  providerUrl,
}) => {
  return (
    <div className="sources">
      <span className="discreet">
        {initialSource || (multipleSources && multipleSources.length)
          ? multipleSources && multipleSources.length
            ? 'Sources: '
            : 'Source: '
          : ''}
      </span>
      <Grid columns={2} stretched>
        <Grid.Column width={10}>
          <a
            className="discreet block_source"
            href={initialSourceLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {initialSource}
          </a>
          {multipleSources && multipleSources.length
            ? multipleSources.map(item => (
                <a
                  className="discreet block_source"
                  href={item.chart_source_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.chart_source}
                </a>
              ))
            : ''}
        </Grid.Column>
        <Grid.Column width={2} textAlign="right">
          {providerUrl && (
            <a
              href={`${providerUrl}/@@download`}
              className="discreet"
              title="Download data"
            >
              <VoltoIcon name={downloadSVG} size={20} />
            </a>
          )}
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default SourceView;
