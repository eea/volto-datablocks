### Development setup

- Needs to be available at `<docker orchestration folder>/frontend-addons/volto-datablocks`
- To have working eslint, you need to run `npm install` in the package folder.
- You need to add the `volto-datablocks` path to the .eslintrc, to be able to
  resolve the new development package
- In the container, in the `/opt/addons` path, run:

```
npm link
cd /opt/frontend
npm link volto-datablocks
```
