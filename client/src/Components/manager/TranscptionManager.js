import React, { useState, useEffect } from 'react';
import { Chips } from "primereact/chips";
import { Button } from 'primereact/button';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Navigate, useLocation } from 'react-router-dom';
import { ScrollPanel } from 'primereact/scrollpanel';
import { ListBox } from 'primereact/listbox';
import { Dialog } from 'primereact/dialog';
import {useNavigate } from "react-router-dom"
import '../../App.css';
function Transcption(props) {

    const [content, setContent] = useState(props.text);
    const [id, setId] = useState("");
    const [corr, setCorr] = useState([{ name: "pppp" }]);
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [originalWord, setOriginalWord] = useState("");
    const [newWord, setNewWord] = useState("");
    const [indexWord, setIndexWord] = useState(0);
    const [help, setHelp] = useState(false);
    const [key, setKey] = useState(0);

    const location = useLocation();
    const corrections = location.state.corrections;

    const navigate = useNavigate();        

    useEffect(() => {
        const tmp = corrections?.find(e => e.id == id)
        setOriginalWord(tmp?.original_word);
        setNewWord(tmp?.new_word)
        setIndexWord(tmp?.word_index);
    }, [id, originalWord])

    //מערך של כל האינדקסים במילה
    const words = props.text.split('');

    //רשימת התיקונים לכתב היד

    // const setHelp2 = location?.state?.setHelp;

    let chars = [];
    //מציאת האינדקסים אותם יש לסמן - עליהם יש תיקונים
    corrections?.forEach(element => {
        for (let i = element.word_index; i < element.word_index + element.original_word.length; i++){
             chars.push(i);
        }
    });

    //מציאת האינדקסים המתאימים למילה הספציפית שנבחרה במסך
    const showCorrections = (e) => {
        let tmp = [];
        corrections?.forEach(element => { if (element.word_index <= e && element.word_index + element.original_word.length >= e) { tmp.push({ name: element.new_word, code: element.id, original_word: element.original_word, word_index: element.word_index }); } })
        setCorr(tmp);
        setOpen(true);
        setHelp(true);
    }

    const server = (newTr, dlt, arr) => {
        axios.put(`http://localhost:8000/handwritings/transcription/${props.handwritingId}`, { transcription: newTr })
            .then(function (response) {
            })
            .catch(function (error) {
            })
            .finally(function () {
            });

        axios.post(`http://localhost:8000/approvals/corrections`,{ corrections: dlt })
            .then(function (response) {     
            })
            .catch(function (error) {
            })
            .finally(function () {
            });

            axios.put(`http://localhost:8000/approvals/updateCorr`, { arr: arr })
            .then(function (response) {
                navigate(`/Approvals/${"rb"}`);            
            })
            .catch(function (error) {
            })
            .finally(function () {
            });
    }

    //עידכון כתב היד ועדכון האינדקסים המסומנים
    const update = () => {
        const newTr = `${content.slice(0, indexWord)}${newWord}${content.slice(indexWord + originalWord.length, -1)}`;
        var difference =  newWord.length - originalWord.length;
        let arr =[];
        corrections.forEach(element => {
            if (element.word_index > indexWord) 
                arr.push({
                    i: element.id,
                    word_index: element.word_index+difference
                })
        });
        const dlt = corr.map(e => e.code);
        server(newTr, dlt, arr);
    }

   const footerContent = (
        <div>
            <Button label="לא" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="כן" icon="pi pi-check" onClick={() => { update(); setVisible(false);}} autoFocus />
        </div>
    );
    return (
        <div >
            <ScrollPanel  onClick={()=> { if(help) {setOpen(false); setHelp(false)}}} style={{ width: '100%', height: '200px' }} className="custombar1">
                <p>
                    {words.map((word, index) => {
                        if (chars.find(e => e == index)) {
                            return (
                                <span onClick={() => showCorrections(index)} key={index} style={{ backgroundColor: 'orange', fontFamily: ['Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'] }}>
                                    {word}
                                </span>);
                        } else {
                            return <span key={index}>{word}</span>;
                        }
                    })}
                </p>
            </ScrollPanel>

            {open && <ListBox onClick={(e) => setVisible(true)} onChange={(e) => setId(e.value.code)} options={corr} optionLabel="name" className="w-full md:w-14rem" />}
            <Dialog header="אישור הנתיב" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent}>
                <p className="m-0">בלחיצה על אישור הקובץ יתעדכן </p>
                <p className="m-0">וכל שאר ההצעות על המילה הזו ימחקו </p>
                <p className="m-0"> </p>
                <p className="m-0"> תרצה להחילף את המילה:</p>
                <p className="m-0 "> {originalWord}</p>
                <p className="m-0"> במילה:</p>
                <p className="m-0">{newWord}</p>
            </Dialog>
        </div>
    );
}
export default Transcption;

