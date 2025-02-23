import {useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Input} from '../ui/input';
import {Button} from '../ui/button';
const BACKEND_URL= "http://localhost:3000/api/v1";
export const Login = () =>{

    const emailref = useRef<HTMLInputElement>(null);
    const passwordref = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const handleSubmit = async() =>{

        const email = emailref.current?.value;
        const password = passwordref.current?.value;
        const response = await axios.post(`${BACKEND_URL}/login`,{
            email,
            password
        })
        const jwt = response.data.token;
        localStorage.setItem('token',jwt);
        navigate('/');
        alert('Signup Successfull');
    }
    return (
        <div className="bg-red-400">
            <Input  placeholder="email" reference={emailref}/>
            <Input  placeholder="password" reference = {passwordref}/>
            <div className="flex justify-center pt-8">
                <Button onClick={handleSubmit} varient="secondary" text="login" size="md"></Button>
            </div>
        </div>
    )
}