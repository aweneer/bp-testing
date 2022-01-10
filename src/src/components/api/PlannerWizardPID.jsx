import React from "react";
import WizardSteps from "../app/WizardSteps";
import SelectApi from "./SelectApi";
import swap_icon from "../../assets/Swap.png";
import add_icon from "../../assets/Add.png";
import remove_icon from "../../assets/Remove.png";

class PlannerWizardPID extends React.Component {
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
      fastestRoute: false,
      numTransfers: "",
      traveler_type: "pouze peší chůze",
      special: "bez dalších potřeb"
    };
    //BINDINGS
    this.initialTimeDateSetup = this.initialTimeDateSetup.bind(this);
    this.handleFromInput = this.handleFromInput.bind(this);
    this.handleViaInput = this.handleViaInput.bind(this);
    this.handleToInput = this.handleToInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTimeAndDate = this.handleTimeAndDate.bind(this);
    this.drawSuggestions = this.drawSuggestions.bind(this);
    this.updateSelectedApi = this.updateSelectedApi.bind(this);
    this.changeTransit = this.changeTransit.bind(this);
    this.updateInputValues = this.updateInputValues.bind(this);
    this.swapInputFields = this.swapInputFields.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
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
    this.setState({date: currentDate, time: currentTime});
    this.props.timedate(initApiTime);
  }

  componentDidMount() {
    this.initialTimeDateSetup();
    let options = document.getElementsByClassName("options-box");
    for (let i = 1; i < options[0].children.length; i++) {
      options[0].children[i].style.display = "none";
    }
  }

  updateSelectedApi(api) {
    this.props.setApi(api);
  }

  handleFromInput(e) {
    this.setState({ from: e.target.value });
    this.props.start(e.target.value);
    this.props.startId(e.target.value);
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
    this.props.end(e.target.value);
    this.props.endId(e.target.value);
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
    this.setState({date: timeInput.value, time: timeInput.value});
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
    this.setState({vialFrom: this.state.from, vialTo: this.state.to});
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
    if (options.directPath) {this.setState({directPath: true})};
    if (options.fastestRoute) {this.setState({fastestRoute: true})};
    if (options.numTransfers > 0) {this.setState({numTransfers: options.numTransfers})} else {this.setState({numTransfers: "neomezeným počtem"})};
    if (options.traveler_type.walker) {this.setState({traveler_type: "pouze peší chůze"})};
    if (options.traveler_type.bike) {this.setState({traveler_type: "kola nebo koloběžky"})};
    if (options.traveler_type.car) {this.setState({traveler_type: "osobního automobilu"})};
    if (options.special.standard) {this.setState({special: "bez dalších potřeb"})};
    if (options.special.baby) {this.setState({special: "s kočárkem"})};
    if (options.special.wheelchair) {this.setState({special: "s vozíčkem"})};
    if (options.special.luggage) {this.setState({special: "s těžkými zavazadly"})};
    if (options.special.cyclist) {this.setState({special: "s kolem do MHD"})};


    console.log("Writing:");
    console.log(options.traveler_type);
    console.log(options.means);
    console.log(options.special);
    this.props.getOptions(options);
  }

  render() {
    return (
      <form
        className="input"
        id="inputForm"
        action="/result"
        onSubmit={this.handleSubmit}
        onChange={this.getOptions}
      >
        <div className="options">
          <WizardSteps step={this.state.step}></WizardSteps>
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
                className="optionsSettings"
                id="options-box-parameters"
                display="none"
              >
                <label className="optionTitle">Trasa</label>
                <br />
                <label>
                  <input
                    type="radio"
                    name="route"
                    className="route"
                    id="fastestRoute"
                    defaultChecked
                  ></input>
                  Nejrychlejší
                  <br />
                </label>
                <label>
                  <input
                    type="radio"
                    name="route"
                    className="route"
                    id="lowWalkingRoute"
                  ></input>
                  Nejméně pěší chůze
                  <br />
                </label>
                <label className="optionTitle">Přestupy</label>
                <br />
                <label className="transfersLabel">
                  Maximální počet přestupů:
                </label>
                <select defaultValue="-1" id="numTransfers">
                  <option value="-1">Neomezeno</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <br />
                <label className="transfersLabel">Čas na přestup:</label>
                <select defaultValue="10" id="timeToTransfer">
                  <option value="5">Alespoň 5 minut</option>
                  <option value="10">Alespoň 10 minut</option>
                  <option value="15">Alespoň 15 minut</option>
                </select>
                <br />
                <label className="transfersLabel">
                  Maximální vzdálenost mezi přestupy:
                </label>
                <select defaultValue="100m" id="transferDistance">
                  <option value="100">100 m</option>
                  <option value="200">200 m</option>
                  <option value="300">300 m</option>
                </select>
              </div>
              <div
                className="optionsSettings"
                id="options-box-transport"
                display="none"
              >
                <label className="optionTitle">Na trase chci využít</label>
                <label>
                  <input
                    type="radio"
                    name="ownTransport"
                    className="traveler_type"
                    id="walker"
                    defaultChecked
                  ></input>
                  Pouze peší chůze
                </label>
                <label>
                  <input
                    type="radio"
                    name="ownTransport"
                    className="traveler_type"
                    id="cyclist"
                  ></input>
                  Kolo nebo koloběžku
                </label>
                <label>
                  <input
                    type="radio"
                    name="ownTransport"
                    className="traveler_type"
                    id="motorist"
                  ></input>
                  Osobní automobil
                </label>
                <label className="optionTitle">
                  Výběr dopravních prostředků
                </label>
                <div className="optionMeans">
                  <label className="means">
                    <input type="checkbox" id="Metro" defaultChecked></input>
                    Metro
                  </label>
                  <label className="means">
                    <input type="checkbox" id="Tramway" defaultChecked></input>
                    Tramvaj
                  </label>
                  <label className="means">
                    <input type="checkbox" id="Bus" defaultChecked></input>
                    Autobus
                  </label>
                  <label className="means">
                    <input type="checkbox" id="Train" defaultChecked></input>
                    Příměstský vlak
                  </label>
                  <label className="means">
                    <input
                      type="checkbox"
                      id="Funicular"
                      defaultChecked
                    ></input>
                    Lanovka
                  </label>
                  <label className="means">
                    <input type="checkbox" id="Ferry" defaultChecked></input>
                    Přívoz
                  </label>
                </div>
                <label className="optionTitle" title="Momentálně nedostupné">
                  Doplňkové služby
                </label>
                <label title="Momentálně nedostupné">
                  <input
                    type="checkbox"
                    className="journeyFeature"
                    id="taxi"
                    disabled
                  ></input>
                  Taxi
                </label>
                <label title="Momentálně nedostupné">
                  <input
                    type="checkbox"
                    className="journeyFeature"
                    id="uber"
                    disabled
                  ></input>
                  UBER
                </label>
              </div>
              <div
                className="optionsSettings"
                id="options-box-access"
                display="none"
              >
                <label className="optionTitle">Jsem cestující</label>
                <label>
                  <input
                    type="radio"
                    name="transportRequest"
                    className="traveler_type"
                    id="standard"
                    defaultChecked
                  ></input>
                  Bez dalších potřeb
                </label>
                <label>
                  <input
                    type="radio"
                    name="transportRequest"
                    className="traveler_type"
                    id="slow_walker"
                  ></input>
                  S kočárkem
                </label>
                <label>
                  <input
                    type="radio"
                    name="transportRequest"
                    className="traveler_type"
                    id="wheelchair"
                  ></input>
                  S vozíčkem
                </label>
                <label>
                  <input
                    type="radio"
                    name="transportRequest"
                    className="traveler_type"
                    id="luggage"
                  ></input>
                  S těžkými zavazadly
                </label>
                <label>
                  <input
                    type="radio"
                    name="transportRequest"
                    className="traveler_type"
                    id="cyclist"
                  ></input>
                  S kolem do MHD
                </label>
              </div>
              <div
                className="optionsSettings"
                id="options-box-summary"
                display="none">
                  <label className="optionTitle">
                    Souhrn před zobrazením výsledků:
                  </label>
                  <label className="summaryText">
                    <label><b>Spoj z: </b>{this.state.vialFrom}<b> do: </b>{this.state.vialTo}</label>
                    <label><b>Datum: </b>{this.state.date}<b> v </b>{this.state.time}</label>
                    <label><b>Trasa s max </b>{this.state.numTransfers > 0 ? this.state.numTransfers : "neomezenými"}<b> přestupy</b></label>
                    <label><b>S využitím: </b>{this.state.traveler_type}</label>
                    <label><b>Pro cestující: </b>{this.state.special}</label>
                  </label>
              </div>
          </div>
        </div>
        <div className="submitBox">
          <SelectApi updateSelectedApi={this.updateSelectedApi}></SelectApi>
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
export default PlannerWizardPID;
