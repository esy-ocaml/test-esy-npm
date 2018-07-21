const cases = [
  {
    name: "react",
    test: `
      require('react');
    `
  },
  {
    name: "bs-platform"
  },
  {
    name: "browserify",
    test: `
      require('browserify');
    `
  },
  {
    name: "webpack",
    test: `
      require('webpack');
    `
  },
  {
    name: "jest-cli",
    test: `
      require('jest-cli');
    `
  },
  {
    name: "flow-bin",
    test: `
      require('flow-bin');
    `
  },
  {
    name: "babel-cli",
    test: `
      require('babel-core');
    `
  },
];

const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const rmSync = require('rimraf').sync;

const ESYI = process.env.ESYI || 'esyi';
const ESY = process.env.ESY || 'esy';

child_process.execSync(`which ${ESYI}`, {stdio: 'inherit'});
child_process.execSync(`which ${ESY}`, {stdio: 'inherit'});

const cwd = __dirname;

rmSync(path.join(cwd, '_build'));
fs.mkdirSync(path.join(cwd, '_build'));

let reposUpdated = false;

for (let c of cases) {

  console.log(`*** Testing ${c.name}`);

  const sandboxPath = path.join(cwd, '_build', c.name);

  const packageJson = {
    name: `test-${c.name}`,
    version: '0.0.0',
    esy: {build: ['true']},
    dependencies: {
      [c.name]: "*"
    }
  };

  fs.mkdirSync(sandboxPath);
  fs.writeFileSync(
    path.join(sandboxPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  child_process.execSync(`${ESY} install`, {
    cwd: sandboxPath,
    stdio: 'inherit',
  });

  child_process.execSync(`${ESY} build`, {
    cwd: sandboxPath,
    stdio: 'inherit',
  });

  if (c.test != null) {
    fs.writeFileSync(
      path.join(sandboxPath, 'test.js'),
      c.test
    );
  console.log(`*** Running test ***`);
    child_process.execSync(`node ./test.js`, {
      cwd: sandboxPath,
      stdio: 'inherit',
    });
  }

  console.log(`*** OK ***`);
  rmSync(sandboxPath);

}
