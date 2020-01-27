import React from 'react';

const SourceView = ({ initialSource, initialSourceLink, multipleSources }) => {
  return (
    <div className="sources">
      <span className="discreet">
        {multipleSources && multipleSources.length ? 'Sources' : 'Source'}:
      </span>
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
    </div>
  );
};

export default SourceView;
