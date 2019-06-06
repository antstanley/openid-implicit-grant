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

## Example

Configure your OpenID Connect provider (Auth0, Okta, AWS Cognito, Azure Active Directory, etc) as per the relevant instructions for Implicit Grant. Set the `redirect_uri` to `http://localhost:1234/callback.html` in the OpenID Connect provider setup.

Then create the following pages. 

### Login page

#### login.html

```html
<!DOCTYPE html>
<html lang="en">
    <title></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/tachyons/css/tachyons.min.css">
    <body>
        <div class="w-100 vh-100 dt v-mid">
            <div class="dtc v-mid tc">
                <input id="login_button" type="button" value="Login" class="pointer grow ph4 pv3 no-underline ba br2 b--transparent bg-navy white f4 avenir">
            </div>
        </div>
    </body>
    <script src="login.js" type="module"></script>
</html>
```

#### login.js

Update `options` object in the JS below with the details from your OpenID connect provider

```js
import { genURL } from 'openid-implicit-grant'

const options = {
    domain: '* Domain name for your OIDC tenant, without http:// or /authorize *',
    client_id: '* OIDC Client Id *',
    redirect_uri: 'http://localhost:1234/callback.html',
    response_type: 'id_token',
    scope: 'openid profile'
}

const loginButton = document.getElementById('login_button')
loginButton.addEventListener('click', authRedirect)

function authRedirect () {
  const reqString = genURL(options)
  location.href = reqString
}
```

### Callback page

This is the page that your OIDC provider will redirect to.

#### callback.html

```html
<!DOCTYPE html>
<html lang="en">
    <title></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/tachyons/css/tachyons.min.css">
    <body>
        <div class="w-100 vh-100 dt v-mid">
            <div class="dtc v-mid tc">
                <span id="login_status" class="gray f3 code"></span>
            </div>
        </div>
    </body>
    <script src="callback.js" type="module"></script>
</html>
```

#### callback.js

```js
import { login } from 'openid-implicit-grant'

const returnHash = window.location.href.split('#')[1] || ''

const { idToken, claims } = login(returnHash)
const loginStatus = document.getElementById('login_status')

if (returnHash) {
  if (idToken) {
    loginStatus.innerHTML = `Successful login for ${claims.preferred_username}`
    console.log(claims) //write the claims to the console to show contents
  } else {
    loginStatus.innerHTML = 'Failed login'
  }
} else {
  loginStatus.innerHTML = 'No access token provided. Unable to log you in.'
}
```

### Dev Server

We're going to use [*parcel*](https://parceljs.org) for a local dev server, as it will bundle the `openid-implicit-grant` package for us. You can obviously use *Webpack* or *Rollup* for bundling.

Install *parcel* as per the instructions, then run the following command

If parcel is installed globally

```sh
parcel *.html
```

If parcel is installed locally

```sh
npx parcel *.html
```

This should bundle the html pages with the javascript and start a dev server at `http://localhost:1234`. Go to `http://localhost:1234/login.html` to get the login page. Clicking the `Login` button with start the OIDC Implicit Grant flow.

Once logged in, you can check the `localStorage` to see that `id_token` has been written there, for future use by your application.

This is a basic JS based example. The library is lightweight and can be used in any popular framework easily.
