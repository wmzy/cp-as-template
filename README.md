[![Build Status](https://travis-ci.org/wmzy/cp-as-template.svg?branch=master)](https://travis-ci.org/wmzy/cp-as-template)
[![Coverage Status](https://coveralls.io/repos/github/wmzy/cp-as-template/badge.svg?branch=master)](https://coveralls.io/github/wmzy/cp-as-template?branch=master)
# cp-as-template

> Copy source code file as a template. If you often new file by copy & search & replace,try it.

## Install

```bash
npm i -g cp-as-template
```
or test
```bash
npx cp-as-template --help
```

## Usage

```js
// user.js

class User{}

function createUser() {
  const user = new User();
  return user;
}
```

```bash
$ cp-as-template user.js post.js
$ cat post.js
```
```js
// user.js

class Post{}

function createPost() {
  const post = new Post();
  return post;
}
```

### More
```bash
$ cp-as-template --help

  Usage: cp-as-template [options] <source> <dest>

  Options:

    -V, --version  output the version number
    -v, --verbose  explain what is being done
    -h, --help     output usage information

```
