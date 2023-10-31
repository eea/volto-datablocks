import React from 'react';
import { Popup, Input, Button } from 'semantic-ui-react';
import cx from 'classnames';

const useCopyToClipboard = (text) => {
  const [copyStatus, setCopyStatus] = React.useState('inactive');
  const copy = React.useCallback(() => {
    navigator.clipboard.writeText(text).then(
      () => setCopyStatus('copied'),
      () => setCopyStatus('failed'),
    );
  }, [text]);

  React.useEffect(() => {
    if (copyStatus === 'inactive') {
      return;
    }

    const timeout = setTimeout(() => setCopyStatus('inactive'), 3000);

    return () => clearTimeout(timeout);
  }, [copyStatus]);

  return [copyStatus, copy];
};

const Share = ({ href = '' }) => {
  const [open, setOpen] = React.useState(false);

  const CopyUrlButton = ({ className, url, buttonText }) => {
    const [copyUrlStatus, copyUrl] = useCopyToClipboard(url);

    if (copyUrlStatus === 'copied') {
      buttonText = 'Copied!';
    } else if (copyUrlStatus === 'failed') {
      buttonText = 'Copy failed. Please try again.';
    }

    return (
      <Button
        primary
        onClick={copyUrl}
        className={cx('copy-button', className)}
      >
        {buttonText}
      </Button>
    );
  };

  return (
    <Popup
      popper={{ id: 'vis-toolbar-popup', className: 'share-popup' }}
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
        <div className="share">
          <button className={cx('trigger-button', { open })}>
            <i class="ri-share-fill"></i>
            <span>Share</span>
          </button>
        </div>
      }
      content={
        <>
          <div className="item">
            <span className="label">Copy link</span>
            <div className="control">
              <Input className="share-link" value={href} />
              <CopyUrlButton
                className="copy-button"
                url={href}
                buttonText="Copy"
              />
            </div>
          </div>
        </>
      }
    />
  );
};

export default Share;
