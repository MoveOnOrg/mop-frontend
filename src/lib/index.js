import React from 'react' // needed to get JSX in scope for text2paraJsx
import Config from '../config'

export { getStateFullName, getRegions, armedForcesRegions } from './state-abbrev'
export { countries } from './countries'
export { FormTracker } from './form-tracker'
export { CohortTracker } from './cohort-tracker'

export const formatDate = date => {
  const monthAbbr = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  const day = date.getDate()
  const monthIndex = date.getMonth()
  const year = date.getFullYear()
  return `${monthAbbr[monthIndex]} ${day}, ${year}`
}

export const text2paras = str => str.split(/\n+/)

export const ellipsize = (str, length) => {
  const re = new RegExp(`^(.{0,${length}})(\\s|$)`)
  const match = String(str).substr(0, length + 1).match(re)
  if (!match) {
    // Just in case some weirdo puts 500 characters without a space at the beginning of a petition summary
    return String(str).substr(0, length)
  }
  if (match[2].length) {
    // We matched a space instead of the end of string so add ...
    return `${match[1]}...`
  }
  return match[1]
}

export const text2paraJsx = str => {
  const paras = text2paras(str)
  return paras.map((paragraph, i) => {
    const paragraphKey = `p${i}`
    return (
      <p key={paragraphKey}>{paragraph}</p>
    )
  })
}

// Helps the css work properly
export const splitIntoSpansJsx = str => (
  str
    .match(/[\S]+/gi)
    .map((word, i) => <span key={i}>{word}</span>) // eslint-disable-line react/no-array-index-key
)

export const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()

export const parseServerErrors = errors => Object.keys(errors).map(key => {
  let fieldName = key
  if (fieldName === '__all__') fieldName = 'error'
  return {
    message: `${capitalizeFirstLetter(fieldName)}: ${capitalizeFirstLetter(errors[key][0])}`
  }
})

export const moNumber2base62 = num => {
  // This converts a number to base62, and will be used to generate petition redirect urls
  // example: 125962 => 'pju'
  // See petitionShortCode() below
  const base62 = 'BCDFoHJKLMNPQRSTVWXYZAEIOU012345p789aeiGubcdfghjklzn6qrstvwxym'
  const char62s = []
  let numLeft = num
  let tooMany = 13
  while (numLeft > 0 && tooMany > 0) {
    char62s.push(base62[numLeft % 62])
    numLeft = parseInt(numLeft / 62, 10)
    tooMany -= 1
  }
  return char62s.reverse().join('')
}

export const md5ToToken = responseMd5 => (
  moNumber2base62(parseInt(responseMd5.slice(0, 12), 16))
)

export const petitionShortCode = (mode, petitionId, userId, responseMd5) => {
  // Returns a url that will redirect to the petition that
  // tracks the userId of the sharer along with the mode of sharing (e.g. twitter/email)
  // mirrors server-part petitions/petition_shortcode.py
  const codeParts = [((userId) ? mode : mode.toUpperCase())]
  const petitionCode = moNumber2base62(parseInt(petitionId, 10))
  codeParts.push(petitionCode)
  let ident = userId
  if (!userId) {
    if (responseMd5) {
      // This takes the first 12 chars of the md5 body, parses it from the hex,
      // and then, even as a really big number, we'll crush it into our base62
      // the server saves this token in signing, so we can match them up
      // later.  Note that we are in a 16^12 number space, so we have a LOT
      // of room even with millions of signatures to make a collision unlikely.
      ident = parseInt(responseMd5.slice(0, 12), 16)
    }
  }
  if (ident) {
    codeParts.push(moNumber2base62(parseInt(ident, 10)))
  }
  const shortCode = codeParts.join('_')
  return `${Config.BASE_URL}/p/${shortCode}`
}

// isValidEmail is ripped off from Django
// https://github.com/django/django/blob/2.0.4/django/core/validators.py#L164
// Two differences: 1. accepting \w unicode for user-portion 2. not accepting ipv6 domain addresses

