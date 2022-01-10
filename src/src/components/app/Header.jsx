import React from "react";
import {Link} from "react-router-dom";

/**
 * Header aplikace.
 * Z headeru se lze navigovat třemi typy vyhledávače (formuláře, kontextového wizardu a normálního form-wizardu)
 */
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    //refs
    //bindings
  }

  render() {
    return (
      <header className="header">
        <label className="headerLabel">Prototyp webového klienta vyhledávače intermodálních dopravích spojení.</label>
        <label className="headerLabel"><Link to="/form">Formulářový typ</Link>/<Link to="/wizard">Contextový wizard</Link>/<Link to="/old_wizard">Klasický wizard</Link></label>
      </header>
    );
  }
}

export default Header;
