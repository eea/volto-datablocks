import React from 'react';
import downloadSVG from '@plone/volto/icons/download.svg';
import { Icon as VoltoIcon } from '@plone/volto/components';
import { Grid } from 'semantic-ui-react';
import { settings } from '~/config';

//  <React.Fragment>
//    {providerUrl && (
//      <a
//        href={`${settings.apiPath}${providerUrl}/@@download`}
//        className="discreet download-button"
//        title="Download data"
//      >
//        <VoltoIcon name={downloadSVG} size="20" />
//      </a>
//    )}

//    <div className="sources">
//      <span className="discreet">
//        {initialSource || (multipleSources && multipleSources.length)
//          ? multipleSources && multipleSources.length
//            ? 'Sources: '
//            : 'Source: '
//          : ''}
//      </span>
//      <a
//        className="discreet block_source"
//        href={initialSourceLink}
//        target="_blank"
//        rel="noopener noreferrer"
//      >
//        {initialSource}
//      </a>
//      {multipleSources && multipleSources.length
//        ? multipleSources.map(item => (
//            <a
//              className="discreet block_source"
//              href={item.chart_source_link}
//              target="_blank"
//              rel="noopener noreferrer"
//            >
//              {item.chart_source}
//            </a>
//          ))
//        : ''}
//    </div>
//  </React.Fragment>

const SourceView = ({
  initialSource,
  initialSourceLink,
  multipleSources,
  providerUrl,
}) => {
  return '';
};

export default SourceView;
