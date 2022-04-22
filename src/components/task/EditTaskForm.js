import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import config from '../../config.json';
import { HexColorPicker, HexColorInput } from "react-colorful";
import styled from 'styled-components';

const ColorPicker = styled.div`
    .react-colorful{
        width: auto;
        border-radius: 12px;
    }

    .react-colorful__saturation{
        margin: 15px 0;
        border-radius: 5px;
        border-bottom: none;
    }

    .react-colorful__hue{
        order: -1;
    }

    .react-colorful__hue, .react-colorful__alpha{
        height: 14px;
        border-radius: 5px;
    }

    .react-colorful__hue-pointer, .react-colorful__alpha-pointer{
        width: 20px;
        height: 20px;
    }

    input{
        display: block;
        box-sizing: border-box;
        width: 90px;
        margin: 0 auto 15px auto;
        padding: 6px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #eee;
        outline: none;
        font: inherit;
        text-transform: uppercase;
        text-align: center;
    }

    input:focus{
        border-color: #4298ef;
    }
`;

export default function EditTaskForm(props){

    const [name, setName] = useState(props.task.name);
	const [description, setDescription] = useState(props.task.description);
    const [color, setColor] = useState(props.task.color);
	//const [column, setColumn] = useState(0);
	//const [row, setRow] = useState(0);

    const [taskList , setTaskList] = useState([]);
    //const [columnList , setColumnList] = useState([]);
    //const [rowList , setRowList] = useState([]);
    const [userList , setUserList] = useState([]);
    const [taskUserList , setTaskUserList] = useState([]);

    useEffect(() => {
        axios.get(config.API_URL + 'task').then(response => {
			setTaskList(response.data);
		});
        /*
        axios.get(config.API_URL + 'column').then(response => {
			setColumnList(response.data);
		});
        axios.get(config.API_URL + 'row').then(response => {
			setRowList(response.data);
		});
        */
        axios.get(config.API_URL + 'user').then(response => {
			setUserList(response.data);
		});
        axios.get(config.API_URL + 'taskUser').then(response => {
			setTaskUserList(response.data);
		});
    }, []);

    function save(){
        if(!name || name.length < 1){
            NotificationManager.error('Niepoprawna nazwa', 'Błąd');
            return;
        }
        axios.patch(config.API_URL + 'task/' + props.task.id + '/', {
            name: name,
            description: description,
            color: color
        }).then(response => {
            NotificationManager.success('Zadanie zapisane', 'Powiadomienie');
            props.onClose();
            props.onSave();
        })
        .catch(error => {
            NotificationManager.error('Zadanie niezapisane', 'Błąd');
        });
    }

    function resetColor(){
        axios.patch(config.API_URL + 'task/' + props.task.id + '/', {
            color: ''
        }).then(response => {
            NotificationManager.success('Kolor zresetowany', 'Powiadomienie');
            props.onClose();
            props.onSave();
        })
        .catch(error => {
            NotificationManager.error('Kolor niezresetowany', 'Błąd');
        });
    }

    function deleteTask(){
        axios.delete(config.API_URL + 'task/' + props.task.id + '/').then(response => {
            NotificationManager.success('Zadanie usunięte', 'Powiadomienie');
            props.onClose();
            const taskListFiltered = taskList.filter(t => t.column === props.task.column && t.row === props.task.row);
            const newTaskList = [];
            for(let i = 0; i < taskListFiltered.length; i++){
                if(taskListFiltered[i].id === props.task.id) continue;
                newTaskList.push(taskListFiltered[i]);
            }
            for(let i = 0; i < newTaskList.length; i++){
                newTaskList[i].position = i;
            }
            newTaskList.map(t => (
                axios.patch(config.API_URL + 'task/' + t.id + '/', {
                    position: t.position
                })
            ));
            props.onSave();
        })
        .catch(error => {
            NotificationManager.error('Zadanie nieusunięte', 'Błąd');
        });
    }

    /*
    function setIsUserChecked(e, userId, taskUserId){
        if(e.target.checked){
            axios.post(config.API_URL + 'taskUser/', {
                task: props.task.id,
                user: userId
            }).then(response => {
                NotificationManager.success('Użytkownik przypięty', 'Powiadomienie');
                axios.get(config.API_URL + 'taskUser').then(response => {
                    setTaskUserList(response.data);
                });
            })
            .catch(error => {
                NotificationManager.error('Użytkownik nieprzypięty', 'Błąd');
            });
        }
        else{
            axios.delete(config.API_URL + 'taskUser/' + taskUserId + '/').then(response => {
                NotificationManager.success('Użytkownik odpięty', 'Powiadomienie');
                axios.get(config.API_URL + 'taskUser').then(response => {
                    setTaskUserList(response.data);
                });
            })
            .catch(error => {
                NotificationManager.error('Użytkownik nieodpięty', 'Błąd');
            });
        }
    }
    */

    return(
        <>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edytowanie zadania <b>{props.task.name}</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Nazwa zadania</Form.Label>
                        <Form.Control type='text' placeholder='Wpisz nazwe' onChange={(e) => setName(e.target.value)} defaultValue={props.task.name}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Opis zadania</Form.Label>
                        <Form.Control type='text' placeholder='Wpisz opis' onChange={(e) => setDescription(e.target.value)} defaultValue={props.task.description}/>
                    </Form.Group>
                    {/*
                    <Form.Group className='mb-3'>
                        <Form.Label>Przypisani użytkownicy <b>(Zapisywanie automatyczne)</b></Form.Label>
                        {userList.map(u => (
                            taskUserList.filter(tu => tu.task === props.task.id && tu.user === u.id).length === 0 ?
                                <Form.Check type='checkbox' label={u.name} onClick={(e) => setIsUserChecked(e, u.id)} key={u.id}/> :
                                <Form.Check type='checkbox' label={u.name} defaultChecked onClick={(e) => setIsUserChecked(e, u.id, taskUserList.filter(tu => tu.task === props.task.id && tu.user === u.id)[0].id)} key={u.id}/>
                        ))}
                    </Form.Group>
                    */}
                    <ColorPicker>
                        <HexColorPicker color={color} onChange={setColor}/>
                        <HexColorInput color={color} onChange={setColor} prefixed/>
                    </ColorPicker>

                    <Form.Group className='mb-3'>
                        {taskUserList.filter(tu => tu.task === props.task.id).length > 0 ? <Form.Label>Przypisani użytkownicy</Form.Label> : null}
                        {taskUserList.filter(tu => tu.task === props.task.id).map(tu => (
                            <div key={tu.id}>{userList.length > 0 ? userList.filter(u => u.id === tu.user)[0].name : ''}<br/></div>
                        ))}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.onClose}>Zamknij</Button>
                <Button variant='secondary' onClick={resetColor}>Resetuj kolor</Button>
                <Button variant='danger' onClick={deleteTask}>Usuń</Button>
                <Button variant='primary' onClick={save}>Zapisz</Button>
            </Modal.Footer>
        </>
    )
}
