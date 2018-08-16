import Config from '../config'

/**
 * A FormTracker instance gives the ability to keep analytics data for forms all in
 * the same place, and provides methods for manipulating this analytics data (stored as
 * internal state) as well as tracking this data to an analytics provider.
 *
 * Regenerate the markdown file for these docs with:
 * `npx jsdoc-to-markdown src/lib/form-tracker.js > docs/EXPLANATION--form-tracking.md`
 * (only edit these docs in form-tracker.js)
 * @param {object} [params] - an object of params (see below)
 * @param {string} [params.formvariant] - e.g. 'mobile' or 'desktop'
 * @param {string} [params.experiment] - name of the experiment being run
 * @param {string} [params.variationname] - the experiment group the user is in
 */
export function FormTracker({ experiment = '', formvariant = '', variationname = '' } = {}) {
  this.options = {
    formStarted: 0,
    formSubmitted: 0,
    eventInfo: {}
  }

  this.state = {
    result: '', // either started, completed or dropoff
    variationname, // variation name is a description identifier and should be 'current' if it's the baseline
    formvariant, // is for example whether the mobile or desktop is displayed
    experiment, // meant to define the specific experiment by name e.g. 'signMobilePhones1'
    loginstate: 0, // 0 is not logged in, 1 is guest login and 2 is an authenticated user
    validationerror: 0, // count of the number of fields that a validation error occurs before submission
    formexpand: 0, // number of times additional pieces of the form are displayed to the user
    sectionadvanced: 0, // maximum form section user gets to (normally for a multi step form)
    fieldfocused: -1, // maximum field index besides the submit button that receives focus
    fieldchanged: -1, // maximum field index that has a non default value,
    lastfieldchanged: '',
    lastfieldfocused: ''
  }

  /**
   * Should be called when the form is submitted to the server.
   * Will send the current analytics data to segment.
   * @param {object} [eventInfo] - an object of additional state updates
   */
  this.submitForm = function submitForm(eventInfo = {}) {
    this.state.result = 'completed'
    Object.keys(eventInfo).forEach(key => {
      this.state[key] = eventInfo[key]
    })
    this.track('form_finished')
  }

  /**
   * Should be called when a partially hidden form is expanded
   */
  this.formExpandTracker = function formExpandTracker() {
    this.state.formexpand += 1
  }

  /**
   * Should be called when the next section of multipart form is shown
   */
  this.formAdvanceTracker = function formAdvanceTracker() {
    this.state.sectionadvanced += 1
  }

  this.loginState = function loginState(userInfo) {
    if (userInfo.anonymous) {
      this.state.loginstate = 0
    }

    if (!userInfo.anonymous && !userInfo.signonId) {
      this.state.loginstate = 1
    }

    if (!userInfo.anonymous && userInfo.signonId) {
      this.state.loginstate = 2
    }
  }

  this.isVisible = ref => (!!(ref.offsetWidth || ref.offsetHeight || ref.getClientRects().length))

  /**
   * Saves a reference to the form (required for updateFormProgress()), saves the formLength and formvariant.
   * Calls startForm, which sends the current analytics data to segment
   * @param {HTMLElement} ref - a reference to the actual form
   * @param {string} [variantname] - the varient name in the experiment, if it isn't ref.id
   */
  this.setForm = function setForm(ref, variantname) {
    if (ref) {
      this.form = ref
      this.state.formLength = ref.elements.length
      this.state.formvariant = variantname || ref.id
      this.startForm()
    }
  }

  this.startForm = function startForm() {
    if (this.options.formStarted === 0) {
      this.state.result = 'started'
      this.track('form_started')
    }
  }

  /**
   * @private
   * Finds the index of the field in the saved form, for use in updateFormProgress()
   * @param {string} fieldName - name of the field
   * @returns {number} index of the specified field, or -1
   */
  this.fieldIndex = function fieldIndex(fieldName) {
    if (this.form) {
      for (let i = 0; i < this.form.elements.length; i += 1) {
        if (this.form.elements[i].name === fieldName) {
          return i
        }
      }
    }
    return -1
  }

  /**
   * Updates the internal form analytics data that will be tracked to segment
   * when submitForm() is called. A good place to call is is onChange and onFocus
   * of the input handlers.
   *
   * Call with eventInfo.fieldchanged when a field is changed or with
   * eventinfo.fieldfocused when a field has been focused.
   *
   * Sets this field as lastfieldchanged and lastfieldfocused
   * Sets fieldchanged/focused as the max of the previous and the specified field's index
   *
   * Will also call startForm() if needed
   * @param {object} eventInfo - any updated tracking data
   * @param {string} [eventInfo.fieldchanged] - the name of the field changed
   * @param {string} [eventInfo.fieldfocused] - the name of the field focused
   */
  this.updateFormProgress = function updateFormProgress(eventInfo) {
    const fieldName = eventInfo.fieldchanged
    this.state.lastfieldchanged = fieldName
    this.state.lastfieldfocused = fieldName

    if (eventInfo.fieldchanged) {
      this.state.fieldchanged = Math.max(this.state.fieldchanged, this.fieldIndex(eventInfo.fieldchanged))
    }

// track field focused
    if (eventInfo.fieldfocused) {
      this.state.fieldfocused = Math.max(this.state.fieldfocused, this.fieldIndex(eventInfo.fieldfocused))
    }

    if (!this.options.formStarted && this.state.formvariant) {
      this.startForm()
    }
  }

  /**
   * Should be called when a form validation error is shown
   */
  this.validationErrorTracker = function validationErrorTracker() {
    this.state.validationerror += 1
  }

  /**
   * Returns the internal state of this FormTracker instance, suitable for
   * saving (e.g. for a multipart form) and reloading with setStateOnce()
   * @returns {object} the internal state
   */
  this.getState = function getState() {
    return this.state
  }

  /**
   * Sets the FormTracker's internal state, (e.g. after resuming a multipart form).
   * you can get this state from getState()
   *
   * Internally remembers the state has been set, so it's safe to call multiple times
   * (e.g. various lifecycle methods), if it is unclear when your data will be loaded (redux)
   * @param {object} state - the internal state to set
   */
  this.setStateOnce = function setStateOnce(state) {
    if (state && !this.options.setStateCalled) {
      this.state = { ...state }
      this.options.setStateCalled = true
    }
  }

  /**
   * @private
   * Tracks the internal state to segment
   * Called by startForm() and submitForm()
   * @param {string} eventName - what type of event this is
   */
  this.track = function track(eventName) {
    this.options.formStarted = 1
    if (window.analytics) {
      window.analytics.track(eventName, { ...this.state })
    }
    if (Config.FAKE_ANALYTICS) {
      console.log(`Tracking event ${eventName} with current state object: ${JSON.stringify(this.state)} `)
      // console.log(`INSERT INTO tracking_test (eventname,${Object.keys(this.state).join(',')}) VALUES ("${eventName}",${Object.values(this.state).map(JSON.stringify).join(',')})`)
    }
  }
}
