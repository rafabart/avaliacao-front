import React from 'react'


const formGroup = (props) =>

    <div className="form-group">
        <label htmlFor={props.htmlFor}>{props.label}</label>
        {props.children}
    </div>

export default formGroup