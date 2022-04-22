import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/Auth';
import { useLocation, useNavigate } from 'react-router-dom';
import './LoginPage.scss';
import { Link } from 'react-router-dom';
import config from '../config.json';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default function LoginForm(){

    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectPath = location.state?.path || '/profile';
    
    const [email, setEmail] = useState();
	const [password, setPassword] = useState();

    const [isEmailErrorMessage, setIsEmailErrorMessage] = useState(false);
    const [isPasswordErrorMessage, setIsPasswordErrorMessage] = useState(false);

    const login = () => {
        if(!email || !password){
            setIsEmailErrorMessage(true);
            setIsPasswordErrorMessage(true);
            return;
        }
        setIsEmailErrorMessage(false);
        setIsPasswordErrorMessage(false);
        axios.post(config.API_URL + 'auth/login/', {
            email: email,
            password: password
        }).then(response => {
            //auth.login(response.data);
            axios.get(config.API_URL + 'user').then(response => {
                auth.login(response.data.filter(u => u.email === email)[0]);
                navigate(redirectPath, {replace: true});
            });
            //navigate(redirectPath, {replace: true});
        })
        .catch(error => {
            console.log(error.response.data.detail);
            NotificationManager.error('Nieprawidłowy adres e-mail lub hasło!');
        });
    }

    return(
        <div className='loginpage'>
            <div className='title'>KANBAN</div>
            <Form className='form'>
                <div className='header'>Zaloguj się</div>
                <Form.Group className='mb-3'>
                    <Form.Label>Adres e-mail:</Form.Label>
                    <Form.Control type='text' placeholder='Podaj adres e-mail' onChange={(e) => setEmail(e.target.value)}/>
                    {isEmailErrorMessage && <div className='errorMessage'>Wymagany adres e-mail</div>}
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Hasło:</Form.Label>
                    <Form.Control type='password' placeholder='Podaj hasło' onChange={(e) => setPassword(e.target.value)}/>
                    {isPasswordErrorMessage && <div className='errorMessage'>Wymagane hasło</div>}
                </Form.Group>
                <Button variant='primary' onClick={login}>Zaloguj się</Button>
                <Link className='link' to='/register'>Zarejestruj się</Link>
            </Form>
            <NotificationContainer/>
        </div>
    )
}
