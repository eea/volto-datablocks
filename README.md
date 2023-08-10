# volto-datablocks

[![Releases](https://img.shields.io/github/v/release/eea/volto-datablocks)](https://github.com/eea/volto-datablocks/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-datablocks%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-datablocks/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datablocks-master&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datablocks-master)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datablocks-master&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datablocks-master)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datablocks-master&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datablocks-master)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datablocks-master&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datablocks-master)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-datablocks%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-datablocks/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datablocks-develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datablocks-develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datablocks-develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datablocks-develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datablocks-develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datablocks-develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datablocks-develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datablocks-develop)


[Volto](https://github.com/plone/volto) add-on

## Features

Demo GIF

## Getting started

### Try volto-datablocks with Docker

      git clone https://github.com/eea/volto-datablocks.git
      cd volto-datablocks
      make
      make start

Go to http://localhost:3000

### Add volto-datablocks to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-datablocks"
   ],

   "dependencies": {
       "@eeacms/volto-datablocks": "*"
   }
   ```

* If not, create one:

   ```
   npm install -g yo @plone/generator-volto
   yo @plone/volto my-volto-project --canary --addon @eeacms/volto-datablocks
   cd my-volto-project
   ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-datablocks/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-datablocks/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-datablocks/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
