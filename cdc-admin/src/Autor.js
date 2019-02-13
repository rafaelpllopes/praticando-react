import React, { Component } from 'react';

import { PubSub } from 'pubsub-js';

import { InputCustonizado } from './components/InputCustonizado';
import { SubmitButton } from './components/SubmitButton';
import { TratadorErros } from './TratadorErros';

const API = "http://cdc-react.herokuapp.com/api/autores";

export class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = { nome: '', email: '', senha: '' };
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
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
            .then(novaLista => {
                if (novaLista.status === 200) {
                    PubSub.publish('atualiza-lista-autores', novaLista);
                    this.setState({ nome: '', email: '', senha: '' });
                    PubSub.publish("limpa-erros", {});
                } else {
                    new TratadorErros().publicaErros(novaLista);
                }
            })
            .catch(console.error);
    }

    setNome(evento) {
        this.setState({ nome: evento.target.value });
    }

    setEmail(evento) {
        this.setState({ email: evento.target.value });
    }

    setSenha(evento) {
        this.setState({ senha: evento.target.value });
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind()} method="post">
                    <InputCustonizado id="nome" name="nome" label="Nome" type="text" value={this.state.nome} onChange={this.setNome} />
                    <InputCustonizado id="email" name="email" label="Email" type="email" value={this.state.email} onChange={this.setEmail} />
                    <InputCustonizado id="senha" name="senha" label="Senha" type="password" value={this.state.senha} onChange={this.setSenha} />
                    <SubmitButton text="Gravar" />
                </form>

            </div>
        );
    }
}

export class TabelaAutores extends Component {

    render() {
        return (
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
                            this.props.lista.map(autor => <tr>
                                <td>{autor.nome}</td>
                                <td>{autor.email}</td>
                            </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = { lista: [] };
    }

    componentWillMount() {
        fetch(API)
            .then(res => res.json())
            .then(autores => this.setState({ lista: autores }))
            .catch(console.log);

        PubSub.subscribe('atualiza-lista-autores', (topico, novaLista) => {
            this.setState({ lista: novaLista })
        });
    }

    render() {
        return (
            <div className="content" id="content">
                <h2>Autores</h2>
                <FormularioAutor />
                <TabelaAutores lista={this.state.lista} />
            </div>
        );
    }
}