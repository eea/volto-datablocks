import { openSidebar, closeSidebar } from '../index';

export const changePageTitle = (title) => {
  return cy
    .get('.documentFirstHeading > .public-DraftStyleDefault-block')
    .clear()
    .type(title)
    .get('.documentFirstHeading span[data-text]')
    .contains(title);
};

export const addBlock = (groupTitle, groupId, blockId) => {
  closeSidebar();
  cy.get('.ui.basic.icon.button.block-add-button').first().click();
  cy.get('.blocks-chooser .title').contains(groupTitle).click();
  cy.get(`.content.active.${groupId} .button.${blockId}`).click();
  cy.get(`#page-edit div.block-editor-${blockId}`);
  openSidebar();
};

export const selectBlock = (blockId) => {
  cy.get(`#page-edit div.block-editor-${blockId}`).click();
};
