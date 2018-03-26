import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import { InputBlock, CountrySelect, StateSelect } from 'GiraffeUI/petition'
import { Button } from 'GiraffeUI/button'

const SignatureAddForm = ({
  submit,
  creator,
  petition,
  user,
  volunteer,
  onClickVolunteer,
  thirdPartyOptin,
  setThirdPartyOptin,
  country,
  onChangeCountry,
  showOptinWarning,
  showOptinCheckbox,
  showAddressFields,
  requireAddressFields,
  onUnrecognize,
  updateStateFromValue,
  getValueFromState: getValue,
  validationError,
  setRef
}) => (
  <form onSubmit={submit} className='sign-form'>
    <h4>SIGN THIS PETITION</h4>
    {user.signonId ? (
      // Recognized
      // TODO: Needs design
      <div>
        <strong>Welcome back {user.given_name}!</strong>
        <div>
          (Not {user.given_name}? <a onClick={onUnrecognize}>Click here.</a>)
        </div>
      </div>
    ) : (
      // Anonymous
      <div>
        <InputBlock
          name='name'
          label='Name*'
          setRef={setRef}
          value={getValue('name')}
          onChange={updateStateFromValue('name')}
        />
        {validationError('name')}
        <InputBlock
          type='email'
          name='email'
          label='Email*'
          value={getValue('email')}
          onChange={updateStateFromValue('email')}
        />
        {validationError('email')}
      </div>
    )}

    {showAddressFields ? (
      <div>
        <CountrySelect
          className='override-collapse'
          value={country}
          onChange={onChangeCountry}
        />
        <InputBlock
          name='address1'
          label={requireAddressFields ? 'Address*' : 'Address'}
          onChange={updateStateFromValue('address1')}
          value={getValue('address1')}
          setRef={setRef}
        />
        {validationError('address1')}
        <InputBlock
          name='address2'
          label='Address (cont.)'
          onChange={updateStateFromValue('address2')}
          value={getValue('address2')}
        />
        <InputBlock
          name='city'
          label={petition.needs_full_addresses ? 'City*' : 'City'}
          onChange={updateStateFromValue('city')}
          value={getValue('city')}
        />
        {validationError('city')}
        {country === 'United States' ? (
          <StateSelect
            value={getValue('state')}
            onChange={updateStateFromValue('state')}
          />
        ) : (
          <InputBlock
            name={'region'}
            label={'Region'}
            onChange={updateStateFromValue('region')}
            value={getValue('region')}
          />
        )}
        {validationError('state')}
        <InputBlock
          name={country === 'United States' ? 'zip' : 'postal'}
          label={country === 'United States' ? 'ZIP Code*' : 'Postal'}
          onChange={
            country === 'United States'
              ? updateStateFromValue('zip')
              : updateStateFromValue('postal')
          }
          value={getValue(country === 'United States' ? 'zip' : 'postal')}
        />
        {validationError('zip')}
      </div>
    ) : (
      ''
    )}
    <InputBlock
      name='comment'
      label='Comment (Optional)'
      value={getValue('comment')}
    >
      <textarea
        rows='10'
        name='comment'
        id='comment'
        autoComplete='off'
        onChange={updateStateFromValue('comment')}
        onBlur={updateStateFromValue('comment')}
        ref={setRef}
      />
    </InputBlock>

    {petition.collect_volunteers && (
      <InputBlock
        name='volunteer'
        type='checkbox'
        label={petition.collect_volunteers}
        onChange={onClickVolunteer}
      />
    )}
    {volunteer && (
      <div>
        <InputBlock
          name='phone'
          label='Phone*'
          onChange={updateStateFromValue('phone')}
          value={getValue('phone')}
          className='override-collapse'
        />
        {validationError('phone')}
      </div>
    )}

    <Button onClick={submit}>SUBMIT</Button>

    {showOptinCheckbox && (
      <InputBlock
        name='thirdparty_optin'
        type='checkbox'
        label={`Receive campaign updates from ${creator.organization || 'this organization'}`}
        onChange={updateStateFromValue('thirdparty_optin')}
      />
    )}

    {showOptinWarning ? (
      <div className='sign-form__agreement'>
        Note: This petition is a project of {creator.organization} and
        MoveOn.org. By signing, you agree to receive email messages from
        {creator.organization}, MoveOn Political Action, and MoveOn Civic
        Action. You may unsubscribe at any time.
      </div>
    ) : (
      <div className='sign-form__agreement'>
        Note: By signing, you agree to receive email messages from MoveOn.org
        Civic Action and MoveOn.org Political Action. You may unsubscribe at any
        time.
      </div>
    )}
    <Link to='/privacy.html' className='sign-form__link'>
      See Privacy Policy >
    </Link>
  </form>
)

SignatureAddForm.propTypes = {
  submit: PropTypes.func,
  petition: PropTypes.object.isRequired,
  user: PropTypes.object,
  query: PropTypes.object,
  showAddressFields: PropTypes.bool,
  requireAddressFields: PropTypes.bool,
  petitionBy: PropTypes.string,
  creator: PropTypes.object,
  onUnrecognize: PropTypes.func,
  showOptinWarning: PropTypes.bool,
  showOptinCheckbox: PropTypes.bool,
  hiddenOptin: PropTypes.bool,
  volunteer: PropTypes.bool,
  onClickVolunteer: PropTypes.func,
  thirdPartyOptin: PropTypes.bool,
  setThirdPartyOptin: PropTypes.func,
  country: PropTypes.string,
  onChangeCountry: PropTypes.func,
  updateStateFromValue: PropTypes.func,
  getValueFromState: PropTypes.func,
  validationError: PropTypes.func,
  setRef: PropTypes.func
}

export default SignatureAddForm
