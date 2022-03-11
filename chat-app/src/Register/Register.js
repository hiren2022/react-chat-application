import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {config} from "../ApiHelper/ApiUrl";
import Swal from "sweetalert2";
import {to_Encrypt} from "../aes";

const Register = ({socket}) => {
    const [user, setUser] = useState({name: "", userName: "", email: "", password: "",socketId:''});
    const [decryptPassword,setDecryptPassword] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem("accessToken")){
            navigate("/");
        }
        socket.on("me", (id) => {
            setUser({...user,['socketId']:id});
        })
    },[]);
    const handleOnChange = (event) => {
        let {name, value} = event.target;
        if(name === "password"){
            setUser({...user, [name]: to_Encrypt(value)});
            setDecryptPassword(value);
        }
        else{
            setUser({...user, [name]: value});
        }
    };
    const handleOnSubmit =async () => {
       await axios.post(`${config.ApiUrl}/register`,user).then((resp) => {
           if(resp.data.success){
               // window.location.href = "/";
               // navigate("/");
               localStorage.setItem("user",JSON.stringify(resp.data.data));
               localStorage.setItem("accessToken",resp.data.token);
           }
           else{
               Swal.fire({
                   icon: 'error',
                   title: 'Oops...',
                   text: resp.data.error,
                   confirmButtonText: 'retry',
                   allowOutsideClick:false
               })
           }
       });
    };
    const {name, userName, email, password} = user;
    return (
        <div className="flex w-[500px] h-[500px] bg-[#2d343e] justify-evenly items-center rounded-[5px] flex-col p-8">
            <h1>Welcome to ChatApp</h1>
            <input
                placeholder="Enter your name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => handleOnChange(e)}
                className="h-[50px] w-[80%] bg-[#404450] rounded-[5px] border-none pl-[10px]"
            />
            <input
                placeholder="Enter your username"
                type="text"
                value={userName}
                name={"userName"}
                onChange={(e) => handleOnChange(e)}
                className="h-[50px] w-[80%] bg-[#404450] rounded-[5px] border-none pl-[10px]"
            />
            <input
                placeholder="Enter your email"
                name={"email"}
                value={email}
                onChange={(e) => handleOnChange(e)}
                className="h-[50px] w-[80%] bg-[#404450] rounded-[5px] border-none pl-[10px]"
            />
            <input
                placeholder="Enter your password"
                type="password"
                name={"password"}
                value={decryptPassword}
                onChange={(e) => handleOnChange(e)}
                className="h-[50px] w-[80%] bg-[#404450] rounded-[5px] border-none pl-[10px]"
            />
            {/*<input*/}
            {/*    placeholder="Enter your password again"*/}
            {/*    type="password"*/}
            {/*    name={"password"}*/}
            {/*    value={decryptPassword}*/}
            {/*    onChange={(e) => handleOnChange(e)}*/}
            {/*    className="h-[50px] w-[80%] bg-[#404450] rounded-[5px] border-none pl-[10px]"*/}
            {/*/>*/}
            <button
                className="w-[100px] pt-[0.5rem] pr-[1rem] pb-[0.5rem] pl-[1rem] border-none bg-[#ffac41] rounded-[5px] text-[black] cursor-pointer"
                onClick={handleOnSubmit}>Submit
            </button>
            <div className="flex flex-col items-start">
                already registerd ?<Link to="/login" className="text-[blue]">Log In</Link>
            </div>
        </div>
    );
};
export default Register;