// IE-crap hack:
let supportsUnicode = true
try { RegExp('\\w', 'iu') } catch (err) { supportsUnicode = false }

const userRegex = RegExp('^[-!#$%&\'*+/=?^_`{}|~\\w]+(\\.[-!#$%&\'*+/=?^_`{}|~\\w]+)*$', supportsUnicode ? 'iu' : 'i')
const quotedUserRegex = /^"([\001-\010\013\014\016-\037!#-[\]-\177]|\\[\001-\011\013\014\016-\177])*"$/i
const domainRegex = /^((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+)(?:[A-Z0-9-]{1,62}[A-Z0-9])$/i
const commonDomains = ['aol.com', 'comcast.net', 'gmail.com', 'hotmail.com',
                       'icloud.com', 'outlook.com', 'verizon.net', 'yahoo.com']

export const isValidEmail = email => {
  if (!email) { return false }
  const parts = email.split('@')
  if (parts.length !== 2) { return false }
  const domain = parts[1].toLowerCase()
  if (!((userRegex.test(parts[0]) || quotedUserRegex.test(parts[0]))
        && domainRegex.test(domain))) {
    return false
  }
  const rv = { validEmail: true }
  // A poor-man's rubric for seeing if the domain is close to common domains:
  // The length has to be equal or off-by-1
  // and 80% of the commonDomain's letters must be in the domain
  if (commonDomains.indexOf(domain) === -1) {
    commonDomains.forEach(commonD => {
      if (!rv.warning && Math.abs(commonD.length - domain.length) < 2) {
        const simLetters = commonD.split('')
          .reduce((acc, curr) => (acc + (domain.indexOf(curr) > -1 ? 1 : 0)), 0)
        if (simLetters / commonD.length > 0.8) {
          rv.warning = `Did you mean ${commonD}?`
        }
      }
    })
  }
  return rv
}

export const formatNumber = number =>
  String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const percent = (numerator, denominator) => {
  if (denominator <= 0) {
    return '0%'
  }

  const v = Math.min(1, numerator / denominator) * 100
  return `${v.toFixed(2)}%`
}

export const stringifyParams = obj =>
  Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')

export const getPageLoadTime = () => {
  if (
    window &&
    window.performance &&
    window.performance.timing &&
    window.performance.timing.loadEventEnd &&
    window.performance.timing.fetchStart
  ) {
    return (
      window.performance.timing.loadEventEnd -
      window.performance.timing.fetchStart
    )
  }
  return null
}

export const scrollToTop = () => window && window.scrollTo(0, 0)

export const rejectNetworkErrorsAs500 = () => Promise.reject({ response_code: 500 })

export const parseAPIResponse = response =>
  new Promise(resolve => resolve(response.text())).then(responseBody => {
    try {
      const parsedJSON = JSON.parse(responseBody)
      if (response.ok) return parsedJSON
      if (!parsedJSON.response_code) {
        throw Error('Response contains no response code')
      }
      return Promise.reject(parsedJSON)
    } catch (error) {
      // The response contains invalid JSON or no response code
      return Promise.reject({
        response_code: 500,
        error
      })
    }
  })

export const parseSQSApiResponse = response =>
  new Promise(resolve => resolve(response.text())).then(responseBody => {
    try {
      const parsedJSON = JSON.parse(responseBody)
      if (response.ok && !parsedJSON.Error) return parsedJSON
      return Promise.reject({
        response_code: 500,
        error: parsedJSON
      })
    } catch (error) {
      // The response contains invalid JSON or no response code
      return Promise.reject({
        response_code: 500,
        error
      })
    }
  })

export const byIdAndName = p => ({ [p.petition_id]: p, [p.name]: p })

export const addBrandedColorClass = (shareType, cohort) => (cohort ? `${shareType}-branded` : '')
