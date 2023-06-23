import React,{ useState, useEffect } from "react";
import UserContext from './UserContext';
//import { getUser } from '../../services/user';
import axios from 'axios';


const UserProvider = ({ children,userId}) => {

    const [user, setUser] = useState({});
    const [userAuthorization, setUserAuthorization] = useState(1);

    useEffect(() => {
        if(userId){
            const cookies = axios.get(`http://localhost:8000/users/localStorage/${userId}`
            )
                .then(function (response) {
                    console.log("+++++++++",userId);
                    localStorage.setItem("user", JSON.stringify(response.data.accessToken.foundUser))
                })
                .catch(function (error) {
                    // console.log("ooooooooo", error.response.data.message);
                    //???יש לבדוק תוקן!! בשרת
                })
                .finally(function () {
                });
        }
    }, [userId]);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}
export default UserProvider;