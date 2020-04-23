import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Growl } from 'primereact/growl'

import axios from "../../utils/httpClient"
import Card from '../../components/Card'
import FormGroup from '../../components/FormGroup'
import SelectMenu from '../../components/SelectMenu'


class ListCourse extends Component {

    state = {
        course: {
            id: '',
            description: '',
            startDate: '',
            endDate: '',
            numberOfStudents: '',
            category: ''
        },
        courses: [],
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

        this.retrieveCategories()

        const params = this.props.match.params

        if (params.message !== "cancel" && params.message !== undefined) {
            this.growl.show({ severity: 'success', summary: params.message })
        }
        this.findCourses()
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


    handleRemove = () => {

        this.handleCleanInput()

        axios.delete(`/courses/${this.state.course.id}`, this.state.config)
            .then(() => this.findCourses())
    }


    handleCleanInput = () => {

        const courseClear = {
            description: '',
            startDate: '',
            endDate: '',
            numberOfStudents: '',
            category: ''
        }

        this.setState({ showConfirmDialog: false, course: courseClear })
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



    handleNewItem = () => {
        this.props.history.push('/course')
    }


    handleEdit = (id) => {
        this.props.history.push(`/course/${id}`)
    }

    handleShowDialog = (course) => {
        this.setState({ showConfirmDialog: true, course: course })
    }


    findCourses = () => {

        const { description, startDate, endDate, category } = this.state.course

        const params = `/courses/?description=${description}&startDate=${startDate}&endDate=${endDate}&category_id=${category}`;

        axios.get(params, this.state.config)
            .then(({ data }) =>
                this.setState({
                    courses: data
                })
            )
    }



    render() {

        const { description, startDate, endDate, category } = this.state.course

        const footer = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.handleRemove} className="btn btn-sm btn-primary mr-3" />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.handleCleanInput}
                    className="p-button-secondary" />
            </div>
        )

        return (
            <>
                <Card title="Consulta de Cursos Agendados">

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

                        <div className="col-lg-6">
                            <FormGroup htmlFor="inputStartDate" label="Data de inicio:">
                                <input id="inputStartDate" type="date" name="startDate"
                                    value={startDate}
                                    className="form-control"
                                    onChange={this.handleChange} />
                            </FormGroup>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <FormGroup htmlFor="inputCategory" label="Categoria: *">
                                <SelectMenu className="form-control" name="category"
                                    listData={this.selectListCategories()}
                                    value={category}
                                    selectedValue={category}
                                    onChange={this.handleChange} />
                            </FormGroup>
                        </div>

                        <div className="col-lg-6">
                            <FormGroup htmlFor="inputEndDate" label="Data de conclusão:">
                                <input id="inputEndDate" type="date" name="endDate"
                                    value={endDate}
                                    className="form-control"
                                    onChange={this.handleChange} />
                            </FormGroup>

                        </div>
                    </div>

                    <button onClick={this.findCourses} className="btn btn-sm btn-primary mr-3">
                        <i className="pi pi-search"></i>Buscar</button>
                    <button onClick={this.handleNewItem} className="btn btn-sm btn-success">
                        <i className="pi pi-plus"></i>Cadastrar</button>
                </Card >

                <Card>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="bs-component">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Descrição</th>
                                            <th>Data de Inicio</th>
                                            <th>Data de Conclusão</th>
                                            <th>Qtd de inscritos</th>
                                            <th>Categoria</th>
                                            <th className="text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.courses.map(course =>
                                            <tr key={course.id}>

                                                <td>{course.description}</td>
                                                <td>{course.startDate}</td>
                                                <td>{course.endDate}</td>
                                                <td>{course.numberOfStudents}</td>
                                                <td>{course.category.description}</td>
                                                <td className="text-center">
                                                    <button className="btn btn-sm btn-primary mr-2" onClick={() => this.handleEdit(course.id)}>
                                                        Editar
                                                </button>
                                                    <button className="btn btn-sm btn-danger mr-2" onClick={() => this.handleShowDialog(course)}>
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
                            <p>Confirma a exclusão do curso agendado?</p>
                        </Dialog>
                    </div>

                </Card>
            </>
        )

    }

}
export default withRouter(ListCourse)