import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';

export default function EditColumnModal(props){
    const [name, setName] = useState(props.column.name);
    const [limit, setLimit] = useState(props.column.limit);

    return(
        <>
        <Modal show={props.show} onHide={props.close}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edytowanie kolumny <b>{props.column.name}</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Nazwa kolumny</Form.Label>
                        <Form.Control type='text' placeholder='Wpisz nazwe' onChange={(e) => setName(e.target.value)} defaultValue={props.column.name}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Limit zadań na kolumnę</Form.Label>
                        <Form.Control type='number' placeholder='Wpisz limit' min='0' onChange={(e) => setLimit(parseInt(e.target.value))} defaultValue={props.column.limit}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.close}>Anuluj</Button>
                <Button variant='danger' onClick={props.delete}>Usuń</Button>
                <Button variant='primary' onClick={() => props.save(name, limit)}>Zapisz</Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}
