# The Legendary List Site

This is a simple Webapp to collect memes
and other funny things and insiders. The
Framework we are using is
[NextJS](https://nextjs.org), a way to
deliver a React App very efficiently.

## Setup

Add a `config/config.js` file and
fill it like this.

```js
export const databaseConfig = {
  host: 'yourdomain.com',
  user: 'youruser',
  password: 'yourpassword',
  connectionLimit: 5,
  port: 3306, // this is default port
  database: 'yourdatabase',
}
```

Then run
```bash
yarn dev
# or
next dev
```
to check it for working correctly. The
Website runs on
[localhost:3000](http://localhost:3000).

If everything works correctly, run
```bash
yarn build
yarn start
# or
next build
next start
```
to deploy your app. The port can be added
by adding `-p [port]` or just edit the
`start` script in `package.json`.
