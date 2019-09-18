import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import Aboutusvideo from './Aboutusvideo.jsx';

export default class AboutUs extends React.Component {
  componentDidMount() {
      $('.clickOpenModal').click(function(){
        $('.modalParagraph').addClass('hvr-wobble-horizontal');
    		$('.modalAutorImg').addClass('hvr-wobble-horizontal');
    		$('.modalAuthor-info').addClass('hvr-wobble-horizontal');
    		$('.hvrEffect').addClass('hvr-wobble-horizontal');
      });
  }
  componentWillUnmount() {
    // $("link[href='/css/common.css']").remove();
  }
  render() {
    return (
      <div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 about-Us">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <h1 className="chooseUsHead text-center">
              What is ASSUREID
            </h1>
            <h6 className="chooseUsSubhead text-center">
              We Had A Vision To Revolutionize Verifications
            </h6>
            <div>  
              <span className="lineChooseUs"/>
            </div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div id="about-content">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 aboutTop">
                <div className="aboutContent aboutDiv aboutContentone col-lg-4 col-md-4 col-sm-4 col-xs-12">
                  <div id="about-intro">
                    <div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginBTM">
                        <h4>AssureID Evolution</h4>
                        <p className="aboutP">
                          Assure ID's pioneering team are industry experts, delivering large software based solutions for more than 20 years, while gleaning keen insights into the challenges organizations face during employee onboarding. Typographical mistakes, criminal records, previous experience and educational qualification are a costly and time consuming occurrence, resulting in delays for onboarding right candidates, background search, credit verification, and significant potential for addictions or habitual petty crimes. Our solution was designed to mitigate these challenges. Since our first implementation in 2008, the solution has evolved into a highly cost effective, easy to deploy, ubiquitous product that fits into any corporate or government environment, regardless of existing software. In 2015, AssureID cloud version was tested successfully and a full functional portal was launched in 2017. AssureID provides confirmation that individuals are accurately identified and linked to their correct individual records as they travel throughout their career with updates on addresses stayed, education or certifications, experience, court or crime records etc. For organisations, this seamless process upholds data quality, achieves improved staff productivity, safeguards against frauds, and directs the focus where it is rightfully deserved. 
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="aboutUS-Img col-lg-4 col-md-4 col-sm-4 col-xs-12">
                  <img src="/images/assureid/center_image.jpg" alt="aboutUs"/>
                </div>
                 
                <div className="aboutContent aboutDiv col-lg-4 col-md-4 col-sm-4 col-xs-12">
                 <div id="about-intro">
                    <div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginBTM" >
                        <h4>About AssureID</h4>
                        <p className="aboutP">
                          AssureID is an online employment screening service which provides you with the information necessary for making well-informed recruitment decisions. Gone are the days of sending mails to former employers, chasing responses and deciphering them - a process that could take weeks and miss the very disclosures it set out to find. AssureID offers a convenient and all-encompassing solution to verifying candidates' application forms, enabling you to discover exactly who you are hiring and eliminate any doubts. The risks and costs associated with hiring the wrong candidate, due to insufficient vetting, are significant. Lost productivity, mistakes and further recruitment can rob you of valuable time. AssureID, however, can authenticate the information provided by candidates to ensure their effectiveness as an employee and mitigate risks. AssureID supports your HR policies, promotes consistency across the recruitment process and is fully auditable; enabling you to meet legal obligations as both recruiter and employer. The results are delivered online - securely and quickly - ensuring that you can recruit the right person for the job.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="aboutContent aboutDiv col-lg-4 col-md-4 col-sm-4 col-xs-12">
                   <div id="about-intro">
                      <div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginBTM" >
                          <h4>Assurance Accelarated</h4>
                          <p className="aboutP">
                            Assure ID provides a new foundation from which organizations can onboard employees and successfully identify and verify their credentials. By providing an expedient intake process, clients can focus less on paperwork and more faster onboardings. With PAN India presence and fastest TAT, AssureID is the leader in background verification industry.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="aboutContent aboutDiv col-lg-4 col-md-4 col-sm-4 col-xs-12">
                   <div id="about-intro">
                      <div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginBTM" >
                          <h4>BYOiD</h4>
                          <p className="aboutP">
                            Bring Your Own Identity - BYOiD is an Aadhaar based instant identification program by AssureID for employing drivers, security guards and domestic helps or employing contractual candidates. BYOiD is available for the mass consumers via AssureID app for IOS and Android platforms.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="aboutContent aboutDiv col-lg-4 col-md-4 col-sm-4 col-xs-12">
                   <div id="about-intro">
                      <div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginBTM" >
                          <h4>AssureCV</h4>
                          <p className="aboutP">
                            <p>Most employers conduct background verifications during their recruitment process. This is a global industry best practice to ensure the truthfulness of claims made by job applicants during the selections.</p>
                            <p>You can now create, edit and share your professional CV's with our online CV builder to improve opportunities with prospective employers. With an  Assured ID mark on your CV, you not only prove to your prospective employers that you are a genuine & qualified professional, you also help yourself stand out by being pro-active and demonstrating integrity in your application. All you have to do is register on AssureID and create a CV.</p>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 about-UsVideo">
          <Aboutusvideo />
        </div>
      </div>
    );
  }
}
