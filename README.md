# Ancient Sql Graph

[![GitHub Release](https://img.shields.io/github/release/AncientSouls/SqlGraph.svg)](https://github.com/AncientSouls/SqlGraph/releases)
[![NPM](https://img.shields.io/npm/v/ancient-sql-graph.svg)](https://www.npmjs.com/package/ancient-sql-graph)
[![Build Status](https://travis-ci.org/AncientSouls/SqlGraph.svg?branch=master)](https://travis-ci.org/AncientSouls/SqlGraph)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8c937e5b27664767b7740f1042ed305b)](https://www.codacy.com/app/valentineus/Ancient-SqlGraph)
[![Codacy Coverage Badge](https://api.codacy.com/project/badge/Coverage/8c937e5b27664767b7740f1042ed305b)](https://www.codacy.com/app/valentineus/Ancient-SqlGraph/files)
[![Gitter Badge](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/AncientSouls/SqlGraph)

Implementation, load testing, comparison of popular ways of storing graphs and searching by them in databases.

## Installation

You can download the installation package:

* [NPM package manager](https://www.npmjs.com/package/ancient-sql-graph);
* [GitHub Releases](https://github.com/AncientSouls/SqlGraph/releases);
* [Compilation from the source code](#build);

## Description

The purpose of the package is to search and analyze the ways of storing graphs in SQL databases. SQLite is used as the database and SQL language of the package, as the most universal representative of the SQL family.

### Tasks

- [ ] Random graph generator for tests
- Random graph settings for different stress tests
  - [ ] maxLeaves n
  - insert
    - [ ] chance %
    - source
      - [ ] new %
      - [ ] old %
      - [ ] old leaves %/roots %/edges %
    - target
      - [ ] new %
      - [ ] old %
      - [ ] old leaves %/roots %/edges %
  - update
    - [ ] chance %
    - source
      - [ ] chance %
      - [ ] new %
      - [ ] old %
      - [ ] old leaves %/roots %/edges %
    - target
      - [ ] chance %
      - [ ] new %
      - [ ] old %
      - [ ] old leaves %/roots %/edges %
  - delete
    - [ ] chance %
- [ ] Recursive implementation (R)
- Nested set
  - [ ] Nested set implementation (NS)
  - [ ] Nested set with multi position implementation for multi parents and recursions (NS+M)
  - [ ] Nested set with merges and inherits implementation for multi parents and recursions (NS+MI)
- Adjacency list
  - [ ] Adjacency list implementation (AL)
  - [ ] Adjacency list in 36 bit (AL36)
  - [ ] Adjacency list with multi position implementation for multi parents and recursions (AL+M)
  - [ ] Adjacency list in 36 bit with multi position implementation for multi parents and recursions (AL36+M)
  - [ ] Adjacency list with merges and inherits implementation for multi parents and recursions (AL+MI)
  - [ ] Adjacency list in 36 bit with merges and inherits implementation for multi parents and recursions (AL36+MI)

## Build

To perform a self-assembly project or add your own turbo add-on, follow these simple steps:

* Clone the repository and prepare it for work:
```bash
git clone https://github.com/AncientSouls/SqlGraph.git ancient-sql-graph
cd ./ancient-sql-graph
NODE_ENV=development npm install
```

* In this step, make the necessary changes to the code, if required.

* After making the changes, perform the code check with the parser:
```bash
npm run check
```

* Perform functional testing of the code:
```bash
npm run test
```

* After successfully passing the tests, compile the source code:
```bash
npm run build
```

* Done!
If required, create a package to install and distribute your version:
```bash
npm pack
```

## License

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/eslint/eslint)

[MIT](LICENSE.md).
Copyright (c)
[AncientSouls](https://ancientsouls.github.io/).