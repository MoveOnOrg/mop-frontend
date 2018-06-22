import requireHacker from 'require-hacker'
import enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

enzyme.configure({ adapter: new Adapter() })

// Replace svgs with empty react components
requireHacker.hook('svg', () => 'module.exports = () => null')

// Pass pretendToBeVisual so react has access to requestAnimationFrame
require('jsdom-global')(undefined, { pretendToBeVisual: true })
