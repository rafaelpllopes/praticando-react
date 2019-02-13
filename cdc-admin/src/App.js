import React, { Component } from 'react';

import 'purecss/build/pure.css';
import './css/side-menu.css';
import { Link } from 'react-router-dom';

export default class App extends Component {

  render() {
    return (
      <div id="layout">

        <a href="#menu" id="menuLink" className="menu-link">
          <span></span>
        </a>

        <div id="menu">
          <div className="pure-menu">
            <Link className="pure-menu-heading" to="/home">Company</Link>

            <ul className="pure-menu-list">
              <li className="pure-menu-item"><Link to="/" className="pure-menu-link">Home</Link></li>
              <li className="pure-menu-item"><Link to="/autor" className="pure-menu-link">Autor</Link></li>
              <li className="pure-menu-item"><Link to="/livro" className="pure-menu-link">Livro</Link></li>
            </ul>
          </div>
        </div>
        <div id="main">
          <div className="header">
            <h1>Bem-vindo ao sistema</h1>
          </div>
          <div className="content" id="content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
