import Modal from 'react-bootstrap/Modal';
import { Button } from "react-bootstrap";

export default function DeleteColumnModal(props){
    return(
        <>
        <Modal show={props.show} onHide={props.close}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Czy na pewno usunąć kolumnę?
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.moveTasks === 2 ? 'Zadania z tej kolumny zostaną przeniesione do kolumny poprzedniej.' : props.moveTasks === 1 ? 'Zadania z tej kolumny zostaną usunięte.' : ''}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.close}>Anuluj</Button>
                <Button variant='danger' onClick={props.delete}>Usuń</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}
