import React, { useState, useRef } from 'react';
import { Steps } from 'primereact/steps';
import '../../App.css';
const AddingSteps = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);
    let items = [];
    props.steps.forEach(element => {
        items.push({label:element})
    });
    // const items = [
    //     {
    //         label: 'בחירת קובץ'
    //     },
    //     {
    //         label: 'בחירת מיקום קובץ'
    //     },
    //     {
    //         label: 'הוספת תיאור'
    //     },
    //     {
    //         label: 'אישור ושמירה'
    //     }
    // ];
    console.log(items);

    return (
        <div className="card">
            <Steps model={items} activeIndex={props.level} />
        </div>
    )
}
        


export default AddingSteps;