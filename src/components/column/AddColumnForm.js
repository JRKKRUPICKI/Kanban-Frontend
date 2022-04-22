import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import config from '../../config.json';

export default function AddColumnForm(props){

    const [name, setName] = useState();
    const [limit, setLimit] = useState();

    const [columnList , setColumnList] = useState([]);

    useEffect(() => {
        axios.get(config.API_URL + 'column').then(response => {
			setColumnList(response.data);
		});
    }, []);

    function save(){
        if(!name || name.length < 1){
            NotificationManager.error('Niepoprawna nazwa', 'Błąd');
            return;
        }
        if(columnList.filter(c => c.name === name).length > 0){
            NotificationManager.error('Kolumna istnieje', 'Błąd');
            return;
        }
        if(!Number.isInteger(limit) || limit < 0){
            NotificationManager.error('Niepoprawny limit', 'Błąd');
            return;
        }
        axios.post(config.API_URL + 'column/', {
            name: name,
            position: columnList.length,
            limit: limit
        }).then(response => {
            NotificationManager.success('Kolumna dodana', 'Powiadomienie');
            props.onClose();
            props.onSave();
        })
        .catch(error => {
            NotificationManager.error('Kolumna niedodana', 'Błąd');
        });
    }

    return(
        <>
            <Modal.Header closeButton>
                <Modal.Title>Tworzenie kolumny</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Nazwa kolumny</Form.Label>
                        <Form.Control type='text' placeholder='Wpisz nazwe' onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Limit zadań na kolumnę</Form.Label>
                        <Form.Control type='number' placeholder='Wpisz limit' min='0' onChange={(e) => setLimit(parseInt(e.target.value))}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.onClose}>Zamknij</Button>
                <Button variant='primary' onClick={save}>Zapisz</Button>
            </Modal.Footer>
        </>
    )
}
