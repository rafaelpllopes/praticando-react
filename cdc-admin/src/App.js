import React, { Component } from 'react';
import { InputCustonizado } from './components/InputCustonizado';
import { SubmitButton } from './components/SubmitButton';

import 'purecss/build/pure.css';
import './css/side-menu.css';

const API = "http://cdc-react.herokuapp.com/api/autores";

class App extends Component {

  constructor() {
    super();
    this.state = { lista: [], nome: '', email: '', senha: '' };
    this.enviaForm = this.enviaForm.bind(this);
    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
  }

  componentWillMount() {
    fetch(API)
      .then(res => res.json())
      .then(autores => this.setState({ lista: autores }))
      .catch(console.log);
  }

  enviaForm(evento) {
    evento.preventDefault();
    fetch(API, { 
      method: 'post',
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Data-Type': 'json'
      }),
      body: JSON.stringify({
        nome: this.state.nome,
        email: this.state.email,
        senha: this.state.senha
      })
    })
      .then(res => res.json())
      .then(autores => this.setState({ lista: autores }))
      .catch(console.error);
  }

  setNome(evento) {
    this.setState({nome:evento.target.value});
  }

  setEmail(evento) {
    this.setState({email:evento.target.value});
  }

  setSenha(evento) {
    this.setState({senha:evento.target.value});
  }

  render() {
    return (
      <div id="layout">

        <a href="#menu" id="menuLink" className="menu-link">
          <span></span>
        </a>

        <div id="menu">
          <div className="pure-menu">
            <a className="pure-menu-heading" href="/home">Company</a>

            <ul className="pure-menu-list">
              <li className="pure-menu-item"><a href="/home" className="pure-menu-link">Home</a></li>
              <li className="pure-menu-item"><a href="/home" className="pure-menu-link">Autor</a></li>
              <li className="pure-menu-item"><a href="/home" className="pure-menu-link">Livro</a></li>
            </ul>
          </div>
        </div>

        <div id="main">
          <div className="header">
            <h1>Cadastro de Autores</h1>
          </div>
          <div className="content" id="content">
            <div className="pure-form pure-form-aligned">
              <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind()} method="post">
                <InputCustonizado id="nome" name="nome" label="Nome" type="text" value={this.state.nome} onChange={this.setNome} />
                <InputCustonizado id="email" name="email" label="Email" type="email" value={this.state.email} onChange={this.setEmail} />
                <InputCustonizado id="senha" name="senha" label="Senha" type="password" value={this.state.senha} onChange={this.setSenha} />
                <SubmitButton text="Gravar" />
              </form>

            </div>
            <div>
              <table className="pure-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>email</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.lista.map(autor => <tr>
                      <td>{autor.nome}</td>
                      <td>{autor.email}</td>
                    </tr>
                    )
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
