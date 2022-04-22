import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import config from '../../config.json';

export default function EditRowForm(props){

    const [name, setName] = useState(props.row.name);
    const [limit, setLimit] = useState(props.row.limit);

    const [rowList , setRowList] = useState([]);

    useEffect(() => {
        axios.get(config.API_URL + 'row').then(response => {
			setRowList(response.data);
		});
    }, []);

    function save(){
        if(!name || name.length < 1){
            NotificationManager.error('Niepoprawna nazwa', 'Błąd');
            return;
        }
        if(rowList.filter(r => r.name === name).length > 0 && name !== props.row.name){
            NotificationManager.error('Wiersz istnieje', 'Błąd');
            return;
        }
        if(!Number.isInteger(limit) || limit < 0){
            NotificationManager.error('Niepoprawny limit', 'Błąd');
            return;
        }
        axios.patch(config.API_URL + 'row/' + props.row.id + '/', {
            name: name,
            limit: limit
        }).then(response => {
            NotificationManager.success('Zmiany zapisane', 'Powiadomienie');
            props.onClose();
            props.onSave();
        })
        .catch(error => {
            NotificationManager.error('Zmiany niezapisane', 'Błąd');
        });
    }

    function deleteRow(){
        axios.delete(config.API_URL + 'row/' + props.row.id + '/').then(response => {
            NotificationManager.success('Wiersz usunięty', 'Powiadomienie');
            props.onClose();
            const newRowList = [];
            for(let i = 0; i < rowList.length; i++){
                if(rowList[i].id === props.row.id) continue;
                newRowList.push(rowList[i]);
            }
            for(let i = 0; i < newRowList.length; i++){
                newRowList[i].position = i;
            }
            newRowList.map(r => (
                axios.patch(config.API_URL + 'row/' + r.id + '/', {
                    position: r.position
                })
            ));
            props.onSave();
        })
        .catch(error => {
            NotificationManager.error('Wiersz nieusunięty', 'Błąd');
        });
    }

    return(
        <>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edytowanie wiersza <b>{props.row.name}</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Nazwa wiersza</Form.Label>
                        <Form.Control type='text' placeholder='Wpisz nazwe' onChange={(e) => setName(e.target.value)} defaultValue={props.row.name}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Limit zadań na wiersz</Form.Label>
                        <Form.Control type='number' placeholder='Wpisz limit' min='0' onChange={(e) => setLimit(parseInt(e.target.value))} defaultValue={props.row.limit}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.onClose}>Zamknij</Button>
                <Button variant='danger' onClick={deleteRow}>Usuń</Button>
                <Button variant='primary' onClick={save}>Zapisz</Button>
            </Modal.Footer>
        </>
    )
}
