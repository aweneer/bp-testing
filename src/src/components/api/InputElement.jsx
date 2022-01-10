import React from "react";

class InputElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    //refs
    //bindings
    this.isDefaultChecked = this.isDefaultChecked.bind(this);
  }

  isDefaultChecked() {
    if (this.props.defaultChecked === true) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
      <div>
        <label>
          <input
            type={this.props.type}
            name={this.props.name}
            className={this.props.className}
            id={this.props.id}
            defaultChecked = {this.isDefaultChecked()}
          ></input>
          {this.props.text}
      </label>
      </div>
    )
  }
}

export default InputElement;
