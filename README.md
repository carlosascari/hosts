# hosts

Edit your `hosts` file programmatically.

## Install

`npm i @ascari/hosts --save`

## Usage

Use set to make certain that a hostname is registered

```
const hosts = require('@ascari/hosts');

// Sync write to hosts file.
hosts.set('127.0.0.1', 'mywebsite.dev');
hosts.set('127.0.0.1', 'mywebsite.com');
hosts.set('127.0.0.1', 'api.mywebsite.com');

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
Remove a existing entry or entries by their ip and hostname.

##### method get(*String* [ip], *RegExp|String* [pattern]) -> *Array of Objects*
Retrieve a entry by its id and hostname or a regexp pattern to match. If no arguments are set, then all entries are returned.

## License

MIT