import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import { enterHanwriting, createTree } from '../Services/functions';
import { useNavigate } from 'react-router-dom';
import 'primeflex/primeflex.css';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import '../App.css';
// import { CustomTreeNode } from './CustomTreeNode'; // Import the CustomTreeNode component 

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
            {loading ? (
                <div className="card pacity-90 flex justify-content-center">
                    <ProgressSpinner />
                </div>
            ) : (
                <div className="card pacity-90 mt-3 flex flex-wrap justify-content-center gap-5 " style={{ "width": "45%" }} >
                {/* <div className="card flex flex-wrap justify-content-center gap-5 "> */}
                    <Tree
                        loading={loading}
                        style={{ direction: 'rtl' }}
                        className=" w-full md:w-40rem custom-tree-rtl"
                        value={nodes}
                        filter
                        filterMode="strict"
                        filterPlaceholder=" לחיפוש כתב יד\תיקייה"
                        onNodeClick={(e) => {
                            e.node.isNav && navigate(`Handwriting/${e.node.id}`);
                        }}
                    />
                </div>
            )}   
        </>
    )
}