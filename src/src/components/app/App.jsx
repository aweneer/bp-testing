import React from "react";
import { Route, Switch } from "react-router-dom";
import "../css/App.css";
import Planner from "./Planner";
import PlannerWizard from "./PlannerWizard";
import Result from "./Result";
import ResultWizard from "./ResultWizard";
import PlannerContext from "./PlannerContext";
import ResultContext from "./ResultContext";

/**
 * Hlavní komponenta aplikace. Udržuje v sobě parametry vyhledávání, které zadal uživatel. 
 * Parametry si pak převezme komponenta Result, která uživateli vykreslí výsledky.
 * Komponenta obsahuje metody, které přijímají v argumentu data z komponent o úroveň výš.
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    /** Bindings, aby komponenta přistupovala ke svým provázaným metodám */
    this.writeStart = this.writeStart.bind(this);
    this.writeVia = this.writeVia.bind(this);
    this.writeEnd = this.writeEnd.bind(this);
    this.writeStartId = this.writeStartId.bind(this);
    this.writeViaId = this.writeViaId.bind(this);
    this.writeEndId = this.writeEndId.bind(this);
    this.writeTimeAndDate = this.writeTimeAndDate.bind(this);
    this.writeOptions = this.writeOptions.bind(this);
    this.writeApi = this.writeApi.bind(this);
    /** Vnitřní state komponenty */
    this.state = {
      start: "",
      via: "",
      end: "",
      startId: undefined,
      viaId: undefined,
      endId: undefined,
      timedate: "",
      api: "pid",
      options: ""
    };
  }

  /** Zápis počáteční pozice vyhledávání do state */
  writeStart(from) {
    this.setState({ start: from });
  }

  /** Zápis průjezdní pozice vyhledávání do state */
  writeVia(thru) {
    this.setState({ via: thru });
  }

  /** Zápis koncové pozice vyhledávání do state */
  writeEnd(to) {
    this.setState({ end: to });
  }

  /** Požadavek na Navitia.io, který zapíše ID patřící vyhledávané stringové hodnotě počáteční pozice do state komponenty.
   * V metodě je kontrola, aby šlo o zastávku a ne jiné místo.
   */
  writeStartId(place) {
    var url = "https://api.navitia.io/v1/coverage/cz/places?q=" + place;
    console.log(url);
    var headers = new Headers();
    headers.set(
      "Authorization",
      "Basic " + btoa(process.env.REACT_APP_NAVITIA_TOKEN)
    );
    fetch(url, { method: "GET", headers: headers })
      .then(response => response.json())
      .then(json => {
        if (json.places !== undefined) {
          for (let i = 0; i < json.places.length; i++) {
            if (json.places[i].embedded_type === "stop_area") {
              this.setState({ startId: json.places[i].id });
              break;
            }
          }
        }
      });
  }

   /** Požadavek na Navitia.io, který zapíše ID patřící vyhledávané stringové hodnotě průjezdní pozice do state komponenty.
   * V metodě je kontrola, aby šlo o zastávku a ne jiné místo.
   */
  writeViaId(place) {
    var url = "https://api.navitia.io/v1/coverage/cz/places?q=" + place;
    var headers = new Headers();
    headers.set(
      "Authorization",
      "Basic " + btoa(process.env.REACT_APP_NAVITIA_TOKEN)
    );
    fetch(url, { method: "GET", headers: headers })
      .then(response => response.json())
      .then(json => {
        if (json.places !== undefined) {
          for (let i = 0; i < json.places.length; i++) {
            if (json.places[i].embedded_type === "stop_area") {
              this.setState({ viaId: json.places[i].id });
              break;
            }
          }
        }
      });
  }

   /** Požadavek na Navitia.io, který zapíše ID patřící vyhledávané stringové hodnotě koncové pozice do state komponenty.
   * V metodě je kontrola, aby šlo o zastávku a ne jiné místo.
   */
  writeEndId(place) {
    var url = "https://api.navitia.io/v1/coverage/cz/places?q=" + place;
    console.log(url);
    var headers = new Headers();
    headers.set(
      "Authorization",
      "Basic " + btoa(process.env.REACT_APP_NAVITIA_TOKEN)
    );
    fetch(url, { method: "GET", headers: headers })
      .then(response => response.json())
      .then(json => {
        if (json.places !== undefined) {
          for (let i = 0; i < json.places.length; i++) {
            if (json.places[i].embedded_type === "stop_area") {
              this.setState({ endId: json.places[i].id });
              break;
            }
          }
        }
      });
  }

  /** Zápis času a data do state komponenty */
  writeTimeAndDate(timedate) {
    this.setState({ timedate: timedate });
  }

  /** Zápis nastavených parametrů do state */
  writeOptions(options) {
    this.setState({ options: options });
  }

  /** Zápis aktuálního API do state */
  writeApi(api) {
    this.setState({api: api})
  }

  /**
   * Renderovací metoda která udržuje Router pro přechod mezi jednotlivými stránkami aplikace při změně URL.
   * Každému vyhledávači/výsledku (komponentě) jsou předány props jako odkazy na metody této komponenty,
   * které pak využívají pro přesun dat níže (do této komponenty)
   */
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={props => (
            <Planner
              {...props}
              writeStart={this.writeStart}
              writeVia={this.writeVia}
              writeEnd={this.writeEnd}
              writeStartId={this.writeStartId}
              writeViaId={this.writeViaId}
              writeEndId={this.writeEndId}
              writeTimeAndDate={this.writeTimeAndDate}
              writeOptions={this.writeOptions}
              writeApi={this.writeApi}
              planner={this.state}
            />
          )}
        />
        <Route
          path="/form"
          render={props => (
            <Planner
              {...props}
              writeStart={this.writeStart}
              writeVia={this.writeVia}
              writeEnd={this.writeEnd}
              writeStartId={this.writeStartId}
              writeViaId={this.writeViaId}
              writeEndId={this.writeEndId}
              writeTimeAndDate={this.writeTimeAndDate}
              writeOptions={this.writeOptions}
              writeApi={this.writeApi}
              planner={this.state}
            />
          )}
        />
        <Route
          exact
          path="/form_result"
          render={props => (
            <Result
              {...props}
              writeStart={this.writeStart}
              writeVia={this.writeVia}
              writeEnd={this.writeEnd}
              writeStartId={this.writeStartId}
              writeViaId={this.writeViaId}
              writeEndId={this.writeEndId}
              writeTimeAndDate={this.writeTimeAndDate}
              writeOptions={this.writeOptions}
              writeApi={this.writeApi}
              planner={this.state}
            />
          )}
        />
        <Route
          exact
          path="/old_wizard"
          render={props => (
            <PlannerWizard
              {...props}
              writeStart={this.writeStart}
              writeVia={this.writeVia}
              writeEnd={this.writeEnd}
              writeStartId={this.writeStartId}
              writeViaId={this.writeViaId}
              writeEndId={this.writeEndId}
              writeTimeAndDate={this.writeTimeAndDate}
              writeOptions={this.writeOptions}
              writeApi={this.writeApi}
              planner={this.state}
            />
          )}
        />
        <Route
          exact
          path="/old_wizard_result"
          render={props => (
            <ResultWizard
              {...props}
              writeStart={this.writeStart}
              writeVia={this.writeVia}
              writeEnd={this.writeEnd}
              writeStartId={this.writeStartId}
              writeViaId={this.writeViaId}
              writeEndId={this.writeEndId}
              writeTimeAndDate={this.writeTimeAndDate}
              writeOptions={this.writeOptions}
              writeApi={this.writeApi}
              planner={this.state}
            />
          )}
        />
        <Route
          exact
          path="/wizard"
          render={props => (
            <PlannerContext
              {...props}
              writeStart={this.writeStart}
              writeVia={this.writeVia}
              writeEnd={this.writeEnd}
              writeStartId={this.writeStartId}
              writeViaId={this.writeViaId}
              writeEndId={this.writeEndId}
              writeTimeAndDate={this.writeTimeAndDate}
              writeOptions={this.writeOptions}
              writeApi={this.writeApi}
              planner={this.state}
            />
          )}
        />
        <Route
          exact
          path="/wizard_result"
          render={props => (
            <ResultContext
              {...props}
              writeStart={this.writeStart}
              writeVia={this.writeVia}
              writeEnd={this.writeEnd}
              writeStartId={this.writeStartId}
              writeViaId={this.writeViaId}
              writeEndId={this.writeEndId}
              writeTimeAndDate={this.writeTimeAndDate}
              writeOptions={this.writeOptions}
              writeApi={this.writeApi}
              planner={this.state}
            />
          )}
        />
      
      </Switch>);
  }
}

export default App;
