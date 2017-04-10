import React from 'react';
import {connect} from 'react-redux';

import {actions as petitionDispatchMapper} from '../actions/petitionActions.js';

class SignatureAddForm extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      'name': false,
      'email': false,
      'country': 'United States',
      'address1': false,
      'address2': false,
      'city': false,
      'state': false,
      'region': false,
      'zip': false,
      'postal': false,
      'comment': false
    };
    this.required = {
      'name': 'Name is required.',
      'email': 'Email address is required.',
      'state': 'State is required.',
      'zip': 'Zip code is required.'
    };
    this.submit = this.submit.bind(this);
  }

  validationError (key) {
    if (Object.keys(this.required).indexOf(key) > -1) {
      if (this.state[key] != null && this.state[key].length === 0) {
        return (
          <div className="alert alert-danger" role="alert">{ this.required[key] }</div>
        );
      }
    }
    return null;
  }

  formIsValid () {
    return Object.keys(this.required).map(key => this.state[key] != null && this.state[key].length > 0).reduce((a, b) => a && b);
  }

  updateStateFromValue (field) {
    return (event) => {
      this.setState({[field]: event.target.value});
    };
  }

  submit(event) {
      if (this.formIsValid()) {
        var odsiSignature = {
          'person': {
            'origin_system': 'petitions.moveon.org',
            'full_name': this.state.name,
            'email_addresses': [
              {
                'address': this.state.email
              }
            ],
            'postal_addresses': [
              {
                'address_lines': [
                  this.state.address1,
                  this.state.address2
                ],
                'locality': this.state.city,
                'region': (this.state.country === 'United States') ? this.state.state : this.state.region,
                'postal_code': (this.state.country === 'United States') ? this.state.zip : this.state.postal,
                'country_name': this.state.country
              }
            ]
          },
          'comments': this.state.comment
        };
        console.log('odsiSignature in addform submit()', odsiSignature);
        this.props.actions.signPetition(odsiSignature, this.props.petition);
      }
      event.preventDefault();
    return false;
  }

  renderStateOrRegion () {
    if (this.state.country === 'United States') {
      return (
        <div className="form-group state moveon-track-click">
          <label htmlFor="state_id">State<span className="ak-required-flag">*</span></label>
          <select name="state" id="state_id" value={ this.state.state } onChange={ this.updateStateFromValue('state') }>
            <option value="">State*</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AS">American Samoa</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">District Of Columbia</option>
            <option value="FL">Florida</option>
            <option value="FM">Federated States of Micronesia</option>
            <option value="GA">Georgia</option>
            <option value="GU">Guam</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MH">Marshall Islands</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="MP">Northern Mariana Islands</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PW">Palau</option>
            <option value="PA">Pennsylvania</option>
            <option value="PR">Puerto Rico</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="VI">U.S. Virgin Islands</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
            <option value="AE">Armed Forces Africa</option>
            <option value="AA">Armed Forces America</option>
            <option value="AE">Armed Forces Canada</option>
            <option value="AE">Armed Forces Europe</option>
            <option value="AE">Armed Forces Middle East</option>
            <option value="AP">Armed Forces Pacific</option>
          </select>
          { this.validationError('state') }
        </div>
      );
    } else {
      return (
        <div className="form-group region moveon-track-click">
          <label htmlFor="region">Region</label>
          <input type="text" name="region" id="region" onChange={ this.updateStateFromValue('region') } onBlur={ this.updateStateFromValue('region') } />
        </div>
      );
    }
  }

  renderZipOrPostal () {
    if (this.state.country === 'United States') {
      return (
        <div className="form-group zip moveon-track-click">
          <label htmlFor="zip">Zip Code<span className="ak-required-flag">*</span></label>
          <input type="text" name="zip" id="zip" onChange={ this.updateStateFromValue('zip') } onBlur={ this.updateStateFromValue('zip') } />
          { this.validationError('zip') }
        </div>
      );
    } else {
      return (
        <div className="form-group postal moveon-track-click">
          <label htmlFor="postal">Postal</label>
          <input type="text" name="postal" id="postal" onChange={ this.updateStateFromValue('postal') } onBlur={ this.updateStateFromValue('postal') } />
        </div>
      );
    }
  }

  render () {
    return (
      <div className="span4 widget clearfix" id="sign-here">
        <div className="petition-top visible-phone">
          <h1 id="petition-title" className="moveon-bright-red">{this.props.petition.title}</h1>
          <div id="pet-statement-box" className="blockquote petition-statement">
            <div id="pet-statement">{this.props.text2paras(this.props.petition.summary).map(
              (paragraph, i) =>
              <p key="para{i}">{paragraph}</p>
            )}</div>
          </div>
        </div>
        <div className="form-wrapper form-container" id="sign-form" data-viewable="true">
          <div className="form-section">
            <div className="widget-top">
              <h3>Sign this petition</h3>
            </div>
            <form name="sign_form" id="sign" method="post" action="." onSubmit={this.submit}>
              <input type="hidden" name="petition_id" value="" />
              <input type="hidden" name="source" value="none" />
              <input type="hidden" name="r_by" value="" />
              <input type="hidden" name="mailing_id" value="" />
              <input type="hidden" name="fb_test" value="0" />
              <input type="hidden" name="test_group" value="" />
              <input type="hidden" name="no_mo" value="0" />
              <input type="hidden" name="id" value="" />
              <input type="hidden" name="akid" value="" />
              <input type="hidden" name="recognized_user" id="recognized_user_field" value="0" />
              <input type="hidden" name="show_optin_checkbox" value="0" />
              <div className="unrecognized">
                <div className="form-group">
                  <label htmlFor="name">Name<span className="ak-required-flag">*</span></label>
                  <input type="text" name="name" id="name" className="moveon-track-click" onChange={ this.updateStateFromValue('name') } onBlur={ this.updateStateFromValue('name') } />
                  { this.validationError('name') }
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email<span className="ak-required-flag">*</span></label>
                  <input type="text" name="email" id="email" className="moveon-track-click" onChange={ this.updateStateFromValue('email') } onBlur={ this.updateStateFromValue('email') } />
                  { this.validationError('email') }
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select name="country" id="country" className='country_select moveon-track-click' value={ this.state.country } onChange={ (event) =>
                    this.setState({'country': event.target.value}) }>
                    <option>United States</option>
                    <option>Afghanistan</option>
                    <option>Albania</option>
                    <option>Algeria</option>
                    <option>American Samoa</option>
                    <option>Andorra</option>
                    <option>Angola</option>
                    <option>Anguilla</option>
                    <option>Antigua and Barbuda</option>
                    <option>Argentina</option>
                    <option>Armenia</option>
                    <option>Aruba</option>
                    <option>Australia</option>
                    <option>Austria</option>
                    <option>Azerbaijan</option>
                    <option>Bahamas</option>
                    <option>Bahrain</option>
                    <option>Bangladesh</option>
                    <option>Barbados</option>
                    <option>Belarus</option>
                    <option>Belgium</option>
                    <option>Belize</option>
                    <option>Benin</option>
                    <option>Bermuda</option>
                    <option>Bhutan</option>
                    <option>Bolivia</option>
                    <option>Bosnia and Herzegovina</option>
                    <option>Botswana</option>
                    <option>Brazil</option>
                    <option>British Virgin Islands</option>
                    <option>Brunei</option>
                    <option>Bulgaria</option>
                    <option>Burkina Faso</option>
                    <option>Burundi</option>
                    <option>Cambodia</option>
                    <option>Cameroon</option>
                    <option>Canada</option>
                    <option>Cape Verde</option>
                    <option>Cayman Islands</option>
                    <option>Central African Republic</option>
                    <option>Chad</option>
                    <option>Chile</option>
                    <option>China</option>
                    <option>Colombia</option>
                    <option>Comoros</option>
                    <option>Congo, DPR</option>
                    <option>Congo, PR</option>
                    <option>Cook Islands</option>
                    <option>Costa Rica</option>
                    <option>C&ocirc;te d&#8217;Ivoire</option>
                    <option>Croatia</option>
                    <option>Cuba</option>
                    <option>Cyprus</option>
                    <option>Czech Republic</option>
                    <option>Denmark</option>
                    <option>Djibouti</option>
                    <option>Dominica</option>
                    <option>Dominican Republic</option>
                    <option>East Timor</option>
                    <option>Ecuador</option>
                    <option>Egypt</option>
                    <option>El Salvador</option>
                    <option>Equatorial Guinea</option>
                    <option>Eritrea</option>
                    <option>Estonia</option>
                    <option>Ethiopia</option>
                    <option>Falkland Islands</option>
                    <option>Faroe Islands</option>
                    <option>Fiji</option>
                    <option>Finland</option>
                    <option>France</option>
                    <option>French Guiana</option>
                    <option>French Polynesia</option>
                    <option>Gabon</option>
                    <option>Gambia</option>
                    <option>Georgia</option>
                    <option>Germany</option>
                    <option>Ghana</option>
                    <option>Gibraltar</option>
                    <option>Greece</option>
                    <option>Greenland</option>
                    <option>Grenada</option>
                    <option>Guadeloupe</option>
                    <option>Guam</option>
                    <option>Guatemala</option>
                    <option>Guinea</option>
                    <option>Guinea-Bissau</option>
                    <option>Guyana</option>
                    <option>Haiti</option>
                    <option>Honduras</option>
                    <option>Hong Kong</option>
                    <option>Hungary</option>
                    <option>Iceland</option>
                    <option>India</option>
                    <option>Indonesia</option>
                    <option>Iran</option>
                    <option>Iraq</option>
                    <option>Ireland</option>
                    <option>Israel</option>
                    <option>Italy</option>
                    <option>Jamaica</option>
                    <option>Japan</option>
                    <option>Jordan</option>
                    <option>Kazakhstan</option>
                    <option>Kenya</option>
                    <option>Kiribati</option>
                    <option>Kosovo</option>
                    <option>Kuwait</option>
                    <option>Kyrgistan</option>
                    <option>Laos</option>
                    <option>Latvia</option>
                    <option>Lebanon</option>
                    <option>Lesotho</option>
                    <option>Liberia</option>
                    <option>Libya</option>
                    <option>Liechtenstein</option>
                    <option>Lithuania</option>
                    <option>Luxembourg</option>
                    <option>Macau</option>
                    <option>Macedonia</option>
                    <option>Madagascar</option>
                    <option>Malawi</option>
                    <option>Malaysia</option>
                    <option>Maldives</option>
                    <option>Mali</option>
                    <option>Malta</option>
                    <option>Marshall Islands</option>
                    <option>Martinique</option>
                    <option>Mauritania</option>
                    <option>Mauritius</option>
                    <option>Mexico</option>
                    <option>Micronesia</option>
                    <option>Moldova</option>
                    <option>Monaco</option>
                    <option>Mongolia</option>
                    <option>Montenegro</option>
                    <option>Montserrat</option>
                    <option>Morocco</option>
                    <option>Mozambique</option>
                    <option>Myanmar</option>
                    <option>Namibia</option>
                    <option>Nauru</option>
                    <option>Nepal</option>
                    <option>Netherlands</option>
                    <option>Netherlands Antilles</option>
                    <option>New Caledonia</option>
                    <option>New Zealand</option>
                    <option>Nicaragua</option>
                    <option>Niger</option>
                    <option>Nigeria</option>
                    <option>North Korea</option>
                    <option>Northern Mariana Islands</option>
                    <option>Norway</option>
                    <option>Oman</option>
                    <option>Pakistan</option>
                    <option>Palau</option>
                    <option>Palestine</option>
                    <option>Panama</option>
                    <option>Papua New Guinea</option>
                    <option>Paraguay</option>
                    <option>Peru</option>
                    <option>Philippines</option>
                    <option>Poland</option>
                    <option>Portugal</option>
                    <option>Puerto Rico</option>
                    <option>Qatar</option>
                    <option>Reunion</option>
                    <option>Romania</option>
                    <option>Russia</option>
                    <option>Rwanda</option>
                    <option>Samoa</option>
                    <option>San Marino</option>
                    <option>S&atilde;o Tom&eacute; and Principe</option>
                    <option>Saudi Arabia</option>
                    <option>Senegal</option>
                    <option>Serbia</option>
                    <option>Seychelles</option>
                    <option>Sierra Leone</option>
                    <option>Singapore</option>
                    <option>Slovakia</option>
                    <option>Slovenia</option>
                    <option>Solomon Islands</option>
                    <option>Somalia</option>
                    <option>South Africa</option>
                    <option>South Korea</option>
                    <option>Spain</option>
                    <option>Sri Lanka</option>
                    <option>St. Helena</option>
                    <option>St. Kitts-Nevis</option>
                    <option>St. Lucia</option>
                    <option>St. Pierre and Miquelon</option>
                    <option>St. Vincent and the Grenadines</option>
                    <option>Sudan</option>
                    <option>Suriname</option>
                    <option>Swaziland</option>
                    <option>Sweden</option>
                    <option>Switzerland</option>
                    <option>Syria</option>
                    <option>Taiwan</option>
                    <option>Tajikistan</option>
                    <option>Tanzania</option>
                    <option>Thailand</option>
                    <option>Togo</option>
                    <option>Tonga</option>
                    <option>Trinidad and Tobago</option>
                    <option>Tunisia</option>
                    <option>Turkey</option>
                    <option>Turkmenistan</option>
                    <option>Turks and Caicos Islands</option>
                    <option>Tuvalu</option>
                    <option>Uganda</option>
                    <option>Ukraine</option>
                    <option>United Arab Emirates</option>
                    <option>United Kingdom</option>
                    <option>United States</option>
                    <option>Uruguay</option>
                    <option>US Virgin Islands</option>
                    <option>Uzbekistan</option>
                    <option>Vanuatu</option>
                    <option>Vatican</option>
                    <option>Venezuela</option>
                    <option>Vietnam</option>
                    <option>Wallis and Futuna</option>
                    <option>Western Sahara</option>
                    <option>Yemen</option>
                    <option>Zambia</option>
                    <option>Zimbabwe</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="address1">Address</label>
                  <input type="text" name="address1" id="address1" className="moveon-track-click" onChange={ this.updateStateFromValue('address1') } onBlur={ this.updateStateFromValue('address1') } />
                </div>
                <div className="form-group">
                  <label htmlFor="address2">Address (cont.)</label>
                  <input type="text" name="address2" id="address2" className="moveon-track-click" onChange={ this.updateStateFromValue('address2') } onBlur={ this.updateStateFromValue('address2') } />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input type="text" name="city" id="city" className="moveon-track-click" onChange={ this.updateStateFromValue('city') } onBlur={ this.updateStateFromValue('city') }/>
                </div>
                { this.renderStateOrRegion() }
                { this.renderZipOrPostal() }
              </div>
              <div className="form-group">
                <label htmlFor="comment">Comment</label>
                <textarea className="moveon-track-click" rows="3" cols="20" name="comment" id="comment" autoComplete="off" onChange={ this.updateStateFromValue('comment') } onBlur={ this.updateStateFromValue('comment') }></textarea>
              </div>
              <div className="form-group form-group--submit">
                <button type="submit" className="xl percent-100 moveon-track-click background-moveon-bright-red" id="sign-here-button" value="Sign the petition!">Sign the petition</button>
              </div>
              <p className="disclaimer bump-top-1"><b>Note:</b> By signing, you agree to receive email messages from MoveOn.org Civic Action and MoveOn.org Political Action. You may unsubscribe at any time. [ <a href="http://petitions.moveon.org/privacy.html">Privacy policy</a> ]</p>
            </form>
          </div>
        </div>
      </div>
    );
  }

}

SignatureAddForm.propTypes = {
  petition: React.PropTypes.object.isRequired
}

function mapStateToProps (state, ownProps) {
  console.log('signature-add-form.js mapStatetoProps', state);
  return {
  };
}

export default connect(mapStateToProps, petitionDispatchMapper)(SignatureAddForm);
