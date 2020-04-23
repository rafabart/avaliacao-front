import React from 'react'


const card = (props) =>

    <div className="card">        
        <h3 className="card-header">{props.title}</h3>
        <div className="card-body">
            {props.children}
        </div>
    </div>


export default card