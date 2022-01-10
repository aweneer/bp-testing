import React from "react";
import Label from "./Label";
import InputElement from "./InputElement";
//import SelectElement from "./SelectElement";

class AccessibilityPID extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    //refs
    //bindings
  }

  render() {
    return (
      <div className="optionsSettings" id="options-box-access" display="none">
        <Label className={"optionTitle"} text={"Jsem cestující"}></Label>
        <InputElement element={"input"} type={"radio"} name={"transportRequest"} className={"traveler_type"} id={"standard"} text={"Bez dalších potřeb"} defaultChecked={true}></InputElement>
        <InputElement element={"input"} type={"radio"} name={"transportRequest"} className={"traveler_type"} id={"slow_walker"} text={"S kočárkem"} defaultChecked={false}></InputElement>
        <InputElement element={"input"} type={"radio"} name={"transportRequest"} className={"traveler_type"} id={"wheelchair"} text={"S vozíčkem"} defaultChecked={false}></InputElement>
        <InputElement element={"input"} type={"radio"} name={"transportRequest"} className={"traveler_type"} id={"luggage"} text={"S těžkými zavazadly"} defaultChecked={false}></InputElement>
        <InputElement element={"input"} type={"radio"} name={"transportRequest"} className={"traveler_type"} id={"cyclist"} text={"S kolem do MHD"} defaultChecked={false}></InputElement>
      </div>
    );
  }
}

export default AccessibilityPID;
