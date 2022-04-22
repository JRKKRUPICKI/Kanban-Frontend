import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.scss';
import { Link } from 'react-router-dom';
import config from '../config.json';

export default function RegisterForm(){

    const navigate = useNavigate();

    const [email, setEmail] = useState();
	const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const [isEmailErrorMessage, setIsEmailErrorMessage] = useState(false);
    const [isPasswordErrorMessage, setIsPasswordErrorMessage] = useState(false);
    const [isPassword2ErrorMessage, setIsPassword2ErrorMessage] = useState(false);

    const register = () => {
        if(!email || !password || !password2){
            setIsEmailErrorMessage(true);
            setIsPasswordErrorMessage(true);
            setIsPassword2ErrorMessage(true);
            return;
        }
        if(isEmailErrorMessage || isPasswordErrorMessage || isPassword2ErrorMessage){
            console.log('error')
            return;
        }
        axios.post(config.API_URL + 'register/', {
            username: email,
            email: email,
            password: password,
            password2: password2
        }).then(response => {
            navigate('/login', {replace: true});

        })
        .catch(error => {
            console.log(error.response.data.detail);
        });
    }

    const checkPassword = (pass) => {
        setPassword(pass);
        if(!pass){
            setIsPasswordErrorMessage(true);
            return;
        }
        if(pass.length < 8){
            setIsPasswordErrorMessage(true);
            return;
        }
        setIsPasswordErrorMessage(false);
        if(password2) checkPassword2(password2, pass);
    }

    const checkPassword2 = (pass2, pass = password) => {
        setPassword2(pass2);
        if(!pass2){
            setIsPassword2ErrorMessage(true);
            return;
        }
        if(pass2.length < 8){
            setIsPassword2ErrorMessage(true);
            return;
        }
        if(pass !== pass2){
            setIsPassword2ErrorMessage(true);
            return;
        }
        setIsPassword2ErrorMessage(false);
    }

    const checkEmail = (mail) => {
        setEmail(mail);
        if(!mail){
            setIsEmailErrorMessage(true);
            return;
        }
        setIsEmailErrorMessage(false);
    }

    return(
        <div className='registerpage'>
            <div className='title'>KANBAN</div>
            <Form className='form'>
                <div className='header'>Zarejestruj się</div>
                <Form.Group className='mb-3'>
                    <Form.Label>Adres e-mail:</Form.Label>
                    <Form.Control type='text' placeholder='Podaj adres e-mail' onChange={(e) => checkEmail(e.target.value)}/>
                    {isEmailErrorMessage && <div className='errorMessage'>Wymagany adres e-mail</div>}
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Hasło:</Form.Label>
                    <Form.Control type='password' placeholder='Podaj hasło' onChange={(e) => checkPassword(e.target.value)}/>
                    {isPasswordErrorMessage && <div className='errorMessage'>Wymagane hasło, minimum 8 znaków</div>}
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Powtórz hasło:</Form.Label>
                    <Form.Control type='password' placeholder='Podaj hasło' onChange={(e) => checkPassword2(e.target.value)}/>
                    {isPassword2ErrorMessage && <div className='errorMessage'>Hasła muszą być takie same</div>}
                </Form.Group>
                <Button variant='primary' onClick={register}>Zarejestruj się</Button>
                <Link className='link' to='/login'>Zaloguj się</Link>
            </Form>
        </div>
    )
}
