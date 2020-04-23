import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from "../../utils/httpClient"

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Growl } from 'primereact/growl'

import Card from '../../components/Card'
import FormGroup from '../../components/FormGroup'

class ListCategory extends Component {

    state = {
        category: {
            id: '',
            description: ''
        },
        categories: [],
        showConfirmDialog: false,

        config: {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    }

    componentDidMount() {

        if (localStorage.getItem('token') === null) {
            this.props.history.push('/')
        }

        const params = this.props.match.params

        if (params.message !== "cancel" && params.message !== undefined) {
            this.growl.show({ severity: 'success', summary: params.message })
        }

        this.findCategories()
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


    handleRemove = () => {

        this.handleCleanInput()

        axios.delete(`/categories/${this.state.category.id}`, this.state.config)
            .then(() => this.findCategories())
    }



    handleCleanInput = () => {

        const categoryClear = {
            description: ''
        }

        this.setState({ showConfirmDialog: false, category: categoryClear })
    }



    handleNewCategory = () => {
        this.props.history.push('/category')
    }


    handleEdit = (id) => {
        this.props.history.push(`/category/${id}`)
    }


    handleShowDialog = (category) => {
        this.setState({ showConfirmDialog: true, category: category })
    }


    findCategories = () => {

        let params = `/categories/?description=${this.state.category.description}`

        axios.get(params, this.state.config)
            .then(({ data }) =>
                this.setState({
                    categories: data
                })
            )
    }


    render() {

        const { description } = this.state.category

        const footer = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.handleRemove} className="btn btn-sm btn-primary mr-3" />
                <Button label="Cancelar" icon="pi pi-times" onClick={() => this.handleCleanInput()}
                    className="p-button-secondary" />
            </div>
        )

        return (
            <>
                <Card title="Consulta de Categorias">

                    <div className="row">
                        <div className="col-lg-6">
                            <FormGroup htmlFor="inputDescription" label="Descrição:">
                                <input id="inputDescription" type="text"
                                    name="description"
                                    className="form-control"
                                    placeholder="Digite a descrição"
                                    value={description}
                                    onChange={this.handleChange} />
                            </FormGroup>
                        </div>
                    </div>

                    <button onClick={this.findCategories} className="btn btn-sm btn-primary mr-3">
                        <i className="pi pi-search"></i>Buscar</button>
                    <button onClick={this.handleNewCategory} className="btn btn-sm btn-success">
                        <i className="pi pi-plus"></i>Cadastrar</button>
                </Card >

                <Card>
                    <div className="container">
                        <div className="col-lg-10">
                            <div className="bs-component">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Descrição</th>
                                            <th className="text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.categories.map(category => <tr key={category.id}>
                                            <td>{category.id}</td>
                                            <td>{category.description}</td>
                                            <td  className="text-center">
                                                <button className="btn btn-sm btn-primary mr-2" onClick={() => this.handleEdit(category.id)}>
                                                    Editar
                                                </button>
                                                <button className="btn btn-sm btn-danger mr-2" onClick={() => this.handleShowDialog(category)}>
                                                    Remover
                                                </button>
                                            </td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


                    <Growl ref={(el) => this.growl = el} />


                    <div>
                        <Dialog header="Confirmação"
                            visible={this.state.showConfirmDialog}
                            style={{ width: '50vw' }}
                            footer={footer}
                            modal={true}
                            onHide={() => this.setState({ showConfirmDialog: false })}>
                            <p>Confirma a exclusão desta categoria?</p>
                            <p>Nome: {this.state.category.description}</p>
                        </Dialog>
                    </div>
                </Card>
            </>
        )

    }

}
export default withRouter(ListCategory)