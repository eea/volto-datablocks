import React from 'react';
import cx from 'classnames';
import { Popup } from 'semantic-ui-react';
import { UniversalLink } from '@plone/volto/components';

const Link = ({ children, ...props }) => {
  if (props.href) {
    return <UniversalLink {...props}>{children}</UniversalLink>;
  }
  return <span {...props}>{children}</span>;
};

const Source = ({ source }) => {
  if (source.chart_source_link && source.chart_source) {
    return <Link href={source.chart_source_link}>{source.chart_source}</Link>;
  }
  if (source.chart_source) {
    return <span>{source.chart_source}</span>;
  }
  return (
    <>
      <Link className="embed-sources-param-title" href={source.link}>
        {source.title}
      </Link>
      {source.organisation && (
        <>
          ,{' '}
          <span className="embed-sources-param-description">
            {source.organisation}
          </span>
        </>
      )}
    </>
  );
};

export default function Sources({ sources }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popup
      popper={{ id: 'vis-toolbar-popup', className: 'sources-popup' }}
      position="bottom left"
      on="click"
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      trigger={
        <div className="sources">
          <button className={cx('trigger-button', { open })}>Sources</button>
        </div>
      }
      content={
        sources?.length ? (
          <ol className="sources-list">
            {sources?.map((source, index) => {
              return (
                <li key={index}>
                  <Source source={source} />
                </li>
              );
            })}
          </ol>
        ) : (
          <p>Data provenance is not set for this visualization.</p>
        )
      }
    />
  );
}
