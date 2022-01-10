import React from "react";

class SelectApi extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(e) {
    this.props.setApi(e.target.value);
  }

  render() {
    return (
      <React.Fragment>
        <label className="textLabel">Oblast:</label>
        <select
          id="api_select"
          onChange={this.handleOnChange}
          defaultValue="pid"
        >
          <option value="dpmul" disabled={true}>
            DÚK
          </option>
          <option value="pid">PID</option>
          <option value="ids-liberec" disabled={true}>
            IDS Liberec
          </option>
          <option value="mmplanner">Multimodal Planner</option>
        </select>
      </React.Fragment>
    );
  }
}

export default SelectApi;
