import React from "react";
import Label from "./Label";
import InputElement from "./InputElement";


class ParametersPID extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    //refs
    //bindings
  }

  render() {
    return (
      <div
      className="optionsSettings"
      id="options-box-parameters"
      display="none"
    >
      <Label className={"optionTitle"} text={"Trasa"}></Label>
      <InputElement element={"input"} type={"radio"} name={"route"} className={"route"} id={"fastestRoute"} text={"Nejrychlejší"} defaultChecked={true}></InputElement>
      <InputElement element={"input"} type={"radio"} name={"route"} className={"route"} id={"lowWalkingRoute"} text={"Nejméně pěsí chůze"} defaultChecked={false}></InputElement>
      <Label className={"optionTitle"} text={"Přestupy"}></Label>
      
      <Label className={"transfersLabel"} text={"Maximální počet přestupů"}></Label>
      <select defaultValue="-1" id="numTransfers">
        <option value="-1">Neomezeno</option>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <Label className={"transfersLabel"} text={"Čas na přestup:"}></Label>
      <select defaultValue="10" id="timeToTransfer">
        <option value="5">Alespoň 5 minut</option>
        <option value="10">Alespoň 10 minut</option>
        <option value="15">Alespoň 15 minut</option>
      </select>
      <Label className={"transfersLabel"} text={"Maximální vzdálenost mezi přestupy:"}></Label>
      <select defaultValue="100m" id="transferDistance">
        <option value="100">100 m</option>
        <option value="200">200 m</option>
        <option value="300">300 m</option>
      </select>
    </div>
    )
  }
}

export default ParametersPID;
