import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import useGetAxiosApi from '../Hooks/useGetAxiosApi';
import { enterHanwriting, createTree } from '../Services/functions';
import { useFetcher, useNavigate } from 'react-router-dom';
import 'primeflex/primeflex.css';
import axios from 'axios';
// import '../App.css';

export default function FilterDemo() {  
          
    const navigate = useNavigate()

    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);

    const getFoldersAndFiles = () => {
        axios.get(`http://localhost:8000/handwritings`
        )
            .then(function (response) {
                const x = createTree(response.data.tree, { id: null });
                const y = enterHanwriting(response.data.handwritings, x, response.data.tree)
                setNodes(y);
                setLoading(false);
            })
            .catch(function (error) {      
            })
            .finally(function () {
            });
    }

    useEffect(() => {
        getFoldersAndFiles();
    }, [])

    return (
        <>
            {
                loading ? <div>louding - do something</div> : <div className="card flex flex-wrap justify-content-center gap-5">
                    <Tree  loading = {loading}  style={{ "direction": "ltr" }}  className='text-right w-full md:w-30rem' value={nodes} filter filterMode="strict" filterPlaceholder=" לחיפוש כתב יד\תיקייה"  onNodeClick={(e) => e.node.isNav && navigate(`Handwriting/${e.node.id}`)} />
                </div>
            }
        </>
    )
}