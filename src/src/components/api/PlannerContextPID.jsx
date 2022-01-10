import React from "react";
import ContextSteps from "../app/ContextSteps";
import SelectApi from "./SelectApi";
import swap_icon from "../../assets/Swap.png";
import add_icon from "../../assets/Add.png";
import remove_icon from "../../assets/Remove.png";
import normal_icon from "../../assets/Normal.png";
import work_icon from "../../assets/Work.png";
import school_icon from "../../assets/School.png";
import doctor_icon from "../../assets/Doctor.png";
import freetime_icon from "../../assets/Bike.png";

class PlannerContextPID extends React.Component {
  constructor(props) {
    super(props);
    //STATE
    this.state = {
      from: "",
      to: "",
      suggestions: undefined,
      via: false,
      date: "",
      time: "",
      directPath: false,
      traveler_type: "pouze peší chůze",
      means: "",
      special: "bez dalších potřeb",
      context: "none",
    };
    //BINDINGS
    this.initialTimeDateSetup = this.initialTimeDateSetup.bind(this);
    this.handleFromInput = this.handleFromInput.bind(this);
    this.handleViaInput = this.handleViaInput.bind(this);
    this.handleToInput = this.handleToInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTimeAndDate = this.handleTimeAndDate.bind(this);
    this.drawSuggestions = this.drawSuggestions.bind(this);
    this.setApi = this.setApi.bind(this);
    this.changeTransit = this.changeTransit.bind(this);
    this.updateInputValues = this.updateInputValues.bind(this);
    this.swapInputFields = this.swapInputFields.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
    this.getSelectedMeans = this.getSelectedMeans.bind(this);
    this.getCurrentWeather = this.getCurrentWeather.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  initialTimeDateSetup() {
    var date = new Date();
    var initApiTime =
      date.getFullYear() +
      "" +
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      "" +
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
      "T" +
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
      "" +
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      "00";
    var currentDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      "-" +
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
    var currentTime =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
      ":" +
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
    document.getElementById("input_date").value = currentDate;
    document.getElementById("input_time").value = currentTime;
    this.setState({ date: currentDate, time: currentTime });
    this.props.timedate(initApiTime);
  }

  componentDidMount() {
    this.initialTimeDateSetup();
    let options = document.getElementsByClassName("options-box");
    for (let i = 1; i < options[0].children.length; i++) {
      options[0].children[i].style.display = "none";
    }
  }

  setApi(api) {
    this.props.setApi(api);
  }

  handleFromInput(e) {
    this.setState({ from: e.target.value });
    //console.log("Input: "+e.target.value);
    var searchedName = e.target.value;
    var searchedId = e.target.value;
    var url = "https://api.navitia.io/v1/coverage/cz/places?q="+e.target.value;
    var headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(process.env.REACT_APP_NAVITIA_TOKEN));
    fetch(url, {method: 'GET', headers: headers})
    .then(response => response.json())
    .then(json => {
      //console.log(json.places)
      if (json.places !== undefined) {
        for (let i = 0; i < json.places.length; i++) {
          if (json.places[i].embedded_type === "stop_area") {
            searchedName = json.places[i].name;
            searchedId = json.places[i].id;
            break;
          }
        }
      }
    })
    this.props.start(searchedName);
    this.props.startId(searchedId);

    if (e.target.value.length < 1) {
      e.target.setAttribute("warning", "true");
    } else {
      e.target.setAttribute("warning", "false");
    }
  }

  handleViaInput(e) {
    this.props.via(e.target.value);
    this.props.viaId(e.target.value);
  }

  handleToInput(e) {
    this.setState({ to: e.target.value });
    //console.log("Output: "+e.target.value);
    var searchedName = e.target.value;
    var searchedId = e.target.value;
    var url = "https://api.navitia.io/v1/coverage/cz/places?q="+e.target.value;
    var headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(process.env.REACT_APP_NAVITIA_TOKEN));
    fetch(url, {method: 'GET', headers: headers})
    .then(response => response.json())
    .then(json => {
      //console.log(json.places)
      if (json.places !== undefined) {
        for (let i = 0; i < json.places.length; i++) {
          if (json.places[i].embedded_type === "stop_area") {
            searchedName = json.places[i].name;
            searchedId = json.places[i].id;
            break;
          }
        }
      }
    })
    this.props.end(searchedName);
    this.props.endId(searchedId);

