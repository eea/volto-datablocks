import React from 'react';
import { Icon } from '@plone/volto/components';
import expandSVG from '@plone/volto/icons/vertical.svg';
import { Button, Image, Modal } from 'semantic-ui-react';
import logoDummy from './static/logoDummy.png';
import ReadMore from './ReadMore';
import PopupMap from './PopupMap';

const modalSchema = {
  title: 'Modal title',
  logo: logoDummy,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  mapData: [],
  tableData: {},
  url: 'https://google.com',
};

const PopupRow = ({ data }) => {
  const [expand, setExpand] = React.useState(false);

  const handleExpand = () => {
    setExpand(true);
    console.log('rowdata', data);
  };

  const handleClose = () => {
    setExpand(false);
  };

  return (
    <Modal
      onClose={() => handleClose()}
      onOpen={() => handleExpand()}
      open={expand}
      trigger={<Icon name={expandSVG} size="2rem" className="expand-row" />}
    >
      <Modal.Header>
        {modalSchema.title}
        <Image size="tiny" src={modalSchema.logo} wrapped floated="right" />
      </Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <ReadMore maxChars={200} text={modalSchema.description} />
        </Modal.Description>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '50%' }}>
            <div
              style={{
                width: '200px',
                height: '200px',
                background: 'lightBlue',
              }}
            >
              <p>Table zone</p>
            </div>
            <p>{modalSchema.url}</p>
          </div>
          <div style={{ width: '50%' }}>
            <PopupMap data={data} />
          </div>
        </div>
      </Modal.Content>

      <Modal.Actions>
        <Button onClick={() => handleClose()}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PopupRow;
