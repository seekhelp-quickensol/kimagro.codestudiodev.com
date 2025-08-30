<p align="center">
  <a href="#" target="_blank">
    <img src="./assets/logo.png" alt="Heroicons" width="200">
  </a>
</p>

<p align="center">
  React client for custom OAuth2 implementations using <a href="https://spring.io/projects/spring-authorization-server">spring-security-oauth2-authorization-server.</a>
<p>

<p align="center">
    <a href="#">
        <img src="https://img.shields.io/npm/dm/@authguard/react" alt="Downloads" />
      </a>
      <a href="#">
        <img src="https://img.shields.io/github/stars/emiz98/authguard-client" alt="Github Stars" />
      </a>
    <a href="https://github.com/emiz98/authguard-client/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/heroicons.svg" alt="License"></a>
</p>

## Installation

First, install `@authguard/react` from npm:

```sh
npm install @authguard/react
```

```sh
yarn add @authguard/react
```

Now create a file authguard.ts in root directory:

```js
import { initializeAuthguard, Provider } from "@authguard/react";

export const authguardConfig = {
  // Props
};

initializeAuthguard(authguardConfig);
export default Provider;
```

Below are the available props with their datatypes.

| Props             |               Type               |            |
| :---------------- | :------------------------------: | ---------: |
| oidc_url          |              String              | _optional_ |
| jwks_url          |              String              | _optional_ |
| token_url         |              String              | _optional_ |
| redirect_url      |              String              | _optional_ |
| authorize_url     |              String              | _optional_ |
| user_info_url     |              String              | _optional_ |
| refresh_token_url |              String              | _optional_ |
| revoke_token_url  |              String              | _optional_ |
| grant             |              String              | _optional_ |
| scope             |              String              | _optional_ |
| credentials       | Object (client_id,client_secret) | _optional_ |

## Usage

To be able to use useAuthguard first you'll need to expose the authguard context, <AuthguardProvider />, at the top level of your application:

### React

```js
<React.StrictMode>
  <AuthguardProvider>
    <App />
  </AuthguardProvider>
</React.StrictMode>
```

### Next JS

```js
<AuthguardProvider>
  <Component {...pageProps} />
</AuthguardProvider>
```

### Hook

The useAuthguard() React Hook in the client is the easiest way to check if someone is signed in.

```js
import { useAuthguard } from "@authguard/react";
const { user, logout } = useAuthguard();
```

### References

Follow links are some reference projects that have already setup authguard.

[Authguard with React Application &rarr;](https://github.com/emiz98/authguard-react-boilerplate)<br/>
[Authguard with Next JS Application &rarr;](https://github.com/emiz98/authguard-nextjs-boilerplate)

## License

This software is released under the MIT license. See LICENSE for more details.
