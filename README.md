# airkv
**AirKV** is a key-value database storage library built on top of Airtable.
> [!CAUTION]
> **Note**: This project was developed in my free time to learn more about creating npm packages. However, Airtable recently introduced a soft limit of 1000 API requests per month for free accounts, which can restrict the package’s functionality for high-demand use cases.
> 
> ![image](https://github.com/user-attachments/assets/b8c1fbb9-b27d-4efa-bde3-55bc2bf89227)


### Version `0.0.1`

## Features

- **Easy Storage**: Store and retrieve key-value pairs in Airtable without needing direct Airtable API calls.
- **Seamless Setup**: Just provide your Airtable token and workspace ID.
- **Automatic Record Handling**: Automatically creates and updates records as needed.

## Installation

Install AirKV using npm:

```bash
npm install airkv
```

## Quick Start
```js
// const {AirKV} = require("airkv");
import {AirKV} from "airkv";

const airkv = new AirKV({
        token : "..." ,
        workspaceId : "...",
        logging : true
    });

(async()=>{
    const base = await airkv.airbase("example");    
    await base.set("key1" , "value1");
    const value = await base.get("key1");
    await base.delete()
})();

```

## Initialization

To start using AirKV, initialize it with your Airtable credentials:

```js
import { AirKV } from 'airkv';

const airkv = new AirKV({
    token: 'airtable_api_token',
    workspaceId: 'workspace_id',
    logging: true // optional, false by default
});
```

## Methods

### `airbase(name)`

Creates or retrieves an `Airbase` instance used to store key-value pairs.

```js
const base = await airkv.airbase('example');
```

---

### `get(key)`

**Description**: Retrieves the value associated with a given key.

```js
const value = await base.get('username');
console.log(value); // value associated with 'username' or `null` if not found
```

---

### `set(key , value)`

**Description**: Stores or updates a key-value pair in the base.

```js
await base.set('username', 'shivzee');
```

---

### `exists(key)`

**Description**: Checks if a given key exists in the base.

```js
const exists = await base.exists('username');
console.log(exists); // true or false
```

---

### `delete(key)`

**Description**: Deletes a key-value pair from the base.

```js
await base.delete('username');
```

---

## Logging

Enable logging by setting the `logging` option to `true` when creating an `AirKV` instance. This will log interactions with the Airtable API for debugging purposes.

## Contributing

Contributions are welcome! Submit a pull request or open an issue for any improvements or bug fixes.

## Open Source Project 
Author : shivzee
<br />
IDE Used : VS Code
<br />
[Buy me a coffee](https://buymeacoffee.com/shivzee)
