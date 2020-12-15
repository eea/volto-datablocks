# Data-connected Volto components 
[![Releases](https://img.shields.io/github/v/release/eea/volto-datablocks)](https://github.com/eea/volto-datablocks/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-datablocks%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-datablocks/job/master/display/redirect)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-datablocks%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-datablocks/job/develop/display/redirect)

This addon has various blocks and utilities to provide "data-connected" components in Volto websites.

### What is a "data-connected component?"

A data-connected component, as we use the term here, is a component that displays information coming from outside sources. For example, a chart would get its data from an uploaded CSV file, or a block can display values that come from a REST api server (discodata.eea.europa.eu), there's even a prototype "data-connected entity" for the draftjs richtext editor.

## Getting started

1. Create new volto project if you don't already have one:

   ```
   $ npm install -g yo @plone/generator-volto
   $ yo @plone/volto my-volto-project --addon @eeacms/volto-datablocks

   $ cd my-volto-project
   $ yarn add -W @eeacms/volto-datablocks
   ```

1. If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-datablocks"
   ],

   "dependencies": {
       "@eeacms/volto-datablocks": "^1.1.0"
   }
   ```

1. Install new add-ons and restart Volto:

   ```
   $ yarn
   $ yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-datablocks/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-datablocks/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)