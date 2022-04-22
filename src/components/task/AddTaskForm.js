import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import config from '../../config.json';

export default function AddTaskForm(props){

    const [name, setName] = useState();
	const [description, setDescription] = useState('');
	const [column, setColumn] = useState(0);
	const [row, setRow] = useState(0);

    const [taskList , setTaskList] = useState([]);
    const [columnList , setColumnList] = useState([]);
    const [rowList , setRowList] = useState([]);

    useEffect(() => {
        axios.get(config.API_URL + 'task').then(response => {
			setTaskList(response.data);
		});
        axios.get(config.API_URL + 'column').then(response => {
			setColumnList(response.data);
		});
        axios.get(config.API_URL + 'row').then(response => {
			setRowList(response.data);
		});
    }, []);

    function save(){
        if(!name || name.length < 1){
            NotificationManager.error('Niepoprawna nazwa', 'Błąd');
            return;
        }
        if(column < 1 || columnList.filter(c => c.id === column).length === 0){
            NotificationManager.error('Wybierz kolumnę', 'Informacja');
            return;
        }
        if(row < 1 || rowList.filter(r => r.id === row).length === 0){
            NotificationManager.error('Wybierz wiersz', 'Informacja');
            return;
        }
        axios.post(config.API_URL + 'task/', {
            name: name,
            description: description,
            position: taskList.filter(t => t.column === column && t.row === row).length,
            column: column,
            row: row
        }).then(response => {
            NotificationManager.success('Zadanie dodane', 'Powiadomienie');
            props.onClose();
            props.onSave();
        })
        .catch(error => {
            NotificationManager.error('Zadanie niedodane', 'Błąd');
        });
    }

    return(
        <>
            <Modal.Header closeButton>
                <Modal.Title>Tworzenie zadania</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Nazwa zadania</Form.Label>
                        <Form.Control type='text' placeholder='Wpisz nazwe' onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Opis zadania</Form.Label>
                        <Form.Control type='text' placeholder='Wpisz opis' onChange={(e) => setDescription(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Kolumna</Form.Label>
                        <Form.Select onChange={(e) => setColumn(parseInt(e.target.value))}>
                            <option value={0} key={0}>Wybierz kolumnę</option>
                            {columnList.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Wiersz</Form.Label>
                        <Form.Select onChange={(e) => setRow(parseInt(e.target.value))}>
                            <option value={0} key={0}>Wybierz wiersz</option>
                            {rowList.map(r => <option value={r.id} key={r.id}>{r.name}</option>)}
                        </Form.Select>
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
