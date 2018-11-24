/*!
* hosts
* Copyright(c) 2017-2018 Carlos Ascari Gutierrez Hermosillo
* MIT Licensed
*/

'use strict';

/**
* Hosts file modification
*
* Singleton for editing /etc/hosts files.
* @module hosts
*/

const hosts = module.exports = {};

/*!
* Module dependencies.
*/

const fs = require('fs');
const onepath = require('onepath')();
const os = require('os');

/**
* Path to **hosts** file.
* @private
* @type {String}
*/
let filename = '/etc/hosts';
if (os.platform() === 'win32') {
  filename = 'C:\\Windows\\System32\\drivers\\etc\\hosts';
}

/**
* Loads & parses the `hosts` file.
* @private
* @method load
*/
const load = () => {
  const file = fs.readFileSync(filename, 'utf8')
  const lines = file.split('\n');
  const entries = lines.map(x => {
    if (x.trim()) {
      if (x.trim()[0] === '#') {
        return { comment: x };
      } else {
        const index = x.indexOf(' ');
        const ip = x.substr(0, index);
        const hostname = x.substr(index + 1).trim();
        return { ip, hostname };
      }
    } else {
      return { whitespace: x };
    }
  });
  return entries;
}

/**
* Saves entries in memory to `hosts` file.
* @private
* @method save
* @param {Array<Object>} entries
*/
const save = (entries) => {
  const mappedEntries = entries.map(entry => {
    if ('string' === typeof(entry.comment)) {
      return `# ${entry.comment.trim()}`.trim();
    } else if ('string' === typeof(entry.whitespace)) {
      return `${entry.whitespace}`.trim();
    } else if ('string' === typeof(entry.ip)) {
      return `${entry.ip} ${entry.hostname}`.trim();
    }
  });
  fs.writeFileSync(filename, `${ mappedEntries.join('\n') }`);
}

/**
* Sets path to **hosts** file.
* @method setPath
* @param {String} path Path to `hosts` file.
*/
hosts.setPath = (path) => { filename = onepath(path); }

/**
* Returns path to **hosts** file.
* @method getPath
* @return {String} Path to `hosts` file.
*/
hosts.getPath = () => { return filename; }

/**
* Adds a new entry to the hosts file **in-memory**, if id does not already exist.
* @thows {Error} When ip is undefined or not a String.
* @thows {Error} When hostname is undefined or not a String.
* @method set
* @param {String} ip
* @param {String} hostname
*/
hosts.set = (ip, hostname) => {
  if (ip && 'string' === typeof(ip)) {
    if (hostname && 'string' === typeof(hostname)) {
      const entries = load();
      for (let i = 0, l = entries.length; i < l; i++) {
        const entry = entries[i];
        if (entry.ip === ip && entry.hostname === hostname) {
          return;
        }
      }
      entries.push({ ip, hostname });
      save(entries);
    } else {
      throw new Error('Missing hostname. Must be a String.');
    }
  } else {
    throw new Error('Missing ip. Must be a String.');
  }
}

/**
* Removes an existing entry in the hosts file **in-memory**.
* @thows {Error} NOT_IMPLEMENTED
* @thows {Error} When ip is undefined or not a String.
* @method unset
* @param {String} ip
* @param {String} hostname
*/
hosts.unset = (ip, hostname) => {
  if (ip && 'string' === typeof(ip)) {
    const entries = load();
    if (hostname) {
      if (hostname instanceof RegExp) {
        for (let i = 0, l = entries.length; i < l; i++) {
          const entry = entries[i];
          if (entry.ip === ip && hostname.test(entry.hostname)) {
            entries.splice(i, 1);
          }
        }
      } else {
        for (let i = 0, l = entries.length; i < l; i++) {
          const entry = entries[i];
          if (entry && entry.ip === ip && entry.hostname === hostname) {
            console.log(hostname, entry)
            entries.splice(i, 1);
          }
        }
      }
    } else {
      for (let i = 0, l = entries.length; i < l; i++) {
        const entry = entries[i];
        if (entry.ip === ip) {
          entries.splice(i, 1);
        }
      }
    }
    console.log('entries', entries)
    save(entries);
  } else {
    throw new Error('Missing ip. Must be a String.');
  }
}

/**
* Removes an existing entry in the hosts file **in-memory**.
* @method get
* @param {String} [ip] IP address of entry to return entry.
* @param {RegExp|String} [pattern] RegExp pattern to match hostname to return entry.
* @return {Array<Object>}
*/
hosts.get = (ip, pattern) => {
  if (ip && 'string' === typeof(ip)) {
    if (pattern && pattern instanceof RegExp) {
      return load().filter(x => x.ip === ip && pattern.test(x.hostname));
    } else {
      return load().filter(x => x.ip === ip);
    }
  } else {
    return load().map(x => x.ip);
  }
}