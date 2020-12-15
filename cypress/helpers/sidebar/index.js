export const openSidebar = () => {
  cy.get('#sidebar > div.sidebar-container').then(($sidebar) => {
    if ($sidebar.hasClass('collapsed')) {
      cy.get('#sidebar > div.sidebar-container > button.ui.button.trigger')
        .first()
        .click();
    }
  });
};

export const closeSidebar = () => {
  cy.get('#sidebar > div.sidebar-container').then(($sidebar) => {
    if (!$sidebar.hasClass('collapsed')) {
      cy.get('#sidebar > div.sidebar-container > button.ui.button.trigger')
        .first()
        .click();
    }
  });
};

export const openSidebarTab = (tab) => {
  openSidebar();
  cy.get(
    '#sidebar > div.sidebar-container div.ui.pointing.secondary.attached.tabular.formtabs.menu > a.item',
  )
    .contains(tab)
    .then(($tab) => {
      if (!$tab.hasClass('active')) {
        cy.get(
          '#sidebar > div.sidebar-container div.ui.pointing.secondary.attached.tabular.formtabs.menu > a.item',
        )
          .contains(tab)
          .click();
      }
    });
};
