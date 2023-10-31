import React from 'react';
import { Popup } from 'semantic-ui-react';
import { isArray, isString } from 'lodash';
import cx from 'classnames';
import {
  serializeNodes,
  serializeNodesToText,
} from '@plone/volto-slate/editor/render';

export const serializeText = (notes) => {
  const content = isArray(notes) ? serializeNodes(notes) : notes;
  const text = isArray(notes)
    ? serializeNodesToText(notes)
    : isString(notes)
    ? notes
    : '';
  if (!text) return <p>There are no notes set for this visualization</p>;
  return content;
};

export default function FigureNote({ notes = [] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popup
      popper={{ id: 'vis-toolbar-popup', className: 'figure-note-popup' }}
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
        <div className="figure-note">
          <button className={cx('trigger-button', { open })}>Note</button>
        </div>
      }
    >
      <Popup.Content>{serializeText(notes)}</Popup.Content>
    </Popup>
  );
}
