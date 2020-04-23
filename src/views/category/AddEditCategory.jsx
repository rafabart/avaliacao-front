import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { Growl } from 'primereact/growl'

import axios from "../../utils/httpClient"
import Card from '../../components/Card'
import FormGroup from '../../components/FormGroup'


class AddEditCategory extends Component {

    state = {
        category: {
            id: '',
            description: ''
        },

        config: {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    }


    handleChange = (event) => {
        const value = event.target.value
        const attribute = event.target.name

        this.setState(({ category }) => ({
            category: {
                ...category,
                [attribute]: value
            }
        }))
    }


    handleCancel = (message) => {
        this.props.history.push(`/categories/${message}`)
    }


    handleSubmitSave = (event) => {
        event.preventDefault()

        axios.post("/categories", this.state.category, this.state.config)
            .then(() => {
                this.handleCancel('Nova categoria adicionado com sucesso')
            })
            .catch(({ response }) => {

                let errors = response.data.errors

                errors.forEach((element) => {
                    this.growl.show({ severity: 'error', summary: element.message })
                })
            })
    }


    handleSubmitUpdate = (event) => {
        event.preventDefault()

        axios.put(`/categories/${this.state.category.id}`, this.state.category, this.state.config)
            .then(() => {
                this.handleCancel('Alteração de categoria realizada com sucesso')
            })
            .catch(({ response }) => {

                let errors = response.data.errors

                errors.forEach((element) => {
                    this.growl.show({ severity: 'error', summary: element.message })
                })
            })
    }


    componentDidMount() {

        if (localStorage.getItem('token') === null) {
            this.props.history.push('/')
        }

        const params = this.props.match.params

        if (params.id) {
            axios.get(`/categories/${params.id}`, this.state.config)
                .then(({ data }) => {
                    this.setState({
                        category: data
                    })
                })
                .catch(error => {
                    this.growl.show({ severity: 'error', summary: 'Categoria não encontrado!' })
                })
        }
    }


    render() {

        const { id, description } = this.state.category

        return (
            <Card title={id ? 'Alterar Categoria' : 'Cadastro de Categoria'}>

                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputDescription" label="Descrição: *">
                            <input id="inputDescription" type="text" name="description"
                                value={description}
                                className="form-control"
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">

                        {/* Verifica qual botão renderizar, 'Salvar' ou  'Editar' */}
                        {
                            id ?
                                (
                                    <button className="btn btn-sm btn-success mr-3" onClick={this.handleSubmitUpdate}>
                                        <i className="pi pi-refresh"></i>Atualizar</button>
                                ) : (
                                    <button className="btn btn-sm btn-success mr-3" onClick={this.handleSubmitSave}>
                                        <i className="pi pi-save"></i>Salvar</button>
                                )
                        }

                        <button className="btn btn-sm btn-danger" onClick={() => this.handleCancel("cancel")}>
                            <i className="pi pi-times"></i>Cancelar</button>
                    </div>
                </div>

                <Growl ref={(el) => this.growl = el} />

            </Card>
        )
    }
}

export default withRouter(AddEditCategory)