# Data-connected Volto components 

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

Volto-datablocks is an addon that has various blocks and utilities to provide "data-connected" components in volto websites.

**This add-on requires `eea.docker.plonesaas@5.2.4-66`.**

## Notation

* data-connected component: is a component or a block that displays information coming from outside sources; For example a table would get its data from a REST api server (discodata.eea.europa.eu) and show it as desired
* connector / provider: is a dexterity content type characterized by:
   
   * title: acts as the name of the connector and it used by plone to compose the short-name or route through which we can query the connector
   * endpoint_url: the url to the REST api server (ex. discodata.eea.europa.eu)
   * sql_query: the sql that will be executed on the REST api server
   * parameters (optional): a list of parameters (keys) through which we can filter the data fetched by the connector
   * required_parameters (optional): a list of required parameters which if not satisfed the connector will return empty data
   * collate (optional)
   * readme (optional)
* query string parameters or parameters from url; Ex. `https://frontend/home?db_version=latest&p=1&nrOfHits=10`
* data query are another type of parameters that are composed internally using redux
* connected data parameters is the global object that stores data queries; we will get more into this later

## Workflow 

A data-connected component will use a connector through which it gets its data.

[eea.api.dataconnector](https://github.com/eea/eea.api.dataconnector) is a plone add-on that expose an api through which a connector will run a query and fetch some data.

### How to use eea.api.dataconnector

eea.api.dataconnector expose `/@connector-data` through which we can make `POST` requests to get the data of a connector. We can pass some data to the request:

* `form` - parameters from url
* `data_query` - parameters from connected data parameters

You can use this api only over connectors.

Example:

Let's say that we have the following connector added into connectors folder:

```
title: Forests per capita
endpoint_url: https://discodata.eea.europa.eu/sql
sql_query: SELECT * FROM [FISE].[latest].[v_cnct_forest_per_capita]
parameters: ['NUTS_CODE']
```

The route to the connector will be `https://frontend/connectors/forests-per-capita`

By making the following request:

```
> curl --location --request POST 'http://backend/Plone/++api++/connectors/forests-per-capita/@connector-data'
```

the sql_query will be executed on specified endpoint_url (discodata) and after data is fetched the response will look like:

```JSON
{
   "@id": "https://backend/Plone/connectors/forests-per-capita",
   "data": {
      "metadata": {...},
      "results": {
         "COUNTRY": ["Albania", ...],
         "Forest per capita": [0.39, ...],
         "NUTS_CODE": ["AL", ...],
      }
   }
}
```

We can filter the data in two ways:

* By updating the sql before it is executed on discodata by adding where statements - this requires parameters property to be specified on the connector
* By filtering the data after it is fetched from discodata through for loops

Obs: both filtering are done on the backend. The response will always contain the filtered data.

In this case we can filter by `NUTS_CODE`. The request will look like:
```
> curl --location --request POST 'http://backend/Plone/++api++/connectors/forests-per-capita/@connector-data' \
--header 'Content-Type: application/json' \
--data '{
    "form": {
        "NUTS_CODE": "FR"
    }
}'
```

Because `NUTS_CODE` is specified in the parameters list of the connector the query will be modified and will look like this:

```sql
SELECT * FROM FISE.latest.v_cnct_forest_per_capita WHERE NUTS_CODE = 'FR'
```

So we get the data from discodata already filtered and the response will look like:

```JSON
{
   "@id": "https://backend/Plone/connectors/forests-per-capita",
   "data": {
      "metadata": {...},
      "results": {
         "COUNTRY": ["France"],
         "Forest per capita": [0.23],
         "NUTS_CODE": ["FR"],
      }
   }
}
```

If we don't have `NUTS_CODE` specified in the parameters list we will still get the data filtered by `NUTS_CODE` but after it is fetched from discodata. So by adding keys to parameters list can dramatically decrease the data usage.

If we want to set the same parameter but through data_query the request will look like this:
```
> curl --location --request POST 'http://backend/Plone/++api++/connectors/forests-per-capita/@connector-data' \
--header 'Content-Type: application/json' \
--data '{
   "data_query": [
      "i": "NUTS_CODE"
      "o": "plone.app.querystring.operation.selection.any"
      "v": ["FR"]
   ]
}'
```

Volto-datablocks offers 4 hooks through which a data-connected component can make requests to a connector:

```
connectToProviderData
connectToProviderDataUnfiltered
connectToMultipleProviders
connectToMultipleProvidersUnfiltered
```

Obs: a data-connected component needs to specify a provider_url (the path to the connector) to the hook used to fetch the data. We will get more into this later.

## Operators

### Parameters from url - `form`

Available operators:
```
eq          - equal
ne          - not equal
like
not like
in
nin         - not in
gt          - greater than
gte         - greater than equal
lt          - lower than
lte         - lower than equal
```

To specify an operator to a parameter from url you need to use this structure:

```
some/path?parameter[operation]=value
```

For example if on the homepage we have a data-connected component that uses `/connectors/forests-per-capita` as provider and we want to filter it by multiple `NUTS_CODE` we can set a url parameter using the 'in' operator like:

```
https://frontend/?NUTS_CODE[in]=RO,FR
```

### Parameters from data_query - `connected_data_parameters`

To be continued...

## Pagination

To be continued...

## Features

There are a few data-connected blocks in this add-on:

### SimpleDataTable

A data-connected table which allows pagination and filtering. It can be customized by implementing a template.

`TODO: tutorial on how to customize and demo`

### DataQueryFilter

A dropdown data-connected component that uses a provider to create a filter for it by a parameter selected from block configuration.

`TODO: demo`

### DottedTableChart

### CustomConnectedBlock



## Usage (for developers)

### How to connect a block to a provider?

As we said we have 4 hooks, 2 that uses filters and 2 that doesn't use filters. They require you to pass a getConfig function that returns an object. That object needs to have some specific data.

Here is the configuration needed to be passed to each hook:

1. `connectToProviderData`
```javascript
{
   provider_url: 'path/to/provider', // mandatory
   pagination: { // optional
      enabled: true,
      itemsPerPage: 5
   }
}
// Obs: provider_url is mandatory and pagination is optional. If pagination is not configured then connectToProviderData will run as if pagination is disabled.
```

2. `connectToProviderDataUnfiltered`
```javascript
{
   provider_url: 'path/to/provider' // mandatory
}
```

3. `connectToMultipleProviders`
```javascript
{
   provider: [ // mandatory
      {
         provider_url: 'path/to/provider', // mandatory
         name: 'some name', // optional
         title: 'some title', // optional
         data_query: [...some_data_query] // optional
         has_data_query_by_context: true // optional
         has_data_query_by_provider: true // optional
      }
   ]
}
```

4. `connectToMultipleProvidersUnfiltered`
```javascript
{
   provider: [ // mandatory
      {
         provider_url: 'path/to/provider', // mandatory
         name: 'some name', // optional
         title: 'some title', // optional
      }
   ]
}
```

Connecting to multiple providers doesn't allow pagination.

Here is an example on how to use `connectToProviderData`:


```javascript
import React from 'react';
import { compose } from 'redux';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';

...

const View = props => {
   ...
   return <YourComponents />
}

export default compose(
  connectToProviderData((props) => {
    return {
      provider_url: props.data?.provider_url,
    };
  }),
)(View);

```

## Getting started

1. Create new volto project if you don't already have one:

   ```
   $ npm install -g yo @plone/generator-volto
   $ yo @plone/volto my-volto-project --addon volto-datablocks

   $ cd my-volto-project
   $ yarn add -W volto-datablocks
   ```

1. If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "volto-datablocks"
   ],

   "dependencies": {
       "volto-datablocks": "^1.1.0"
   }
   ```

1. Install new add-ons and restart Volto:

   ```
   $ yarn
   $ yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Release

