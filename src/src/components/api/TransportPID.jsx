import React from "react";
import Label from "./Label";
import InputElement from "./InputElement";
//import SelectElement from "./SelectElement";

class TransportPID extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    //refs
    //bindings
  }

  render() {
    return (
      <div
        className="optionsSettings"
        id="options-box-transport"
        display="none"
      >
        <Label className={"optionTitle"} text={"Na trase chci využít"}></Label>
        <InputElement element={"input"} type={"radio"} name={"ownTransport"} className={"traveler_type"} id={"walker"} text={"Pouze peší chůze"} defaultChecked={true}></InputElement>
        <InputElement element={"input"} type={"radio"} name={"ownTransport"} className={"traveler_type"} id={"cyclist"} text={"Kolo nebo koloběžku"} defaultChecked={false}></InputElement>
        <InputElement element={"input"} type={"radio"} name={"ownTransport"} className={"traveler_type"} id={"motorist"} text={"Osobní automobil"} defaultChecked={false}></InputElement>
        <Label className={"optionTitle"} text={"Výběr dopravních prostředků"}></Label>
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
            <input type="checkbox" id="Funicular" defaultChecked></input>
            Lanovka
          </label>
          <label className="means">
            <input type="checkbox" id="Ferry" defaultChecked></input>
            Přívoz
          </label>
        </div>
        <Label className={"optionTitle"}  title={"Momentálně nedostupné"} text={"Doplňkové služby"}></Label>
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
    );
  }
}

export default TransportPID;
