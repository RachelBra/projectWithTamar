import React, { useRef } from "react";
import { useForm, Controller } from 'react-hook-form';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
// import { Toast } from 'primereact/toast';
import axios from 'axios';
import '../../App.css';
const Contact = (props) => {

    const addPerush = (perush) => {
        axios.post(`http://localhost:8000/handwritings/peirushim`, perush)
            .then(function (response) {
                props.show("נקלט במערכת! תודה");
            })
            .catch(function (error) {
                console.log("😒", error);
            })
            .finally(function () {
            });
    }

    const toast = useRef(null);

    // const show = (flag) => {
    //     flag? toast.current.show({ severity: 'success', summary: 'הפירוש נקלט בהצלחה', detail: 'הפירוש יפוררסם לאחר אישור מנהל' }):toast.current.show({ severity: 'success', summary: 'הפירוש לא נקלט', detail: 'בעיה בלתי צפויה מנעה את העלאת הפירוש' })
    // };

    const renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
            </span>
        );
    };

    const header = renderHeader();

    const defaultValues = {
        blog: ''
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        if(JSON.parse(localStorage.getItem("user"))?.id == undefined)
            alert("לשליחת פחירוש יש להתחבר")
        
        const perush = {
            handwriting_id: props.handwritingId,
            user_id: JSON.parse(localStorage.getItem("user")).id,
            peirush_text: data.blog
        }
        console.log('JSON.parse(localStorage.getItem("user")).user_id', JSON.parse(localStorage.getItem("user")).user_id, "props.handwritingId", props.handwritingId);
        addPerush(perush)
        props.setOpen(0);
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (
        // <>
        // {props.userId?

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* <Toast ref={toast} /> */}
                <Controller
                    name="blog"
                    control={control}
                    rules={{ required: 'אין תוכן לשליחה.' }}
                    render={({ field }) => <Editor id={field.name} name="blog" value={field.value} headerTemplate={header} onTextChange={(e) => field.onChange(e.textValue)} style={{ height: '320px' }} />}
                />
                <div className="flex flex-wrap justify-content-between align-items-left gap-3 mt-3">
                    {getFormErrorMessage('blog')}
                    <Button onClick={()=>addPerush} type="submit" label="שלח פירוש" icon="pi pi-check"/>
                    <Button style={{direction:"rtl"}} onClick={()=>props.setOpen(false)} label="ביטול" className="p-button-text" icon="pi pi-times" />
                </div>
            </form>

    //     :
    //     <>
    //     <h1>רק משתמש רשום יכול לשלוח הודעות למערכת</h1>
    //     <h2>   להרשמה <NavLink to={"/Register"}>לחץ כאן</NavLink></h2></>
    // }</>
    )
}
export default Contact;