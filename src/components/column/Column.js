import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import EditColumnModal from "./EditColumnModal";
import styled from 'styled-components';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import config from '../../config.json';
import DeleteColumnModal from "./DeteleColumnModal";

const Column2 = styled.div`
	background: ${props => props.isDragging ? '#C7C7C7' : '#EBECF0'};
	text-align: center;
	cursor: pointer;
	padding: 10px;
	border-radius: 4px;
	min-width: 224px;
	padding: 6px;
	margin: 6px;
	box-sizing: content-box;
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-height: 60px;

	&:hover{
		background: #C7C7C7;
	}

	.name{
		font-weight: 700;
	}

	.limit{
	}

	&.overLimit{
		background: #FF6E6E;
	}
`;

export default function Column(props){

    const [showEditModal, setShowEditModal] = useState(false);
    const openEditModal = () => setShowEditModal(true);
	const closeEditModal = () => setShowEditModal(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const openDeleteModal = () => {
        closeEditModal();
        setShowDeleteModal(true);
    }
	const closeDeleteModal = () => setShowDeleteModal(false);

    async function deleteColumn(){
        const newColumnForTasks = props.columns.filter(c => c.position === props.column.position - 1)[0];
        if(newColumnForTasks){
            await Promise.all(props.tasks.filter(t => t.column === props.column.id).map(async t => {
                await axios.patch(config.API_URL + 'task/' + t.id + '/', {
                    column: newColumnForTasks.id,
                    position: props.tasks.filter(tt => tt.column === newColumnForTasks.id && tt.row === t.row).length + t.position
                });
            })).then(() => {
                console.log('USUWANIE KOLUMNY')
                axios.delete(config.API_URL + 'column/' + props.column.id + '/').then(response => {
                    NotificationManager.success('Kolumna usunięta', 'Powiadomienie');
                    const newColumnList = [];
                    for(let i = 0; i < props.columns.length; i++){
                        if(props.columns[i].id === props.column.id) continue;
                        newColumnList.push(props.columns[i]);
                    }
                    for(let i = 0; i < newColumnList.length; i++){
                        newColumnList[i].position = i;
                    }
                    newColumnList.map(c => (
                        axios.patch(config.API_URL + 'column/' + c.id + '/', {
                            position: c.position
                        })
                    ));
                    closeDeleteModal();
                    props.refresh();
                })
                .catch(error => {
                    NotificationManager.error('Kolumna nieusunięta', 'Błąd');
                });
            });
        }
        else{
            axios.delete(config.API_URL + 'column/' + props.column.id + '/').then(response => {
                NotificationManager.success('Kolumna usunięta', 'Powiadomienie');
                const newColumnList = [];
                for(let i = 0; i < props.columns.length; i++){
                    if(props.columns[i].id === props.column.id) continue;
                    newColumnList.push(props.columns[i]);
                }
                for(let i = 0; i < newColumnList.length; i++){
                    newColumnList[i].position = i;
                }
                newColumnList.map(c => (
                    axios.patch(config.API_URL + 'column/' + c.id + '/', {
                        position: c.position
                    })
                ));
                closeDeleteModal();
                props.refresh();
            })
            .catch(error => {
                NotificationManager.error('Kolumna nieusunięta', 'Błąd');
            });
        }
    }

    function save(name, limit){
        if(!name || name.length < 1){
            NotificationManager.error('Niepoprawna nazwa', 'Błąd');
            return;
        }
        if(props.columns.filter(c => c.name === name).length > 0 && name !== props.column.name){
            NotificationManager.error('Kolumna istnieje', 'Błąd');
            return;
        }
        if(!Number.isInteger(limit) || limit < 0){
            NotificationManager.error('Niepoprawny limit', 'Błąd');
            return;
        }
        axios.patch(config.API_URL + 'column/' + props.column.id + '/', {
            name: name,
            limit: limit
        }).then(response => {
            NotificationManager.success('Zmiany zapisane', 'Powiadomienie');
            closeEditModal();
            props.refresh();
        })
        .catch(error => {
            NotificationManager.error('Zmiany niezapisane', 'Błąd');
        });
    }

    return(
        <>
        <Draggable draggableId={'column-' + props.column.id} index={props.column.position} key={props.column.id}>
            {(provider, snapshot) => (
                <Column2
                    {...provider.draggableProps}
                    ref={provider.innerRef}
                    {...provider.dragHandleProps}
                    onClick={openEditModal}
                    isDragging={snapshot.isDragging}
                    className={props.column.limit > 0 && props.tasks.filter(t => t.column === props.column.id).length > props.column.limit ? 'overLimit' : ''}
                >
                    <div className='name'>{props.column.name}</div>
                    <div className='limit'>{props.column.limit === 0 ? '∞' : props.column.limit}</div>
                </Column2>
            )}
        </Draggable>
        <EditColumnModal show={showEditModal} column={props.column} close={closeEditModal} delete={openDeleteModal} save={save}/>
        <DeleteColumnModal show={showDeleteModal} close={closeDeleteModal} delete={deleteColumn} moveTasks={
            props.tasks.filter(t => t.column === props.column.id).length > 0 ? props.column.position > 0 ? 2 : 1 : 0
        }/>
        </>
    )
}
