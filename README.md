# UI for transliterating MARC records in Melinda [![Build Status](https://travis-ci.org/NatLibFi/marc-merge-ui.svg?branch=master)](https://travis-ci.org/NatLibFi/melinda-cyrillux)
## Building the application

Install all dependencies:
`npm install`

Run build task:
`npm run build`

This will build the application into `build` directory.


## Start the application in production

```
npm install --prod
cd build
node index.js

(Application can be configured using environment variables, like HTTP_PORT=4000 node index.js for alternate port)
```

## Configuration options

Each variable is mandatory unless it has a default value

| Variable name  | Default value  | Description  | Example  |
|---|---|---|---|
| ALEPH_URL  |   | url to aleph  | http://my-aleph-system.tld  |
| ALEPH_INDEX_BASE  | fin01  | aleph base for indices   |   |
| ALEPH_USER_LIBRARY | | aleph base for users | usr00 |
| HTTP_PORT  | 3001  |   |   |
| MELINDA_API_VERSION  | null  |   |   |
| SECRET_ENCRYPTION_KEY  | <random-generated-key>  | Key for encrypting/decrypting sessions |   |
| CORS_WHITELIST | ["http://localhost:3000"] | json array of allowed hosts for CORS, put your frontend domain here. | |

Note on SECRET_ENCRYPTION_KEY:
All sessions will reset when the key changes. If the default value is used, then all sessions will reset every time the app restarts.

SECRET_ENCRYPTION_KEY can be generated with nodejs: 
```
crypto.randomBytes(32).toString('base64')
```

## Start the application in development

`npm run dev`

This will start webpack-dev-server for frontend codebase and nodemon for the backend.

## License and copyright

Copyright (c) 2016-2019 **University Of Helsinki (The National Library Of Finland)**

This project's source code is licensed under the terms of **GNU Affero General Public License Version 3** or any later version.

