Variable                          | Purpose
----------------------------------|----------------------------------
API_URI                           | Base URI for API, without trailing slash, e.g. "http://0.0.0.0:8000" or "http://example.com/api/v1". _Required_.
API_WRITABLE                      | When true, server actions to submit new data (like petition signing/creating) will be sent to the server. _Default_: same value as `PROD`.
APP_ENTRY                         | For WebPack build, file name for app. _Default_: "main".
API_SIGN_PETITION                 | Full url endpoint to send submitted signatures to.  Without this, it will default to `${API_URI}/signatures`
WORDPRESS_API_URI                 | Base URI for the wordpress API, to fetch content for static pages. _Required in prod_. _Dev default_:"/local/api"
BASE_APP_PATH                     | If the app is being served from a path other than the domain root, set this to that path. _Default_: "/".
GTAG_PETITION_CREATE              | The `send_to` param for tracking petition create conversions for Google
ONLY_PROD_ROUTES                  | Only render production-ready routes (marked `prodReady`) and redirect all other paths to petitions.moveon.org
PROD                              | Boolean value indicating whether site should act as a production environment. _Options_: 0, 1. _Default_: "".
PUBLIC_ROOT                       | For WebPack dev server, the directory relative to server root where files are found. _Default_: "/".
SESSION_COOKIE_NAME               | When this cookie is present, user session data will be loaded from `API_URI`'s base. _Default_: "SO_SESSION".
STATIC_ROOT                       | For WebPack dev server, the relative path from initial page load to JS and other static assets. _Default_: "".
TRACK_SHARE_URL                   | A url endpoint that share events (e.g. from thanks page) should be sent to with details about the shared page.  (see `src/actions/petitionActions.js`). _Default_: "" (none).
THEME                             | Controls whether `import A from "Theme/a"` comes from the "theme-giraffe" or "theme-legacy" components. ("giraffe" or "legacy") _Default_: "legacy"
USE_HASH_BROWSING                 | Whether you want to use react-router HashHistory _Default_: false
LOCAL_REACT                       | Dev only: a path with react.js and react-dom.js, if you want to develop offline _Default_: Loads react from unpkg.com CDN
LOCAL_CSS                         | Dev only: a theme-giraffe style.css. E.g. `http://localhost:3000/styles/main.css`, as served by `gulp watch` in the giraffe repo, so you can change css and/or develop offline. _Default_: Loads css from the mop-static-stage s3 bucket
AB_TEST_ENABLED                   | When set to an integer, enables AB test
FAKE_ANALYTICS                    | Dev only: set to true if window.analytics isnt exposed from backend server
MOBILE_API_KEY                    | Authorization Key that allows requests to the Revere mobile API
MOBILE_FLOW_ID                    | Hash for the Revere flow triggered when a user is signed up for SMS