### Automatic release using Jenkins

*  The automatic release is started by creating a [Pull Request](../../compare/master...develop) from `develop` to `master`. The pull request status checks correlated to the branch and PR Jenkins jobs need to be processed successfully. 1 review from a github user with rights is mandatory.
* It runs on every commit on `master` branch, which is protected from direct commits, only allowing pull request merge commits.
* The automatic release is done by [Jenkins](https://ci.eionet.europa.eu). The status of the release job can be seen both in the Readme.md badges and the green check/red cross/yellow circle near the last commit information. If you click on the icon, you will have the list of checks that were run. The `continuous-integration/jenkins/branch` link goes to the Jenkins job execution webpage.
* Automated release scripts are located in the `eeacms/gitflow` docker image, specifically [js-release.sh](https://github.com/eea/eea.docker.gitflow/blob/master/src/js-release.sh) script. It  uses the `release-it` tool.
* As long as a PR request is open from develop to master, the PR Jenkins job will automatically re-create the CHANGELOG.md and package.json files to be production-ready.
* The version format must be MAJOR.MINOR.PATCH. By default, next release is set to next minor version (with patch 0).
* You can manually change the version in `package.json`.  The new version must not be already present in the tags/releases of the repository, otherwise it will be automatically increased by the script. Any changes to the version will trigger a `CHANGELOG.md` re-generation.
* Automated commits and commits with [JENKINS] or [YARN] in the commit log are excluded from `CHANGELOG.md` file.

### Manual release from the develop branch ( beta release )

#### Installation and configuration of release-it

You need to first install the [release-it](https://github.com/release-it/release-it)  client.

   ```
   npm install -g release-it
   ```

Release-it uses the configuration written in the [`.release-it.json`](./.release-it.json) file located in the root of the repository.

Release-it is a tool that automates 4 important steps in the release process:

1. Version increase in `package.json` ( increased from the current version in `package.json`)
2. `CHANGELOG.md` automatic generation from commit messages ( grouped by releases )
3. GitHub release on the commit with the changelog and package.json modification on the develop branch
4. NPM release ( by default it's disabled, but can be enabled in the configuration file )

To configure the authentification, you need to export GITHUB_TOKEN for [GitHub](https://github.com/settings/tokens)

   ```
   export GITHUB_TOKEN=XXX-XXXXXXXXXXXXXXXXXXXXXX
   ```

 To configure npm, you can use the `npm login` command or use a configuration file with a TOKEN :

   ```
   echo "//registry.npmjs.org/:_authToken=YYYYYYYYYYYYYYYYYYYYYYYYYYYYYY" > .npmrc
   ```

#### Using release-it tool

There are 3 yarn scripts that can be run to do the release

##### yarn release-beta

Automatically calculates and presents 3 beta versions - patch, minor and major for you to choose ( or Other for manual input).

```
? Select increment (next version):
❯ prepatch (0.1.1-beta.0)
  preminor (0.2.0-beta.0)
  premajor (1.0.0-beta.0)
  Other, please specify...
```

##### yarn release-major-beta

Same as `yarn release-beta`, but with premajor version pre-selected.

##### yarn release

Generic command, does not automatically add the `beta` to version, but you can still manually write it if you choose Other.

#### Important notes

> Do not use release-it tool on master branch, the commit on CHANGELOG.md file and the version increase in the package.json file can't be done without a PULL REQUEST.

> Do not keep Pull Requests from develop to master branches open when you are doing beta releases from the develop branch. As long as a PR to master is open, an automatic script will run on every commit and will update both the version and the changelog to a production-ready state - ( MAJOR.MINOR.PATCH mandatory format for version).


## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-datablocks/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-datablocks/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)