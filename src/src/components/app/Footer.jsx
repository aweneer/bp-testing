import React from "react";

/**
 * Footer aplikace
 */
class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
    <footer>Vytvořil <a href="mailto:hlavaj28@fel.cvut.cz">Jan Hlaváč</a> během studia na <a href="https://www.fel.cvut.cz/">FEL ČVUT</a> v rámci závěrečné práce v akademickém roce 2019/2020.</footer>
    )
  }
}

export default Footer;
