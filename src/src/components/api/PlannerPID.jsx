import React from "react";
import OptionsSelect from "../app/OptionsSelect";
import SelectApi from "./SelectApi";
import ParametersPID from "./ParametersPID";
import TransportPID from "./TransportPID";
import swap_icon from "../../assets/Swap.png";
import add_icon from "../../assets/Add.png";
import remove_icon from "../../assets/Remove.png";
import AccessibilityPID from "./AccessibilityPID";

class PlannerPID extends React.Component {
  constructor(props) {
    super(props);
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
    this.getOptions = this.getOptions.bind(this);
    this.state = {
      via: false
    };
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
    this.props.timedate(initApiTime);
  }

  componentDidMount() {
    this.initialTimeDateSetup();
    let options = document.getElementsByClassName("options-box");
    for (let i = 0; i < options[0].children.length; i++) {
      options[0].children[i].style.display = "none";
    }
  }

  setApi(api) {
    this.props.setApi(api);
  }

  handleFromInput(e) {
    this.setState({ from: e.target.value });
    var searchedName = e.target.value;
    var searchedId = e.target.value;
    var url = "https://api.navitia.io/v1/coverage/cz/places?q="+e.target.value;
    var headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(process.env.REACT_APP_NAVITIA_TOKEN));
    fetch(url, {method: 'GET', headers: headers})
    .then(response => response.json())
    .then(json => {
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
    if (e.target.value.length < 1) {
      e.target.setAttribute("warning", "true");
    } else {
      e.target.setAttribute("warning", "false");
    }
  }

  handleToInput(e) {
    this.setState({ to: e.target.value });
    var searchedName = e.target.value;
    var searchedId = e.target.value;
    var url = "https://api.navitia.io/v1/coverage/cz/places?q="+e.target.value;
    var headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(process.env.REACT_APP_NAVITIA_TOKEN));
    fetch(url, {method: 'GET', headers: headers})
    .then(response => response.json())
    .then(json => {
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
    if (document.getElementById("input_from").value.length < 1 || document.getElementById("input_to").value.length < 1) {
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

  getOptions() {
    var options = {
      directPath: document.getElementById("directPath").checked,
      fastestRoute: document.getElementsByClassName("route")[0].checked,
      lowWalkingRoute: document.getElementsByClassName("route")[1].checked,
      numTransfers: document.getElementById("numTransfers").value,
      timeToTransfer: document.getElementById("timeToTransfer").value,
      transferDistance: document.getElementById("transferDistance").value,
      traveler_type: {
        walker: document.getElementsByClassName("traveler_type")[0].checked,
        bike: document.getElementsByClassName("traveler_type")[1].checked,
        car: document.getElementsByClassName("traveler_type")[2].checked
      },
      means: {
        metro: document.getElementsByClassName("means")[0].firstChild.checked,
        tram: document.getElementsByClassName("means")[1].firstChild.checked,
        bus: document.getElementsByClassName("means")[2].firstChild.checked,
        train: document.getElementsByClassName("means")[3].firstChild.checked,
        fenicular: document.getElementsByClassName("means")[4].firstChild
          .checked,
        ferry: document.getElementsByClassName("means")[5].firstChild.checked
      },
      special: {
        standard: document.getElementsByClassName("traveler_type")[3].checked,
        baby: document.getElementsByClassName("traveler_type")[4].checked,
        wheelchair: document.getElementsByClassName("traveler_type")[5].checked,
        luggage: document.getElementsByClassName("traveler_type")[6].checked,
        cyclist: document.getElementsByClassName("traveler_type")[7].checked
      }
    };
    this.props.getOptions(options);
  }
  
  render() {
    return (
      <form
        className="input"
        id="inputForm"
        action="/form_result"
        onSubmit={this.handleSubmit}
        onChange={this.getOptions}
        onClick={this.getOptions}
      >
        <div className="plannerBox">
          <div className="box" id="searchBox">
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
          <div className="options">
            <OptionsSelect></OptionsSelect>
            <div className="options-box">
              <ParametersPID></ParametersPID>
              <TransportPID></TransportPID>
              <AccessibilityPID></AccessibilityPID>
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
export default PlannerPID;