    if (e.target.value.length < 1) {
      e.target.setAttribute("warning", "true");
    } else {
      e.target.setAttribute("warning", "false");
    }
  }

  handleTimeAndDate(e) {
    //e.preventDefault();
    let timeInput = document.getElementById("input_time");
    let dateInput = document.getElementById("input_date");
    this.setState({ date: timeInput.value, time: timeInput.value });
    var time = timeInput.value.substr(0, 2) + timeInput.value.substr(3, 2);
    var date =
      dateInput.value.substr(0, 4) +
      dateInput.value.substr(5, 2) +
      dateInput.value.substr(8, 2);
    let inputTimeDate = date + "T" + time;
    this.props.timedate(inputTimeDate);
  }

  drawSuggestions() {
    var p = document.getElementById("suggestions");
    p.appendChild(document.createElement("ul"));
    for (let i = 0; i < this.state.suggestions.length; i++) {
      let li = document.createElement("li");
      li.appendChild(document.createTextNode(this.state.suggestions[i]));
      p.childNodes[0].appendChild(li);
    }
  }

  updateInputValues() {
    var from = document.getElementById("input_from");
    var to = document.getElementById("input_to");
    this.props.start(from.value);
    this.props.end(to.value);
  }

  updateOptions() {
    this.getOptions();
  }

  handleSubmit(e) {
    this.setState({ vialFrom: this.state.from, vialTo: this.state.to });
    if (
      document.getElementById("input_from").value.length < 1 ||
      document.getElementById("input_to").value.length < 1
    ) {
      e.preventDefault();
      document.getElementById("input_from").setAttribute("warning", "true");
      document.getElementById("input_to").setAttribute("warning", "true");
    } else {
      e.preventDefault();
      if (this.props.update !== undefined) {
        this.updateInputValues();
        this.props.update();
      } else {
        this.props.ready(true);
      }
    }
  }

  changeTransit(e) {
    this.getOptions();
    var viaSection = document.getElementById("via");
    if (this.state.via === false) {
      viaSection.setAttribute("active", "true");
      let addViaEls = document.getElementsByClassName("addVia");
      let remViaEls = document.getElementsByClassName("removeVia");
      addViaEls[0].style.display = "none";
      remViaEls[0].style.display = "inline-block";
      this.setState({ via: true });
    } else {
      document.getElementById("input_via").value = "";
      this.props.via(document.getElementById("input_via").value);
      viaSection.setAttribute("active", "false");
      let addViaEls = document.getElementsByClassName("addVia");
      let remViaEls = document.getElementsByClassName("removeVia");
      addViaEls[0].style.display = "inline-block";
      remViaEls[0].style.display = "none";
      this.setState({ via: false });
    }
  }

  swapInputFields() {
    this.getOptions();
    var fromOld = document.getElementById("input_from").value;
    var to = document.getElementById("input_to");
    var from = document.getElementById("input_from");
    from.value = to.value;
    to.value = fromOld;
    this.props.start(from.value);
    this.props.startId(from.value);
    this.props.end(to.value);
    this.props.endId(to.value);
    this.setState({ from: from.value });
    this.setState({ to: to.value });
  }

  getSelectedMeans() {
    var meansCollection = document.getElementsByClassName("means");
    var means = {};
    for (let i = 0; i < meansCollection.length; i++) {
      means[meansCollection[i].id] = meansCollection[i].checked;
    }
    return means;
  }

  getCurrentWeather() {
    var currentWeather = Math.floor(Math.random() * 7);
    switch (currentWeather) {
      case 3:
        return "snow";
      case 2:
        return "rain";
      case 1:
        return "cloudy";
      case 0:
        return "sunny";
      default:
        return "partly_cloudy";
    }
  }

  getOptions() {
    console.log("Options:");
    var options = {
      directPath: document.getElementById("directPath").checked,
      travel_type: document
        .querySelector('input[name="travel_type"]:checked')
        .getAttribute("id"),
      means: this.getSelectedMeans(),
      special: document
        .querySelector('input[name="special"]:checked')
        .getAttribute("id"),
      weather: this.getCurrentWeather(),
    };
    console.log("======== WEATHER: ==== " + this.getCurrentWeather());
    if (options.directPath) {
      this.setState({ directPath: true });
    }

    if (options.travel_type === "normal") {
      this.setState({ traveler_type: "pouze peší chůze" });
    }
    if (options.travel_type === "work") {
      this.setState({ travel_type: "kola nebo koloběžky" });
    }
    if (options.travel_type === "school") {
      this.setState({ traveler_type: "osobního automobilu" });
    }
    if (options.travel_type === "freetime") {
      this.setState({ traveler_type: "osobního automobilu" });
    }

    // MEANS
    this.setState({ means: options.means });

    // SPECIAL REQUIREMENTS
    if (options.special === "standard") {
      this.setState({ traveler_type: "standard" });
    }
    if (options.special === "slow_walker") {
      this.setState({ traveler_type: "slow_walker" });
    }
    if (options.special === "wheelchair") {
      this.setState({ traveler_type: "wheelchair" });
    }
    if (options.special === "luggage") {
      this.setState({ traveler_type: "luggage" });
    }
    if (options.special === "cyclist") {
      this.setState({ traveler_type: "cyclist" });
    }

    this.props.getOptions(options);
  }

  render() {
    return (
      <form
        className="input"
        id="contextForm"
        action="/result"
        onSubmit={this.handleSubmit}
        onChange={this.getOptions}
      >
        <div className="options">
          <ContextSteps step={this.state.step}></ContextSteps>
          <div className="options-box">
            <div id="options-box-main" display="block">
              <div className="inputFieldDiv">
                <label className="textLabel">Odkud:</label>
                <input
                  className="locations"
                  id="input_from"
                  type="form"
                  placeholder="Zadejte počáteční bod"
                  onChange={this.handleFromInput}
                ></input>
              </div>
              <p id="suggestions"></p>
              <div className="inputFieldDiv" id="via" active="false">
                <label className="addVia" onClick={this.changeTransit}>
                  <img
                    className="viaBtn"
                    src={add_icon}
                    alt="+"
                    title="Přidat průjezdní bod"
                  ></img>
                  <label id="addViaText">Přidat průjezd</label>
                </label>
                <label className="removeVia" style={{ display: "none" }}>
                  <img
                    className="viaBtn"
                    src={remove_icon}
                    alt="×"
                    onClick={this.changeTransit}
                    title="Odebrat průjezdní bod"
                  ></img>
                  <input
                    className="locations"
                    id="input_via"
                    type="form"
                    placeholder="Zadejte průjezdový bod"
                    onChange={this.handleViaInput}
                  ></input>
                </label>
                <label id="swapper" onClick={this.swapInputFields}>
                  <img
                    className="clickable"
                    src={swap_icon}
                    alt="[SWAP]"
                    title="Prohodit Start a Cíl"
                  ></img>
                </label>
              </div>
              <div className="inputFieldDiv">
                <label className="textLabel">Kam:</label>
                <input
                  className="locations"
                  id="input_to"
                  type="form"
                  placeholder="Zadejte cílový bod"
                  onChange={this.handleToInput}
                ></input>
              </div>
              <div className="box" id="timeBox">
                <div className="inputFieldDiv">
                  <label className="textLabel">Datum a čas:</label>
                  <input
                    id="input_date"
                    type="date"
                    onChange={this.handleTimeAndDate}
                  ></input>
                  <input
                    id="input_time"
                    type="time"
                    onChange={this.handleTimeAndDate}
                  ></input>
                </div>
              </div>
              <div className="directPathBox">
                <label className="inputFieldDiv">
                  <input
                    type="checkbox"
                    id="directPath"
                    onChange={this.getOptions}
                  ></input>
                  Pouze přímý spoj
                </label>
              </div>
            </div>
            <div
              className="contextOptionsSettings"
              id="options-box-parameters"
              display="none"
            >
              <label className="outline">
                <input
                  type="radio"
                  name="travel_type"
                  className="route"
                  id="normal"
                  defaultChecked
                ></input>
                <img src={normal_icon} alt="n"></img>
                <label htmlFor="normal" className="travel_type">
                  Normální
                </label>
              </label>
              <label className="outline">
                <input
                  type="radio"
                  name="travel_type"
                  className="route"
                  id="work"
                ></input>
                <label htmlFor="work" className="travel_type">
                  <img src={work_icon} alt="n"></img>Do práce
                </label>
              </label>
              <label className="outline">
                <input
                  type="radio"
                  name="travel_type"
                  className="route"
                  id="school"
                ></input>
                <img src={school_icon} alt="n"></img>
                <label htmlFor="school" className="travel_type">
                  Do školy
                </label>
              </label>
              <label className="outline">
                <input
                  type="radio"
                  name="travel_type"
                  className="route"
                  id="doctor"
                ></input>
                <img src={doctor_icon} alt="n"></img>
                <label htmlFor="doctor" className="travel_type">
                  Za lékařem
                </label>
              </label>
              <label className="outline">
                <input
                  type="radio"
                  name="travel_type"
                  className="route"
                  id="freetime"
                ></input>
                <img src={freetime_icon} alt="n"></img>
                <label htmlFor="freetime" className="travel_type">
                  Rekreace
                </label>
              </label>
            </div>
            <div
              className="contextOptionsSettings"
              id="options-box-transport"
              display="none"
            >
              <label className="outline">
                <input
                  type="checkbox"
                  className="means"
                  id="Metro"
                  defaultChecked
                ></input>

                <label className="meansLabel" htmlFor="Metro">
                  Metro
                </label>
              </label>
              <label className="outline">
                <input
                  type="checkbox"
                  className="means"
                  id="Tramway"
                  defaultChecked
                ></input>
                <label className="meansLabel" htmlFor="Tramway">
                  Tramvaj
                </label>
              </label>
              <label className="outline">
                <input
                  type="checkbox"
                  className="means"
                  id="Bus"
                  defaultChecked
                ></input>
                <label className="meansLabel" htmlFor="Bus">
                  Autobus
                </label>
              </label>
              <label className="outline">
                <input
                  type="checkbox"
                  className="means"
                  id="Train"
                  defaultChecked
                ></input>
                <label className="meansLabel" htmlFor="Train">
                  Příměstský vlak
                </label>
              </label>
              <label className="outline">
                <input
                  type="checkbox"
                  className="means"
                  id="Funicular"
                  defaultChecked
                ></input>
                <label className="meansLabel" htmlFor="Funicular">
                  Lanovka
                </label>
              </label>
              <label className="outline">
                <input
                  type="checkbox"
                  className="means"
                  id="Ferry"
                  defaultChecked
                ></input>
                <label className="meansLabel" htmlFor="Ferry">
                  Přívoz
                </label>
              </label>
              <label className="outline">
                <input
                  type="checkbox"
                  className="means"
                  id="Car"
                  defaultChecked
                ></input>
                <label className="meansLabel" htmlFor="Car">
                  Osobní automobil
                </label>
              </label>
              <label className="outline">
                <input
                  type="checkbox"
                  className="means"
                  id="Bike"
                  defaultChecked
                ></input>
                <label className="meansLabel" htmlFor="Bike">
                  Kolo nebo koloběžka
                </label>
              </label>
              <label className="outline">
                <input
                  type="checkbox"
                  className="means"
                  id="Shared"
                  defaultChecked
                ></input>
                <label className="meansLabel" htmlFor="Shared">
                  Sdílené kolo nebo koloběžka
                </label>
              </label>
            </div>
            <div
              className="contextOptionsSettings"
              id="options-box-access"
              display="none"
            >
              <label className="outline">
                <input
                  type="radio"
                  name="special"
                  className="traveler_type"
                  id="standard"
                  defaultChecked
                ></input>
                <label htmlFor="standard" className="access">
                  Nemám omezení
                </label>
              </label>
              <label className="outline">
                <input
                  type="radio"
                  name="special"
                  className="traveler_type"
                  id="slow_walker"
                ></input>
                <label htmlFor="slow_walker" className="access">
                  Cestuji s kočárkem
                </label>
              </label>
              <label className="outline">
                <input
                  type="radio"
                  name="special"
                  className="traveler_type"
                  id="wheelchair"
                ></input>
                <label htmlFor="wheelchair" className="access">
                  Cestuji s vozíčkem
                </label>
              </label>
              <label className="outline">
                <input
                  type="radio"
                  name="special"
                  className="traveler_type"
                  id="luggage"
                ></input>
                <label htmlFor="luggage" className="access">
                  Cestuji s těžkými zavazadly
                </label>
              </label>
              <label className="outline">
                <input
                  type="radio"
                  name="special"
                  className="traveler_type"
                  id="cyclist"
                ></input>
                <label htmlFor="cyclist" className="access">
                  Cestuji s kolem/koloběžkou
                </label>
              </label>
            </div>
          </div>
        </div>
        <div className="submitBox">
          <SelectApi setApi={this.setApi}></SelectApi>
          <input
            type="submit"
            value="Vyhledat spojení"
            title="Vyhledat spoj dle zadaných hodnot"
          ></input>
        </div>
      </form>
    );
  }
}
export default PlannerContextPID;
