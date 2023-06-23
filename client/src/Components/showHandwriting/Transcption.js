import React, { useState } from 'react';
import { Chips } from "primereact/chips";
import { Button } from 'primereact/button';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { ScrollTop } from 'primereact/scrolltop';
import '../../App.css';
function Transcption(props) {

    const [content, setContent] = useState(props.text);
    const [wordToChange, setWordToChange] = useState("");
    const [value, setValue] = useState("");
    const [start, setStart] = useState(0);
    const [open, setOpen] = useState(false);


    const addCoorrection = () => {
        let a = localStorage.getItem("user");
        if (a) {
            console.log("start", start);
            const x = { handwriting_id: props.handwritingId, word_index: start, new_word: value, original_word: wordToChange, user_id: JSON.parse(a).id };
            axios.post(`http://localhost:8000/handwritings/corrections`, x)
                .then(function (response) {
                    props.show()
                    setValue("");
                })
                .catch(function (error) {
                    console.log("😒", error);
                })
                .finally(function () {
                });
        }
        else {
            <div>רק משתמש רשום יכול להעלות הצעות לתיקון</div>
        }
    }

    function handleSelectionChange(props) {
        const selection = window.getSelection();
        var start = selection.anchorOffset;
        var end = selection.focusOffset;
        start > end ? setStart(end) : setStart(start);
        const selectedText = selection.toString();
        setWordToChange(selectedText.trim());
    }

    return (
        <div className="flex flex-column align-items-center ">
            <div style={{ width: '97%', height: '400px', 'overflow': 'auto' }}
                onMouseUp={handleSelectionChange}
                dangerouslySetInnerHTML={{ __html: content }}
            />
            <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />

            <Divider align="left">
                <div className="inline-flex align-items-center">
                    <i className="pi pi-file-edit ml-2"></i>
                    <b>תיקון כתב היד  </b>
                </div>
            </Divider>

            <div>
                <p>ע"מ לתקן את כתב היד יש לסמן את המילים הרצויות </p>

                {wordToChange != "" &&
                    <>
                        <p>המילים שנבחרו:</p>
                        <div class="border-500 border-black-500 w-12rem h-3rem m-2 surface-overlay font-bold flex align-items-center justify-content-center">{wordToChange}</div>
                        <div className="flex-column">
                            <p>המילה החדשה:</p>

                            <div>
                                <InputText value={value} onChange={(e) => setValue(e.target.value)} />
                                <Button icon="pi pi-check" iconPos="right" onClick={() => { addCoorrection(); setOpen(false); setWordToChange("") }} />
                            </div>
                        </div>
                    </>}
            </div>
        </div>
    );
}
export default Transcption;