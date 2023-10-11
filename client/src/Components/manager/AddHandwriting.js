import React, { useState, useEffect, useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import ChoosePath from './ChoosePathHanwiting'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import axios from 'axios';
import 'primeflex/primeflex.css';
import AddingSteps from './AddingSteps';
import Tree from '../Tree';
import '../../App.css';
import DropZone from './Racheli';

export default function CustomUploadDemo(props) {
    const [navig, setNavig] = useState(null);
    const [level, setLevel] = useState(0);
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [path, setPath] = useState("💕");
    const [description, setDescription] = useState("");
    const [flag, setFlag] = useState(true);
    const [base64data, setBase64data] = useState("🤢");

    const addHandwriting = (x) => {
        axios.post(`http://localhost:8000/handwritings`, x)
            .then(function (response) {
                console.log(response);
                setLevel(3)
            })
            .catch(function (error) {
                console.log("😒", error);
                setLevel(4)
            })
            .finally(function () {
            });
    }

    const footerContent = (
        <div>
            <Button label="לא" icon="pi pi-times" onClick={() => { setLevel(1); setVisible(false) }} className="p-button-text" />
            <Button label="כן" icon="pi pi-check" onClick={() => { setLevel(2); setVisible(false) }} autoFocus />
        </div>
    );

    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

        reader.readAsDataURL(blob);

        reader.onloadend = function () {
            //pdf
            setBase64data(reader.result);
            setLevel(1);
        };
    };
/////////////////
const [updateAttched, setUpdateAttched] = useState([]);

    return (
        props.userAuthorization == 2 ?
            <>
                <AddingSteps level={level}></AddingSteps>

                {level == 0 &&
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h1>לחץ לבחירת קובץ, הכתב יתומלל באופן אוטומטי לקובץ נפרד</h1>
                        {/* <FileUpload className="flex-column" mode="basic" name="demo[]" url="/api/upload" accept="image/*,application/pdf" customUpload uploadHandler={customBase64Uploader} /> */}
                        <DropZone setUpdateAttched={setUpdateAttched}></DropZone>
                        {updateAttched.length > 0 && updateAttched.map((item) => {
                            setLevel(1);
                            return <>
                                <h1>{item.fileName}!!</h1>
                                </>
                        })}
                    </div>}
                {level == 1 &&
                    <div className="card flex justify-content-center flex-column align-items-center">
                        <h1>בחר מיקום לשמירת התקייה (לתיקייה במיקום התחילי לחץ על הריק...🤐)</h1>
                        <ChoosePath userAuthorization={props.userAuthorization} setDescription={setDescription} setNavig={setNavig} setPath={setPath} setVisible={setVisible} />
                    </div>}
                {console.log("props.navig: ", navig)}
                <div className="card flex justify-content-center flex-column flex align-items-center">
                    <Dialog header="אישור הנתיב" visible={visible} style={{ width: '50vw' }} onHide={() => { setLevel(1); console.log("pp"); setVisible(false) }} footer={footerContent}>
                        <p className="m-0">{path}</p>
                    </Dialog>
                </div>
                {level == 2 &&
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h1 className='mx-6rem' >הוסף שם לתקייה</h1><br></br>
                        <InputText className='mx-6rem' value={description} onChange={(e) => { setDescription(e.target.value); console.log("base64data", base64data); }} />
                        <Button label="אישור" onClick={() => { addHandwriting({ "image_path": base64data, "transcription": "", "description": description, "path_id": navig }) }} />
                    </div>}
                {level == 3 &&
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h2 className='mx-6rem' >התקייה נוספה בהצלחה!</h2>
                        <Tree level={level} flag={flag} setFlag={setFlag}></Tree>

                        <h2 className='mx-6rem' >להוספת תקייה נוספת לחץ על הכפתור</h2>
                        <Button onClick={() => window.location.reload()} rounded icon={"pi pi-plus"}></Button>

                    </div>}
                    {level == 4 &&
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h1 className='mx-6rem' >מתנצלים :|</h1>
                        <h2 className='mx-6rem' >שגיאה בלתי צפוויה!!</h2>
                        <Tree level={level} flag={flag} setFlag={setFlag}></Tree>

                        <h2 className='mx-6rem' >להוספת תקייה נוספת לחץ על הכפתור</h2>
                        <Button onClick={() => window.location.reload()} rounded icon={"pi pi-plus"}></Button>

                    </div>}
            </>
            :
            <>
                <h1>פדיחה! 🤨🤔😵</h1>
                <h3>לא ברור איך הגעת לכאן לכאן אבל-- </h3>
                <b>אין לך הרשאת גישה לעמוד זה.</b>
            </>
    )
}
