import React from "react";
import { Redirect } from "react-router-dom";
import Map from "./Map";
import Header from "./Header";
import Footer from "./Footer";
import PlannerWizardPID from "../api/PlannerWizardPID";

/**
 * Komponenta kombinovaného form-wizardu, která je komunikátorem mezi vyhledávačem (komponenta PlannerWizardPID) a jádrem aplikace (komponenta App).
 * Je zodpovědná za vykreslení stránky včetně headeru a footeru a následný přesun na stránku s výsledky, když dojde k vyhledání.
 */
class PlannerWizard extends React.Component {
  constructor(props) {
    super(props);
    /** State komponenty
     * ready - určuje zda je aplikace připravena k zobrazení výsledků
     */
    this.state = {
      ready: false
    };
    //refs
    this.map = React.createRef();
    //bindings
    this.setApi = this.setApi.bind(this);
    this.getStart = this.getStart.bind(this);
    this.getVia = this.getVia.bind(this);
    this.getEnd = this.getEnd.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.getTimeAndDate = this.getTimeAndDate.bind(this);
    this.setReady = this.setReady.bind(this);
    this.getStartStopPointId = this.getStartStopPointId.bind(this);
    this.getViaStopPointId = this.getViaStopPointId.bind(this);
    this.getEndStopPointId = this.getEndStopPointId.bind(this);
  }

  /** Následující komponenty slouží ke komunikaci s jádrem aplikace a vyhledávačem.
   * Přesouvají data z vyšší vrstvy (vyhledávač) do vrstvy nižší (jádro)
   **/
  setApi(selectedApi) {
    this.props.writeApi(selectedApi);
  }

  getStart(start) {
    this.props.writeStart(start);
  }

  getVia(via) {
    this.props.writeVia(via);
  }

  getEnd(end) {
    this.props.writeEnd(end);
  }

  getStartStopPointId(place) {
    this.props.writeStartId(place);
  }
  getViaStopPointId(place) {
    this.props.writeViaId(place);
  }
  getEndStopPointId(place) {
    this.props.writeEndId(place);
  }

  getOptions(options) {
    this.props.writeOptions(options);
  }

  getTimeAndDate(timedate) {
    this.props.writeTimeAndDate(timedate);
  }

  /** Metoda nastavujicí připravenost aplikace k vyhledání
   * Pokud je state ready true, dojde k přesunu z vyhledávače na stránku s výsledky.
   */
  setReady(bool) {
    this.setState({ ready: bool });
  }

  /**
   * Renderovací metoda která udržuje obsahuje header, footer a vyhledávač aplikace.
   * Každému vyhledávači (komponentě PlannerWizardPID) jsou předány props jako odkazy na metody této komponenty,
   * které pak využívají pro přesun dat níže (do této komponenty).
   * 
   * Při změně state ready v této komponentě dojde na redirect na výsledky.
   */
  render() {
    if (this.state.ready) {
      return <Redirect to="/old_wizard_result"></Redirect>;
    } else {
      return (
        <React.Fragment>
          <Header></Header>
          <main className="journey-planner">
            <section className="planner">
              <PlannerWizardPID
                start={this.getStart}
                via={this.getVia}
                end={this.getEnd}
                startId={this.getStartStopPointId}
                viaId={this.getViaStopPointId}
                endId={this.getEndStopPointId}
                timedate={this.getTimeAndDate}
                ready={this.setReady}
                planner={this.props.planner}
                setApi={this.setApi}
                getOptions={this.getOptions}
              ></PlannerWizardPID>
            </section>
            <Map ref={this.map}></Map>
          </main>
          <Footer></Footer>
        </React.Fragment>
      );
    }
  }
}

export default PlannerWizard;
