import React from 'react'
import { InputBlock } from 'GiraffeUI/petition'
import { Link } from 'react-router'

export default class MobileSubscribe extends React.Component {
  render() {
    return (
      <div className="mobileoptincheckbox">
        <InputBlock
          type='checkbox'
          name='mobilesubscribe_optin'
          label='Receive mobile alerts from MoveOn. Msg & data rates may apply. Text STOP to 668366 to stop receiving messages. Text HELP to 668366 for more information.'
        />
        <Link className="mobileoptinlink" to="https://front.moveon.org/moveon-sms-terms-conditions/" style={{marginLeft:'10%'}}> Terms & Conditions. </Link>
      </div>
    )
  }
}


// TODO
// mobile field - if filled in, show message
// opt in message
// opt in checkbox should be passed into OSDI record