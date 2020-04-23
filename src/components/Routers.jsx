import React from 'react'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from '../views/home/Home';
import NavBar from '../components/Navbar';
import ListCategory from '../views/category/ListCategory';
import ListCourse from '../views/course/ListCourse';
import AddEditCategory from '../views/category/AddEditCategory';
import AddEditCourse from '../views/course/AddEditCourse';
import Login from '../views/login/Login';


const router = () =>

    <BrowserRouter>
        <NavBar />
        <div className="container-fluid pl-5 pr-5 pt-1">
            <Switch>
                <Route path="/categories/:message?" exact component={ListCategory} />
                <Route path="/category/:id?" exact component={AddEditCategory} />
                <Route path="/courses/:message?" exact component={ListCourse} />
                <Route path="/course/:id?" exact component={AddEditCourse} />
                <Route path="/home" exact component={Home} />
                <Route path="/" exact component={Login} />
            </Switch>
        </div>
    </BrowserRouter>



export default router