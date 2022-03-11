import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import {config} from "../ApiHelper/ApiUrl";
import {to_Encrypt} from "../aes";

const Login = () => {
    let navigate = useNavigate();
    const [user, setUser] = useState({email: "", password: ""});
    const [decryptPassword,setDecryptPassword] = useState('');
    const [remember, setRemember] = useState(false);

    useEffect(()=>{
        // if(localStorage.getItem("accessToken")){
        //     navigate("/");
        // }
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
    const handleOnSubmit = async () => {
        await axios.post(`${config.ApiUrl}/login`,user
        ).then((res) => {
            // console.log("res",res)
            if(res.data.success){
                localStorage.setItem("user",JSON.stringify(res.data.data));
                localStorage.setItem("accessToken",res.data.token);
                // window.location.href = "/";
                navigate("/");
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.data.error,
                    confirmButtonText: 'retry',
                    allowOutsideClick:false
                })
            }
        });
    };
    const handleOnKeyPress = async (e) => {
        if (e.key === "Enter") {
           await handleOnSubmit();
        }
    };
    const { email} = user;
    return (
        <div className="flex w-[500px] h-[500px] bg-[#2d343e] justify-evenly items-center rounded-[5px] flex-col p-8">
            <h1>Welcome to ChatApp</h1>
            <input
                placeholder="Enter your email"
                name={"email"}
                value={email}
                onChange={(e) => handleOnChange(e)}
                className="h-[50px] w-[80%] bg-[#404450] rounded-[5px] border-none pl-[10px]"
            />
            <input
                placeholder="Enter your password again"
                type="password"
                name={"password"}
                value={decryptPassword}
                onChange={(e) => handleOnChange(e)}
                onKeyPress={(e) => handleOnKeyPress(e)}
                className="h-[50px] w-[80%] bg-[#404450] rounded-[5px] border-none pl-[10px]"
            />
            <button
                className="w-[100px] pt-[0.5rem] pr-[1rem] pb-[0.5rem] pl-[1rem] border-none bg-[#ffac41] rounded-[5px] text-[black] cursor-pointer"
                onClick={handleOnSubmit}>Submit
            </button>
            <div className="flex flex-col items-start">
                <Link to="/login" className="text-[blue]">Forgot Password?</Link>
                If you don't have an account?<Link to="/register" className="text-[blue]">Sign In</Link>
            </div>
        </div>
    );
};
export default Login;
