import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'

import Sparkline from './sparkline'


const PetitionReport = ({ petition, signatureStats }) => (
  <div className='container background-moveon-white bump-top-1'>
    <div className='row'>
      <div className='span8 offset2'>
        <div className='well'>
          <h1>Detailed Report</h1>
          <table className='table'>
            <tr>
              <td className='name'>Petition ID</td>
              <td>{petition.petition_id}</td>
            </tr>
            <tr>
              <td className='name'>Name</td>
              <td>{petition.title}</td>
            </tr>
            <tr>
              <td className='name'>URL</td>
              <td><Link to={`/sign/${petition.name}`} target='_blank'>https://petitions.moveon.org/sign/{petition.name}</Link></td>
            </tr>
          </table>

          <h2>Signers by Source</h2>
          <table className='table'>
            <tr>
              <th></th>
              <th>Signers...</th>
              <th>/Hour</th>
              <th>/Day</th>
              <th>Growth</th>
            </tr>
            <tr>
              <td className='name'>All Sources</td>
              <td><Sparkline data={signatureStats.ever.all} /></td>
              <td><Sparkline data={signatureStats.hourly.all} /></td>
              <td><Sparkline data={signatureStats.daily.all} /></td>
              <td><Sparkline data={signatureStats.growth.all} /></td>
            </tr>
            <tr>
              <td className='name'>Facebook</td>
              <td><Sparkline data={signatureStats.ever.facebook} /></td>
              <td><Sparkline data={signatureStats.hourly.facebook} /></td>
              <td><Sparkline data={signatureStats.daily.facebook} /></td>
              <td><Sparkline data={signatureStats.growth.facebook} /></td>
            </tr>
            <tr>
              <td className='name'>Twitter</td>
              <td><Sparkline data={signatureStats.ever.twitter} /></td>
              <td><Sparkline data={signatureStats.hourly.twitter} /></td>
              <td><Sparkline data={signatureStats.daily.twitter} /></td>
              <td><Sparkline data={signatureStats.growth.twitter} /></td>
            </tr>
            <tr>
              <td className='name'>Email</td>
              <td><Sparkline data={signatureStats.ever.email} /></td>
              <td><Sparkline data={signatureStats.hourly.email} /></td>
              <td><Sparkline data={signatureStats.daily.email} /></td>
              <td><Sparkline data={signatureStats.growth.email} /></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
)

PetitionReport.propTypes = {
  petition: PropTypes.object,
  signatureStats: PropTypes.object
}

export default PetitionReport
