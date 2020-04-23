import React from 'react'


export default function SelectMenu(props) {

    const { listData } = props

    let options = listData.map((option, index) => {
        return (
            <option key={index} value={option.value}>{option.label} </option>
        )
    })


    return (
        <select value={props.selectedValue} className={props.className} name={props.name} onChange={props.onChange}>
            {options}
        </select>
    )
}
