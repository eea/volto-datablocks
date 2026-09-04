import { slateBeforeEach, slateAfterEach } from '../support/e2e';

const CONTENT_PATH = 'cypress/my-page';
const CONDITIONAL_TEXT = 'Conditional inner text';
const CONNECTOR_PATH = '**/cypress/mock-provider/@connector-data';
const CONDITIONAL_INNER_SCOPE =
  '.block-editor-conditionalDataBlock .section-block';

const getApiPath = () =>
  Cypress.env('API_PATH') || 'http://localhost:8080/Plone';

const getAuth = () => ({
  user: 'admin',
  pass: 'admin',
});

const buildConditionalPageData = ({
  condition = 'EEA',
  disableInnerButtons = false,
  providerUrl = '/cypress/mock-provider',
} = {}) => ({
  title: 'My Page',
  blocks: {
    'conditional-title': {
      '@type': 'title',
    },
    'conditional-block': {
      '@type': 'conditionalDataBlock',
      title: 'Conditional block',
      ...(providerUrl ? { provider_url: providerUrl } : {}),
      column_data: 'country',
      operator: '=',
      condition,
      ...(disableInnerButtons ? { disableInnerButtons: true } : {}),
      data: {
        blocks: {
          'conditional-inner-text': {
            '@type': 'slate',
            plaintext: CONDITIONAL_TEXT,
            value: [
              {
                type: 'p',
                children: [{ text: CONDITIONAL_TEXT }],
              },
            ],
          },
        },
        blocks_layout: {
          items: ['conditional-inner-text'],
        },
      },
    },
  },
  blocks_layout: {
    items: ['conditional-title', 'conditional-block'],
  },
});

const updatePageBlocks = (options = {}) =>
  cy.request({
    method: 'PATCH',
    url: `${getApiPath()}/${CONTENT_PATH}`,
    headers: {
      Accept: 'application/json',
    },
    auth: getAuth(),
    body: buildConditionalPageData(options),
  });

const mockConnectorData = (values) =>
  cy
    .intercept('POST', CONNECTOR_PATH, {
      statusCode: 200,
      body: {
        data: {
          results: {
            country: values,
          },
          metadata: {},
        },
      },
    })
    .as('connectorData');

const addConditionalDataBlock = () => {
  cy.get('.block-editor-slate [contenteditable=true]')
    .last()
    .focus()
    .click()
    .type('/conditional{enter}');

  cy.get('.block-editor-conditionalDataBlock').should('be.visible');
};

describe('Conditional data block tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('keeps inner controls available for nested blocks in edit mode', () => {
    addConditionalDataBlock();

    cy.get(`${CONDITIONAL_INNER_SCOPE} .block-add-button:visible`)
      .first()
      .should('be.visible')
      .click({ force: true });

    cy.get('.blocks-chooser .title').contains('Text').click();
    cy.get('.ui.basic.icon.button.slate').contains('Text').click();

    cy.get(
      '.block-editor-conditionalDataBlock .slate-editor.selected [contenteditable=true]',
    )
      .should('be.visible')
      .click()
      .type(CONDITIONAL_TEXT);

    cy.contains(CONDITIONAL_INNER_SCOPE, CONDITIONAL_TEXT).should('be.visible');
    cy.get(`${CONDITIONAL_INNER_SCOPE} .delete-button:visible`).should('exist');
  });

  it('hides inner controls when disableInnerButtons is enabled', () => {
    updatePageBlocks({
      disableInnerButtons: true,
      providerUrl: '',
    });

    cy.visit('/cypress/my-page/edit');
    cy.waitForResourceToLoad('my-page');

    cy.get('.block-editor-conditionalDataBlock').should('be.visible');
    cy.contains(CONDITIONAL_INNER_SCOPE, CONDITIONAL_TEXT).click({
      force: true,
    });
    cy.get('.block-editor-conditionalDataBlock .section-block').should(
      'have.class',
      'disable-inner-buttons',
    );
    cy.get(`${CONDITIONAL_INNER_SCOPE} .block-add-button:visible`).should(
      'not.exist',
    );
    cy.get(`${CONDITIONAL_INNER_SCOPE} .delete-button:visible`).should(
      'not.exist',
    );
  });

  it('renders nested content when the connector condition matches', () => {
    updatePageBlocks({ condition: 'EEA' });
    mockConnectorData(['EEA']);

    cy.visit('/cypress/my-page');
    cy.wait('@connectorData');

    cy.contains(CONDITIONAL_TEXT).should('be.visible');
  });

  it('hides nested content when the connector condition does not match', () => {
    updatePageBlocks({ condition: 'EEA' });
    mockConnectorData(['non-EEA']);

    cy.visit('/cypress/my-page');
    cy.wait('@connectorData');

    cy.contains(CONDITIONAL_TEXT).should('not.exist');
  });
});
