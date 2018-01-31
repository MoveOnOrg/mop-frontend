=Code conventions

== React/Redux standard patterns
 * reducers/index.js should represent (as a pure function) initial and all possible state changes

== Project-particular patterns

 * assuming redux-thunk, no mapPropsToDispatch -- just call `dipatch(actions.foo(data))`
 * `actions/*` is where you call out to get data (async or otherwise)
 * lazy-loading info: (TODO)
 * Even though convention calls redux 'state' 'state' -- we call it `store`, to map better to the redux
   global store object, and distinguish it from component states.  c.f. any component that has a mapStateToProps function
 * Any links to petitions.moveon.org should use react-router's `<Link to= />` regardless of it being in or out of the react app.
   - The `to` must be an absolute path and not relative (i.e. start with a `/`)
   - See src/routes.js for details -- when a route's app is 'production ready', we need to mark it with `prodReady` in the appropriate `<Route />`
