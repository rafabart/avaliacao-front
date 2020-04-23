import React from 'react';
import Card from '../../components/Card'
import FormGroup from '../../components/FormGroup'
import { withRouter } from 'react-router-dom';

import qs from "qs";
import { Growl } from 'primereact/growl';
import axios from "../../utils/httpClient";


class Login extends React.Component {

    state = {
        login: '',
        password: '',
    }

    componentDidMount() {

        if (localStorage.getItem('token') !== null) {
            localStorage.removeItem('token')
        }
    }

    login = (event) => {

        event.preventDefault()

        let body = qs['stringify']({
            username: this.state.login,
            password: this.state.password,
            client: 'front_api',
            grant_type: 'password'
        })

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: 'front_api',
                password: 'front_api_password'
            }
        }


        axios.post("/oauth/token", body, config)

            .then(response => {
                localStorage.setItem("token", response.data.access_token);
                this.props.history.push("/home")
            })

            .catch(({ response }) => {
                this.growl.show({ severity: 'error', summary: "Login e/ou senha inválido(s)" })
            })
    }


    render() {

        return (

            <div className="row" >
                <div className="col-md-6" style={{ position: 'relative', left: '300px' }}>
                    <div className="bs-docs-section">

                        <Card title="Login">

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="bs-component">
                                        <fieldset>

                                            <FormGroup htmlFor="inputLogin" label="Login: *">
                                                <input id="inputLogin" type="login" className="form-control"
                                                    aria-describedby="loginHelp" placeholder="Digite o login"
                                                    value={this.state.login}
                                                    onChange={e => this.setState({ login: e.target.value })} />
                                            </FormGroup>

                                            <FormGroup htmlFor="inputPassword" label="Senha: *">
                                                <input id="inputPassword" type="password" className="form-control"
                                                    placeholder="Digite a senha"
                                                    value={this.state.password}
                                                    onChange={e => this.setState({ password: e.target.value })} />
                                            </FormGroup>

                                            <button onClick={this.login} className="btn btn-success mr-3">
                                                <i className="pi pi-sign-in"></i>Entrar
                                            </button>

                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                            <Growl ref={(el) => this.growl = el} />
                        </Card>

                    </div>
                </div>
            </div>

        )

    }

}


export default withRouter(Login);