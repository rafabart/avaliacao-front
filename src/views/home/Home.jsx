import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import Card from '../../components/Card'


class Home extends Component {


    componentDidMount() {
        if (localStorage.getItem('token') === null) {
            this.props.history.push('/')
        }
    }

    
    render() {
        return (
            <Card title="Seja bem-vindo!">
                <h2>POC Agendamento de cursos</h2>
            </Card>
        )
    }

}

export default withRouter(Home)