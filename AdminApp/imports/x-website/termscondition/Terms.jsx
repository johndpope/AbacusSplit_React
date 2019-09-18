import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class Terms extends React.Component {
  componentDidMount() {
    if(!$("link[href='/css/assureServices.css']").length > 0){
      var servicesCss = document.createElement("link");
      servicesCss.type="text/css";
      servicesCss.rel ="stylesheet";
      servicesCss.href="/css/assureServices.css";
      document.head.append(servicesCss);
    }
  }
  componentWillUnmount() {
    $("link[href='/css/assureServices.css']").remove();
  }
  render() {
    return (
      <div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLR">
          <div className="servicesImageWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="color-overlay"></div>
            <div className="header-wrapper-inner col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h1>Terms & Conditions</h1>
              </div>
            </div>
          </div>
          <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 contactusOutWrapper1">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 news">
              {/*<h4 className="newsTitle">AssureID wins the prestigious BroadBrand Innovation Award 2017</h4>*/}
              <p>
                Lorem ipsum dolor sit amet, nam detraxit laboramus efficiantur an, eum id mazim civibus deterruisset. Ea qui simul splendide. Nobis apeirian sed in, no qui purto ridens pertinacia, mea no elit regione. Reque putent officiis eu his, erat interesset eu eam.

                Eam ex ancillae verterem disputando, in mei hinc facer bonorum, adversarium signiferumque ius et. Cum ei fabulas convenire salutatus, ne nec eripuit urbanitas. Mea repudiare euripidis ut, magna possit persius pri ne, at usu oblique adipisci. Ad solum aeque persequeris pri, ei nec elit latine nominati, velit graecis disputationi cum ne. Id nec iriure aliquip, usu ne tantas dicunt. Pro ea dicit epicuri, duo albucius verterem lobortis at. Qui elit velit vidisse id, ad eos libris semper, id est recusabo pericula accommodare.

                Ad reque mundi tibique eos. Erat copiosae detraxit vis at. Sea id discere delicata, eligendi erroribus ex eum. Ei veniam sententiae nam, duo ei enim inermis, sea ne appetere forensibus. Tollit utamur nostrud ea quo, sed eu ornatus noluisse repudiandae. Duo soluta assentior omittantur id, ne pri iisque bonorum argumentum, est ut malorum consequuntur.

                Suas postea duo ea. Vocent omittam eos ut, nonumy vivendo neglegentur et his. Ne verear audire qui, vis tation saperet no, ius te mazim equidem referrentur. Eu per dicat tritani temporibus. Ei albucius quaerendum sea, no graece mentitum officiis ius, ex exerci commodo admodum eam. Persius saperet sed ad.

                Ne cum falli nominati, ut eum nibh utroque platonem, ponderum appellantur nam at. Eos ut mazim menandri. No odio ridens insolens cum, brute latine has et. Ad brute malorum ius, eos te latine noluisse. Iisque labores eloquentiam eu pri, solum doming cum ea, recusabo persecuti pertinacia vim eu. Choro adipiscing in vix, ne sumo minimum sed. Vim ei dolor reprimique, ignota accusamus suscipiantur id eos.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
