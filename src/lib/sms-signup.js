import 'whatwg-fetch'
import Config from '../config'

export function smsSignUp(phoneNo) {
  if (Config.AB_TEST_ENABLED && Config.MOBILE_API_KEY) {
    const msisdns = phoneNo
    const mobileFlowId = Config.MOBILE_FLOW_ID
    const mobileApiKey = Config.MOBILE_API_KEY

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: mobileApiKey
      },
      body: JSON.stringify({
        msisdns: [msisdns],
        mobileFlow: `${mobileFlowId}`
      })
    }

    fetch('https://mobile.reverehq.com/api/v1/messaging/sendContent', options)
    .then(response => {
      if (response.status === '201') console.info('user added to sms list')
    }, error => {
      if (error) throw new Error(error)
    })
  }
}
