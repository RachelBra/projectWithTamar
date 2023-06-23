import React from 'react'
import { Image } from 'primereact/image';
import imHome from '../images/Yehoshua_Leib_Diskin.jpg'
import '../App.css';

const Home = () => {
    return (
        <>
            <div className="card w-90% flex justify-content-center">
                <Image src={imHome} alt="Image" width="400rem" />
            </div>
        </>
    )
}

export default Home