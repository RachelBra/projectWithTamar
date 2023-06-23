// import React, { useRef } from "react";
import { useForm, Controller } from 'react-hook-form';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { BlockUI } from 'primereact/blockui';
import { Panel } from 'primereact/panel';
import { Dialog } from 'primereact/dialog';
import { Fieldset } from 'primereact/fieldset';
import '../../App.css';

const Peirush = () => {
    const [visible, setVisible] = useState(false);
    const [kind, setKind] = useState("");
    const [id, setId] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();
    const peirushim = location?.state?.peirushim;

    const deletePerush = () => {
        axios.delete(`http://localhost:8000/approvals/peirushim/${id}`)
            .then(function (response) {
                console.log("response.data", response.data);
                navigate("/Approvals/rb");

            })
            .catch(function (error) {
                console.log("💚🖤");
            })
            .finally(function () {
            });
    }
    const confirmPerush = () => {
        setKind("");
        axios.put(`http://localhost:8000/approvals/peirushim/${id}`)
            .then(function (response) {
                console.log("response.data", response.data);
                navigate("/Approvals/rb");
            })
            .catch(function (error) {
                console.log("💚🖤");
            })
            .finally(function () {
            });
    }

    const showPerush = () => {
        var prsh = [];
        console.log("peirushim", peirushim);

        for (let index = peirushim.length - 1; index >= 0; index--) {
            prsh.push(
                <Fieldset style={{ direction: "rtl" }} className='mt-3' legend={`הערה ${index + 1} `}>
                    <p className="m-0">
                        {peirushim[index].peirush_text}
                    </p>
                    {peirushim[index].permission == 0 &&
                        <Button className='m-1' icon="pi pi-check " severity="success" rounded  outlined onClick={(e) => { setKind(e.target.innerHTML); setVisible(true); setId(peirushim[index].id); console.log("0000000000000", peirushim[index].id); }} />}
                    <Button className='m-1'  icon="pi pi-times "  severity="danger" rounded outlined onClick={() => { setVisible(true); setId(peirushim[index].id) }} />
                </Fieldset>
            )
        }
        return prsh;
    }
    const footerContent = (
        kind == 'אישור' ?
            <div>
                <Button label="לא" severity="secondary" icon="pi pi-times" onClick={() => { setVisible(false); setKind(""); }} className="p-button-text" />
                <Button label="כן" severity="secondary" icon="pi pi-check" onClick={() => { setVisible(false); confirmPerush() }} autoFocus />
            </div>
            :
            <div>
                <Button label="לא" icon="pi pi-times" severity="secondary" onClick={() => { setVisible(false) }} className="p-button-text" />
                <Button label="כן" icon="pi pi-check" severity="secondary" onClick={() => { setVisible(false); deletePerush() }} autoFocus />
            </div>
    );

    return (
        <>
            {showPerush()}
            {
                kind == 'אישור' ?
                    <Dialog header="אישור פירוש" visible={visible} style={{ width: '50vw' }} onHide={() => { setVisible(false) }} footer={footerContent}>
                        <p className="m-0">בלחיצה על אישור הפירוש יראה לכלל המשתמשים  </p>
                    </Dialog>
                    :
                    <Dialog header="אישור מחיקת םירוש" visible={visible} style={{ width: '50vw' }} onHide={() => { setVisible(false) }} footer={footerContent}>
                        <p className="m-0">בלחיצה על אישור ההערה תמחק  </p>
                    </Dialog>
            }
        </>
    );

}
export default Peirush;