<a name="FormTracker"></a>

## FormTracker([params])
A FormTracker instance gives the ability to keep analytics data for forms all in
the same place, and provides methods for manipulating this analytics data (stored as
internal state) as well as tracking this data to an analytics provider.

Regenerate the markdown file for these docs with:
`npx jsdoc-to-markdown src/lib/form-tracker.js > docs/EXPLANATION--form-tracking.md`
(only edit these docs in form-tracker.js)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [params] | <code>object</code> | an object of params (see below) |
| [params.formvariant] | <code>string</code> | e.g. 'mobile' or 'desktop' |
| [params.experiment] | <code>string</code> | name of the experiment being run |
| [params.variationname] | <code>string</code> | the experiment group the user is in |


* [FormTracker([params])](#FormTracker)
    * [.submitForm([eventInfo])](#FormTracker+submitForm)
    * [.formExpandTracker()](#FormTracker+formExpandTracker)
    * [.formAdvanceTracker()](#FormTracker+formAdvanceTracker)
    * [.setForm(ref, [variantname])](#FormTracker+setForm)
    * [.updateFormProgress(eventInfo)](#FormTracker+updateFormProgress)
    * [.validationErrorTracker()](#FormTracker+validationErrorTracker)
    * [.getState()](#FormTracker+getState) ⇒ <code>object</code>
    * [.setStateOnce(state)](#FormTracker+setStateOnce)

<a name="FormTracker+submitForm"></a>

### formTracker.submitForm([eventInfo])
Should be called when the form is submitted to the server.
Will send the current analytics data to segment.

**Kind**: instance method of [<code>FormTracker</code>](#FormTracker)  

| Param | Type | Description |
| --- | --- | --- |
| [eventInfo] | <code>object</code> | an object of additional state updates |

<a name="FormTracker+formExpandTracker"></a>

### formTracker.formExpandTracker()
Should be called when a partially hidden form is expanded

**Kind**: instance method of [<code>FormTracker</code>](#FormTracker)  
<a name="FormTracker+formAdvanceTracker"></a>

### formTracker.formAdvanceTracker()
Should be called when the next section of multipart form is shown

**Kind**: instance method of [<code>FormTracker</code>](#FormTracker)  
<a name="FormTracker+setForm"></a>

### formTracker.setForm(ref, [variantname])
Saves a reference to the form (required for updateFormProgress()), saves the formLength and formvariant.
Calls startForm, which sends the current analytics data to segment

**Kind**: instance method of [<code>FormTracker</code>](#FormTracker)  

| Param | Type | Description |
| --- | --- | --- |
| ref | <code>HTMLElement</code> | a reference to the actual form |
| [variantname] | <code>string</code> | the varient name in the experiment, if it isn't ref.id |

<a name="FormTracker+updateFormProgress"></a>

### formTracker.updateFormProgress(eventInfo)
Updates the internal form analytics data that will be tracked to segment
when submitForm() is called. A good place to call is is onChange and onFocus
of the input handlers.

Call with eventInfo.fieldchanged when a field is changed or with
eventinfo.fieldfocused when a field has been focused.

Sets this field as lastfieldchanged and lastfieldfocused
Sets fieldchanged/focused as the max of the previous and the specified field's index

Will also call startForm() if needed

**Kind**: instance method of [<code>FormTracker</code>](#FormTracker)  

| Param | Type | Description |
| --- | --- | --- |
| eventInfo | <code>object</code> | any updated tracking data |
| [eventInfo.fieldchanged] | <code>string</code> | the name of the field changed |
| [eventInfo.fieldfocused] | <code>string</code> | the name of the field focused |

<a name="FormTracker+validationErrorTracker"></a>

### formTracker.validationErrorTracker()
Should be called when a form validation error is shown

**Kind**: instance method of [<code>FormTracker</code>](#FormTracker)  
<a name="FormTracker+getState"></a>

### formTracker.getState() ⇒ <code>object</code>
Returns the internal state of this FormTracker instance, suitable for
saving (e.g. for a multipart form) and reloading with setStateOnce()

**Kind**: instance method of [<code>FormTracker</code>](#FormTracker)  
**Returns**: <code>object</code> - the internal state  
<a name="FormTracker+setStateOnce"></a>

### formTracker.setStateOnce(state)
Sets the FormTracker's internal state, (e.g. after resuming a multipart form).
you can get this state from getState()

Internally remembers the state has been set, so it's safe to call multiple times
(e.g. various lifecycle methods), if it is unclear when your data will be loaded (redux)

**Kind**: instance method of [<code>FormTracker</code>](#FormTracker)  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>object</code> | the internal state to set |

