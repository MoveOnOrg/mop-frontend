
export const navOrg = (state, org) => state.nav && state.nav.orgs && state.nav.orgs[org]
export const cobrand = (state) => state.nav.partnerCobrand
export const orgCobrand = (state, org) =>
  (org ? navOrg(state, org) : cobrand(state))

