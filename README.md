# OpenID Connect Implicit Grant Client

3KB client implementing the OpenID Connect Implicit Grant authentication flow with no dependencies.

This was created because a number of other OpenID clients support all the authentication options for OpenID Connect, so you end up shipping all that code with your client. 

This is a basic, small, lightweight client that does the following

- Generates the OpenID authorisation URL, with a nonce and state object that can   be used for implicit grant

- Decodes the returned JWT and writes the claims to localStorage

- Remove the claims from localStorage when logout method is called

The library relies on localStorage for state for the claims, and sessionStorage for temporary state for the nonce and state parameters required in the authorisation URL.

You will need to implement your own state for the OpenID auth options.

Basic usage

```sh
npm install openid-implicit-grant
```

Implicit grant with OpenID Connect requires calling a `/authorize` URL with various options specified.



