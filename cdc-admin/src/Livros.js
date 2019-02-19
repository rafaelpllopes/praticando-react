import React, { Component } from 'react';

import { PubSub } from 'pubsub-js';

import { InputCustonizado } from './components/InputCustonizado';
import { SubmitButton } from './components/SubmitButton';
import { TratadorErros } from './TratadorErros';

const API = "https://cdc-react.herokuapp.com/api";

export class TabelaLivros extends Component {
    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Preco</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map(livro =>
                                <tr key={livro.id}>
                                    <td>{livro.titulo}</td>
                                    <td>{livro.preco}</td>
                                    <td>{livro.autor.nome}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export class FormularioLivro extends Component {
    constructor() {
        super();
        this.state = { titulo: '', preco: '', autorId: '' };
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
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
                titulo: this.state.titulo,
                preco: this.state.preco,
                autorId: this.state.autorId
            })
        })
            .then(res => res.json())
            .then(novaLista => {
                if (novaLista.status === 200) {
                    PubSub.publish('atualiza-lista-livros', novaLista);
                    this.setState({ titulo: '', preco: '', autorId: '' });
                    PubSub.publish("limpa-erros", {});
                } else {
                    new TratadorErros().publicaErros(novaLista);
                }
            })
            .catch(console.error);
    }

    setTitulo(evento) {
        this.setState({ titulo: evento.target.value });
    }

    setPreco(evento) {
        this.setState({ preco: evento.target.value });
    }

    setAutorId(evento) {
        this.setState({ autorId: evento.target.value });
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind()} method="post">
                    <InputCustonizado id="titulo" name="titulo" label="Titulo" type="text" value={this.state.titulo} onChange={this.setTitulo} />
                    <InputCustonizado id="preco" name="preco" label="Preço" type="text" value={this.state.preco} onChange={this.setPreco} />
                    <div className="pure-control-group">
                        <label htmlFor="autorId">{}</label>
                        <select value={this.state.autorId} name="autorId" onChange="{this.setAutorId}">
                            <option value="">Selecione um autor</option>
                            {
                                this.props.autores.map(autor =>
                                    <option value={autor.id}>{autor.nome}</option>
                                )
                            }

                            <option value="">Selecione um autor</option>
                        </select>
                    </div>
                    <SubmitButton text="Gravar" />
                </form>
            </div>
        );
    }
}

export default class LivroBox extends Component {
    constructor() {
        super();
        this.state = { lista: [], autores: [] };
    }

    componentWillMount() {

        fetch(`${API}/autores`)
            .then(res => res.json())
            .then(autores => this.setState({ lista: autores }))
            .catch(console.log);

        /*fetch(API)
            .then(res => res.json())
            .then(livros => this.setState({ lista: livros }))
            .catch(console.log);*/

        PubSub.subscribe('atualiza-lista-livros', (topico, novaLista) => {
            this.setState({ lista: novaLista })
        });
    }

    render() {
        return (
            <div className="content" id="content">
                <h2>Livros</h2>
                <FormularioLivro />
                <TabelaLivros lista={this.state.lista} />
            </div>
        );
    }
}