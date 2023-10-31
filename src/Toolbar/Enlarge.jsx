import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';

const EnlargeWidget = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="enlarge">
      <button className="trigger-button" onClick={() => setIsOpen(true)}>
        <i className="ri-fullscreen-line" />
        Enlarge
      </button>
      <Modal
        open={isOpen}
        closeIcon={
          <span className="close icon">
            <i class="ri-close-line" />
          </span>
        }
        onClose={() => setIsOpen(false)}
        className="enlarge-modal"
      >
        <Modal.Content>{children}</Modal.Content>
      </Modal>
    </div>
  );
};

export default EnlargeWidget;
