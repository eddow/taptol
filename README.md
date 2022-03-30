# Specialists

Speed-code MENV demo SPA

## Scripts

### Installation

```sh
npm i
```

Mongo should be running on localhost. The database used is `mongodb://localhost/specialists` (cf. srv-prod.yaml)

### Building & launching

```sh
npm run build
npm run serve
```

### Server-side debugging

```sh
npm run watch
```

There is a Vs-Code launch configuration that executes the server in debug mode.

### Client-side only debugging

```sh
npm run start
```

Watch the files and starts the server.

## Shortcuts

- Errors are returned to the client instead of being logged
- No paging (small test project - not thousands of user)
- All filtering/ordering are done client-side

## Initial contents

### `src/server/private.ts`

```ts
export let smtp = {
    host: 'smtp.mailtrap.io',
    port: '2525',
    auth: {
        user: 'register',
        pass: 'your own'
    },
    sender: '"no-answer" <no-answer@s.spec>'
};
```
