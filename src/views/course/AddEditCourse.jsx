import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { Growl } from 'primereact/growl'

import axios from "../../utils/httpClient"
import Card from '../../components/Card'
import FormGroup from '../../components/FormGroup'
import SelectMenu from '../../components/SelectMenu'


class AddEditCourse extends Component {

    state = {
        course: {
            id: '',
            description: '',
            startDate: '',
            endDate: '',
            numberOfStudents: '',
            category: {
                id: ''
            },
            category_id: ''
        },
        categories: [],

        config: {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    }

    handleChange = (event) => {
        const value = event.target.value
        const attribute = event.target.name

        this.setState(({ course }) => ({
            course: {
                ...course,
                [attribute]: value
            }
        }))
    }


    handleCancel = (message) => {
        this.props.history.push(`/courses/${message}`)
    }


    handleNewCategory = () => {
        this.props.history.push('/category')
    }


    handleSubmitSave = (event) => {

        event.preventDefault()

        axios.post("/courses", this.state.course, this.state.config)
            .then(() => {
                this.handleCancel('Novo agendamento de curso adicionado com sucesso')
            })
            .catch(({ response }) => {

                if (response.data.status >= 400 && response.data.status < 500) {
                    let errors = response.data.errors

                    errors.forEach((element) => {
                        this.growl.show({ severity: 'error', summary: element.message })
                    })

                } else {
                    this.growl.show({ severity: 'error', summary: response.data.message })
                }
            })
    }


    handleCancel = (message) => {
        this.props.history.push(`/courses/${message}`)
    }


    handleSubmitUpdate = (event) => {
        event.preventDefault()

        axios.put(`/courses/${this.state.course.id}`, this.state.course, this.state.config)
            .then(() => {
                this.handleCancel('Alteração de agendamento de curso realizado com sucesso')
            })
            .catch(({ response }) => {

                if (response.data.status >= 400 && response.data.status < 500) {
                    let errors = response.data.errors

                    errors.forEach((element) => {
                        this.growl.show({ severity: 'error', summary: element.message })
                    })

                } else {
                    this.growl.show({ severity: 'error', summary: response.data.message })
                }
            })
    }

    componentDidMount() {

        if (localStorage.getItem('token') === null) {
            this.props.history.push('/')
        }

        this.retrieveCategories()

        const params = this.props.match.params

        if (params.id) {
            axios.get(`/courses/${params.id}`, this.state.config)
                .then(({ data }) => {
                    this.setState({
                        course: data
                    })
                })
                .catch(error => {
                    this.growl.show({ severity: 'error', summary: 'Agendamento de curso não encontrado!' })
                })
        }

    }


    retrieveCategories() {

        axios.get('/categories', this.state.config)
            .then(({ data }) =>
                this.setState({
                    categories: data
                })
            )
    }


    selectListCategories() {

        const { categories } = this.state

        let categoryList = [{ label: 'Selecione...', value: '' }]

        categories.map(category => categoryList.push({
            label: `${category.id}  --  ${category.description}`, value: category.id
        }))

        return categoryList
    }


    render() {

        const { id, description, startDate, endDate, numberOfStudents, category_id } = this.state.course
        return (
            <Card title={id ? 'Alterar Agendamento de Curso' : 'Agendamento de Novo Curso'}>

                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputDescription" label="Descrição: *">
                            <input id="inputDescription" type="text" name="description"
                                value={description}
                                className="form-control"
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>

                    <div className="col-md-6">

                        <FormGroup id="inputStartDate" label="Data de Inicio: *">
                            <input id="inputStartDate" type="date" name="startDate"
                                value={startDate}
                                className="form-control"
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputNumberOfStudents" label="Qtd de Alunos: *">
                            <input id="inputNumberOfStudents" type="text" name="numberOfStudents"
                                value={numberOfStudents}
                                className="form-control"
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>

                    <div className="col-md-6">
                        <FormGroup id="inputEndDate" label="Data de Conclusão: *">
                            <input id="inputEndDate" type="date" name="endDate"
                                value={endDate}
                                className="form-control"
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">

                    <div className="col-md-4">
                        <FormGroup htmlFor="inputCategory" label="Categoria: *">
                            <SelectMenu className="form-control" name="category_id"
                                listData={this.selectListCategories()}
                                value={category_id}
                                selectedValue={category_id}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-2 align-self-center mt-3">
                        <button onClick={this.handleNewCategory} className="btn btn-md btn-success">
                            <i className="pi pi-plus"></i>Novo</button>
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

export default withRouter(AddEditCourse)