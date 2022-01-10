import React from "react";

/**
 * Komponenta pro interakci s jednotlivými nastaveními parametrů ve formulářovém zadávání
 * Jde o komponentu, která skrývá či odkrývá jednotlivá okna parametrů.
 */
class OptionSelect extends React.Component {
  constructor(props) {
    super(props);
    this.handleAccess = this.handleAccess.bind(this);
    this.handleParameters = this.handleParameters.bind(this);
    this.handleTransport = this.handleTransport.bind(this);
  }

  // Interakce s HTML prvkem obsahujícím základní parametry
  handleParameters(e) {
    e.preventDefault();
    var optionBox = document.getElementsByClassName("options-box");
    if (optionBox[0].children[0].style.display === "none") {
      optionBox[0].children[0].style.display = "block";
      e.target.setAttribute("optionactive", "true");
      optionBox[0].children[0].setAttribute("optionactive","true");
      document.getElementsByClassName("options")[0].children[1].setAttribute("optionactive", "false");
      document.getElementsByClassName("options")[0].children[2].setAttribute("optionactive", "false");
    } else {
      optionBox[0].children[0].style.display = "none";
      e.target.setAttribute("optionactive", "false");
      optionBox[0].children[0].setAttribute("optionactive","false");
    }
    optionBox[0].children[1].style.display = "none";
    optionBox[0].children[1].setAttribute("optionactive", "false");
    optionBox[0].children[2].style.display = "none";
    optionBox[0].children[2].setAttribute("optionactive", "false");
  }

// Interakce s HTML prvkem obsahujícím dopravní prostředky
  handleTransport(e) {
    e.preventDefault();
    var optionBox = document.getElementsByClassName("options-box");
    optionBox[0].children[0].style.display = "none";
    optionBox[0].children[0].setAttribute("optionactive", "false");
    if (optionBox[0].children[1].style.display === "none") {
      optionBox[0].children[1].style.display = "block";
      e.target.setAttribute("optionactive", "true");
      optionBox[0].children[1].setAttribute("optionactive","true");
      document.getElementsByClassName("options")[0].children[0].setAttribute("optionactive", "false");
      document.getElementsByClassName("options")[0].children[2].setAttribute("optionactive", "false");
    } else {
      optionBox[0].children[1].style.display = "none";
      e.target.setAttribute("optionactive", "false");
      optionBox[0].children[1].setAttribute("optionactive","false");
    }
    optionBox[0].children[2].style.display = "none";
    optionBox[0].children[2].setAttribute("optionactive", "false");
  }

  // Interakce s HTML prvkem obsahujícím přístupnost cestujících
  handleAccess(e) {
    e.preventDefault();
    var optionBox = document.getElementsByClassName("options-box");
    optionBox[0].children[0].style.display = "none";
    optionBox[0].children[0].setAttribute("optionactive", "false");
    optionBox[0].children[1].style.display = "none";
    optionBox[0].children[1].setAttribute("optionactive", "false");
    if (optionBox[0].children[2].style.display === "none") {
      optionBox[0].children[2].style.display = "block";
      e.target.setAttribute("optionactive", "true");
      optionBox[0].children[2].setAttribute("optionactive","true");
      document.getElementsByClassName("options")[0].children[0].setAttribute("optionactive", "false");
      document.getElementsByClassName("options")[0].children[1].setAttribute("optionactive", "false");
    } else {
      optionBox[0].children[2].style.display = "none";
      e.target.setAttribute("optionactive", "false");
      optionBox[0].children[2].setAttribute("optionactive","false");
    }
    
  }

  /**
   * Vykreslení tří tlačítek, se kterými uživatel může interagovat a zobrazovat/skrývat tak samostatné parametry.
   */
  render() {
    return (
      <React.Fragment>
        <button onClick={this.handleParameters} optionactive="false" title="Volba parametrů spoje">Parametry spojení</button>
        <button onClick={this.handleTransport} optionactive="false" title="Výběr dopravních prostředků">Dopravní prostředky</button>
        <button onClick={this.handleAccess} optionactive="false" title="Charakteristika cestujícího">Přístupnost</button>
      </React.Fragment>
    )
  }
}

export default OptionSelect;