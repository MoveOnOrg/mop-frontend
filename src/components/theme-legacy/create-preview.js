import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import RegisterForm from '../../containers/register-form'
import EditUserForm from 'LegacyTheme/edit-user-form'

const getTargets = target => target.map(t => t.label || t.name).join(', ')

export const CreatePreview = ({ petition, user, onSubmit, zip, onChangeZip, formTracker }) => (
  <div className='container background-moveon-white bump-top-1'>
    <div className='container background-moveon-white bump-top-1'>
      <div className='row'>
        <div className='span4 widget clearfix background-moveon-light-gray'>
          <h3 className='widget-top-fancy-gray hidden-phone'>
            Petition Review
          </h3>

          <div
            className='padding-left-15 form-wrapper background-moveon-light-gray padding-bottom-1'
            style={{ paddingRight: '15px' }}
          >
            <div className='visible-phone'>
              <p id='to-target' className='lh-16 margin-0 disclaimer'>
                Petition statement to be delivered to{' '}
                <span id='all-targets'>
                  <strong>{getTargets(petition.target)}</strong>
                </span>:
              </p>

              <h1 id='petition-title' className='moveon-bright-red big-title'>
                {petition.title}
              </h1>
            </div>

            {user && user.authenticated ? (
              <EditUserForm
                user={user}
                handleSubmit={e => {
                  e.preventDefault()
                  onSubmit()
                }}
                zip={zip}
                onChangeZip={onChangeZip}
              />
            ) : (
              <RegisterForm
                successCallback={onSubmit}
                user={user}
                formTracker={formTracker}
                isCreatingPetition
                includeZipAndPhone
                useLaunchButton
                useAlternateFields
              />
            )}

            <div className='bump-top-2 align-center percent-100'>
              <Link to='/create_revise.html' className='size-small'>
                <span className='triangle'>◀</span> Go back and fix something
              </Link>
            </div>

            <p className='bump-top-2 disclaimer align-center'>
              By creating this petition, you agree to the Terms of Service (see
              below) and to receive email messages from MoveOn.org Civic Action
              and MoveOn.org Political Action. (You may unsubscribe at any
              time.)
            </p>
          </div>
        </div>

        <div className='span8 pull-right petition-info-top'>
          <div
            className='percent-95 padding-left-15 form-wrapper responsive background-moveon-light-gray padding-bottom-1 padding-left-2 padding-right-3'
            style={{ marginLeft: '-20px', position: 'relative' }}
          >
            <div className='hidden-phone'>
              <p
                id='to-target'
                className='lh-16 margin-0 padding-top-1 disclaimer'
              >
                Petition statement to be delivered to{' '}
                <span id='all-targets'>
                  <strong>{getTargets(petition.target)}</strong>
                </span>:
              </p>

              <h1 id='petition-title' className='moveon-bright-red big-title'>
                {petition.title}
              </h1>
            </div>

            <div
              id='pet-statement'
              className='lh-36 blockquote padding-bottom-1'
            >
              {petition.summary}
            </div>
          </div>

          <div>
            <div className='widget bump-top-1'>
              <div className='padding-left-30'>
                <div className='widget-top'>
                  <h3 className='moveon-bright-red'>Petition Background</h3>
                </div>
                <p className='lh-30'>{petition.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

CreatePreview.propTypes = {
  petition: PropTypes.object,
  user: PropTypes.object,
  onSubmit: PropTypes.func,
  zip: PropTypes.string,
  onChangeZip: PropTypes.func,
  formTracker: PropTypes.object
}
