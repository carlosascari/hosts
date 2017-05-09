# hosts

A module for editing `hosts` files programmatically.

## Install

`npm i @ascari/hosts --save`

## Usage

```
const hosts = require('hosts');

// Sync write to hosts file.
hosts.set('127.0.0.1', 'yourside.dev');

console.log('path', hosts.getPath());
console.log('entries', hosts.get());
```

## API

##### method setPath(*String* path)
Set path of *hosts* file to modify.

##### method getPath() -> *String*
Get path set for *hosts* file.

##### method set(*String* ip, *String* hostname)
Add a new entry to hosts file.

##### method unset(*String* ip, *RegExp|String* [hostname])
Remove a existing entry by its ip and hostname.
**NOTE: Not implemented.**

##### method get(*String* [ip], *RegExp|String* [pattern]) -> *Array of Objects*
Retrieve a entry by its id and hostname or a regexp pattern to match. If no arguments are set, then all entries are returned.

## License

MIT