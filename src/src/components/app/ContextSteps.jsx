import React from "react";

/**
 * 
 */
class ContextSteps extends React.Component {
  constructor(props) {
    super(props);
    this.handlePreviousStep = this.handlePreviousStep.bind(this);
    this.handleNextStep = this.handleNextStep.bind(this);
    this.handleTransport = this.handleSearch.bind(this);
    this.returnTask = this.returnTask.bind(this);
    this.state = { step: 0, prevBtnDisabled: false, nextBtnDisabled: false };
  }

  componentDidMount() {
    if (this.state.step === 0) {
      this.setState({ prevBtnDisabled: true });
    }
  }

  handlePreviousStep(e) {
    e.preventDefault();
    let currentStep = this.state.step;
    console.log(currentStep);
    if (currentStep !== 0) {
      this.setState({ nextBtnDisabled: false });
      var optionBox = document.getElementsByClassName("options-box");
      optionBox[0].children[currentStep].style.display = "none";
      optionBox[0].children[currentStep - 1].style.display = "block";
      this.setState({ step: currentStep - 1 });
      if (currentStep - 1 === 0) {
        this.setState({ prevBtnDisabled: true });
      }
    } else {
      console.log("Can't go back");
    }
  }

  handleNextStep(e) {
    e.preventDefault();
    let currentStep = this.state.step;
    console.log(currentStep);
    if (currentStep !== 3) {
      this.setState({ prevBtnDisabled: false });
      var optionBox = document.getElementsByClassName("options-box");
      optionBox[0].children[currentStep].style.display = "none";
      optionBox[0].children[currentStep + 1].style.display = "block";
      this.setState({ step: currentStep + 1 });
      if (currentStep + 1 === 3) {
        this.setState({ nextBtnDisabled: true });
      }
    } else {
      console.log("Can't go forth");
    }
  }

  handleSearch(e) {
    e.preventDefault();
  }

  returnTask() {
    switch (this.state.step) {
      case 0:
        return "Zvolte základní hodnoty pro vyhledání Vašeho spoje";
      case 1:
        return "Jaký je účel vaší cesty?";
      case 2:
        return "Vyberte Vámi preferované dopravní prostředky";
      case 3:
        return "Máte nějaké omezení?";
      default:
        return "Chyba v programu";
    }
  }

  render() {
    return (
      <section className="wizardSteps">
        <div className="wizardTasks">
          <label><b>Krok {this.state.step + 1} ze 4</b></label>
          <label>{this.returnTask()}</label>
        </div>
        <table>
          <tbody>
            <tr>
              <td>
                <button
                  onClick={this.handlePreviousStep}
                  id="prev"
                  disabled={this.state.prevBtnDisabled}
                >
                  Předchozí krok
                </button>
              </td>
              <td>
                <button
                  onClick={this.handleNextStep}
                  id="next"
                  disabled={this.state.nextBtnDisabled}
                >
                  Další krok
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    );
  }
}

export default ContextSteps;
