import React from "react";

class Label extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    //refs
    //bindings
  }


  render() {
    return (
      <label className={this.props.className} title={this.props.title}>{this.props.text}</label>
    )
  }
}

export default Label;
