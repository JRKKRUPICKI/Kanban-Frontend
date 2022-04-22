import React from 'react';
import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import config from '../config.json';
import AddColumnForm from '../components/column/AddColumnForm';
import AddRowForm from '../components/row/AddRowForm';
import EditRowForm from '../components/row/EditRowForm';
import EditCellForm from '../components/cell/EditCellForm';
import AddTaskForm from '../components/task/AddTaskForm';
import EditTaskForm from '../components/task/EditTaskForm';
import NavBar from '../components/NavBar';
import Column from '../components/column/Column';

const Container = styled.div`
	height: 100vh;
`;

const Header = styled.div`
	text-align: center;
	color: #FFFFFF;

	& > .title{
		font-weight: 700;
		font-size: 40px;
		letter-spacing: 10px;
	}

	.subtitle{
		font-weight: 700;
		font-size: 20px;
		margin-bottom: 20px;
	}

	.addButton{
		border: 1px solid black;
		width: 200px;
		border-radius: 5px;
		padding: 5px;
		background: #000000;
		display: inline-block;
		margin: 6px;
		cursor: pointer;
		color: #FFFFFF;
		font-weight: 700;

		&:hover{
			background: #26743B;
		}

		&.disabled{
			background: #6B7174;
			cursor: default;
		}
	}
`;

const ColumnContainer = styled.div`
	display: flex;
	flex-direction: row;
	padding-left: 224px;
	min-width: fit-content;
`;

const CellRowContainer = styled.div`
	display: flex;
	flex-direction: row;

	.name{
		text-align: center;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #fd9e02;
		margin: 6px;
		border-radius: 4px;
		font-weight: 700;
		min-height: 92px;
		padding: 3px;
	}
`;

const RowContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const Row = styled.div`
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 200px;
	padding: 6px;
	margin: 6px;
	height: 300px;
	border-radius: 4px;
	background: ${props => props.isDragging ? '#C7C7C7' : '#EBECF0'};
	box-sizing: content-box;

	&:hover{
		background: #C7C7C7;
	}

	.name{
		font-weight: 700;
	}

	&.overLimit{
		background: #FF6E6E;
	}
`;

const TaskContainer = styled.div`
	background: #EBECF0;
	border-radius: 4px;
	width: 230px;
	margin: 6px;
	padding: 3px;
	display: flex;
	flex-direction: column;
	height: 306px;
	box-sizing: content-box;

	.limit{
		font-size: 12px;
		width: 200px;
		text-align: center;
		margin-top: auto;
		margin-bottom: 3px;
		margin-left: 3px;
		cursor: pointer;
	}

	&.overLimit{
		background: #FF6E6E;
	}
`;

const TaskList = styled.div`
	overflow-y: scroll;
	overflow-x: hidden;
	height: 400px;
	display: flex;
	flex-direction: column;
	background: ${props => props.isDraggingOver ? '' : ''};
`;

const Task = styled.div`
	.container{
		background: ${props => props.isDragging ? '#FAFBA4' : '#FFFFFF'};
		border-radius: 4px;
		font-size: 14px;
		width: 200px;
		padding: 6px;
		margin: 3px;
		box-sizing: content-box;
		
		&:hover{
			background: #FAFBA4!important;
		}
	}

	.title{
		font-weight: 700;
	}

	.description{}

	.users{
		display: flex;
		flex-direction: row;
	}

	.user{
		width: 22px;
		height: 22px;
		border-radius: 10px;
		text-align: center;
		line-height: 22px;
		color: #FFFFFF;
		margin: 2px;
		padding: 2px;
		box-sizing: content-box;
		background: #000000;
		border: 1px solid #FFFFFF;
	}
`;

const Users = styled.div`
	display: flex;
	flex-direction: row;
	min-height: ${props => props.isDraggingOver ? '32px' : '10px'};
	border: 1px dashed #000000;
	border-radius: 10px;
`;

const AvailableUsers = styled.div`
	margin: 10px;
	display: flex;
	flex-direction: row;

	.title{
		font-weight: 700;
		font-size: 20px;
		display: inline-block;
		margin-right: 10px;
	}

	.users{
		display: flex;
		flex-direction: row;
		min-width: 30px;
		min-height: 30px;
		border: 1px dashed #FFFFFF;
		box-sizing: content-box;
		border-radius: 10px;

		.user{
			width: 22px;
			height: 22px;
			border-radius: 10px;
			text-align: center;
			line-height: 22px;
			color: #FFFFFF;
			margin: 2px;
			padding: 2px;
			box-sizing: content-box;
			background: #000000;
			flex-shrink: 0;
			border: 1px solid #FFFFFF;
		}
	}
`;

const CellContainer = styled.div``;

export default function Board(){

	useEffect(() => {
		loadColumnList();
		loadRowList();
		loadTaskList();
		loadLimitList();
		loadUserList();
		loadTaskUserList();
	}, []);

	const [columns, setColumns] = useState([]);
	const [rows, setRows] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [limits, setLimits] = useState([]);
	const [users, setUsers] = useState([]);
	const [taskUser, setTaskUser] = useState([]);

	const [selectedColumn, setSelectedColumn] = useState();
	const [selectedRow, setSelectedRow] = useState();
	const [selectedTask, setSelectedTask] = useState();
	const [selectedCell, setSelectedCell] = useState();

	/*#####################################################################
	#                           DODAWANIE KOLUMNY                         #
	#####################################################################*/

	const [showAddColumnModal, setShowAddColumnModal] = useState(false);
	const openAddColumnModal = () => setShowAddColumnModal(true);
	const closeAddColumnModal = () => setShowAddColumnModal(false);

	function AddColumnModal(){

		return(
			<Modal show={showAddColumnModal} onHide={closeAddColumnModal}>
				<AddColumnForm onClose={closeAddColumnModal} onSave={loadColumnList}/>
			</Modal>
		)
	}

	/*#####################################################################
	#                           DODAWANIE WIERSZA                         #
	#####################################################################*/

	const [showAddRowModal, setShowAddRowModal] = useState(false);
	const openAddRowModal = () => setShowAddRowModal(true);
	const closeAddRowModal = () => setShowAddRowModal(false);

	function AddRowModal(){

		return(
			<Modal show={showAddRowModal} onHide={closeAddRowModal}>
				<AddRowForm onClose={closeAddRowModal} onSave={loadRowList}/>
			</Modal>
		)
	}

	/*#####################################################################
	#                          EDYTOWANIE WIERSZA                         #
	#####################################################################*/

	const [showEditRowModal, setShowEditRowModal] = useState(false);
	const openEditRowModal = () => setShowEditRowModal(true);
	const closeEditRowModal = () => setShowEditRowModal(false);

	function EditRowModal(){

		return(
			<Modal show={showEditRowModal} onHide={closeEditRowModal}>
				<EditRowForm row={selectedRow} onClose={closeEditRowModal} onSave={loadRowList}/>
			</Modal>
		)
	}
	
	/*#####################################################################
	#                           DODAWANIE ZADANIA                         #
	#####################################################################*/

	const [showAddTaskModal, setShowAddTaskModal] = useState(false);
	const openAddTaskModal = () => setShowAddTaskModal(true);
	const closeAddTaskModal = () => setShowAddTaskModal(false);

	function AddTaskModal(){

		return(
			<Modal show={showAddTaskModal} onHide={closeAddTaskModal}>
				<AddTaskForm onClose={closeAddTaskModal} onSave={loadTaskList}/>
			</Modal>
		)
	}

	/*#####################################################################
	#                           ŁADOWANIE DANYCH                          #
	#####################################################################*/

	function loadColumnList(){
		axios.get(config.API_URL + 'column').then(response => {
			setColumns(response.data);
		});
	}

	function loadRowList(){
		axios.get(config.API_URL + 'row').then(response => {
			setRows(response.data);
		});
	}

	function loadTaskList(){
		axios.get(config.API_URL + 'task').then(response => {
			setTasks(response.data);
		});
	}

	function loadLimitList(){
		axios.get(config.API_URL + 'limit').then(response => {
			setLimits(response.data);
		});
	}

	function loadUserList(){
		axios.get(config.API_URL + 'user').then(response => {
			setUsers(response.data);
		});
	}

	function loadTaskUserList(){
		axios.get(config.API_URL + 'taskUser').then(response => {
			setTaskUser(response.data);
		});
	}

	function loadAll(){
		loadColumnList();
		loadRowList();
		loadTaskList();
		loadLimitList();
		loadUserList();
		loadTaskUserList();
	}

	/*#####################################################################
	#                           EDYTOWANIE LIMITU                         #
	#####################################################################*/

	const [showEditLimitModal, setShowEditLimitModal] = useState(false);
	const openEditLimitModal = () => setShowEditLimitModal(true);
	const closeEditLimitModal = () => setShowEditLimitModal(false);

	function EditLimitModal(){

		return(
			<Modal show={showEditLimitModal} onHide={closeEditLimitModal}>
				<EditCellForm column={selectedColumn} row={selectedRow} cell={selectedCell} onClose={closeEditLimitModal} onSave={loadLimitList}/>
			</Modal>
		)
	}

	/*#####################################################################
	#                          EDYTOWANIE ZADANIA                         #
	#####################################################################*/

	const [showEditTaskModal, setShowEditTaskModal] = useState(false);
	const openEditTaskModal = () => setShowEditTaskModal(true);
	const closeEditTaskModal = () => setShowEditTaskModal(false);

	function EditTaskModal(){

		return(
			<Modal show={showEditTaskModal} onHide={() => {closeEditTaskModal(); loadTaskUserList()}}>
				<EditTaskForm task={selectedTask} onClose={() => {closeEditTaskModal(); loadTaskUserList()}} onSave={loadTaskList}/>
			</Modal>
		)
	}

	/*#####################################################################
	#                                                                     #
	#####################################################################*/

	function onDragEnd(e){
		const { type, source, destination } = e;
		if(!destination) return;
		if(source.droppableId === destination.droppableId && source.index === destination.index) return;
		if(type === 'column'){
			const dragElement = columns.splice(source.index, 1);
			columns.splice(destination.index, 0, dragElement[0]);
			for(let i = 0; i < columns.length; i++){
				columns[i].position = i;
			}
			setColumns(columns);
			columns.map(c => (
				axios.patch(config.API_URL + 'column/' + c.id + '/', {
					position: c.position
				})
			));
			loadTaskList();
			return;
		}
		if(type === 'row'){
			const newRows = rows.slice();
			if(source.index < destination.index){
				newRows.filter(r => r.position > source.index && r.position <= destination.index).map(r => (
					r.position = r.position - 1
				));
			}
			else if(source.index > destination.index){
				newRows.filter(r => r.position >= destination.index && r.position < source.index).map(r => (
					r.position = r.position + 1
				))
			}
			newRows[source.index].position = destination.index;
			newRows.sort((a, b) => {
				if(a.position < b.position) return -1;
				if(a.position > b.position) return 1;
				return 0;
			});
			setRows(newRows);
			newRows.map(r => (
				axios.patch(config.API_URL + 'row/' + r.id + '/', {
					position: r.position
				})
			));
			return;
		}
		if(type === 'task'){
			const id = parseInt(e.draggableId.split('-')[1]);
			const sourceRow = parseInt(source.droppableId.split('-')[1]);
			const sourceColumn = parseInt(source.droppableId.split('-')[3]);
			const sourcePosition = source.index;
			const destinationRow = parseInt(destination.droppableId.split('-')[1]);
			const destinationColumn = parseInt(destination.droppableId.split('-')[3]);
			const destinationPosition = destination.index;
			
			const newList = tasks.slice();
			if(sourceColumn === destinationColumn && sourceRow === destinationRow){
				const newList2 = tasks.filter(t => t.column === sourceColumn && t.row === sourceRow);
				// przesuwanie w dół
				if(source.index < destination.index){
					newList2.filter(t => t.position > source.index && t.position <= destination.index).forEach(t => {
						//console.log(`${t.name}: ${t.position} -> ${t.position - 1}`);
						t.position = t.position - 1;
						axios.patch(config.API_URL + 'task/' + t.id + '/', {
							position: t.position
						});
					});
				}
				// przesuwanie w górę
				else if(source.index > destination.index){
					newList2.filter(t => t.position >= destination.index && t.position < source.index).forEach(t => {
						//console.log(`${t.name}: ${t.position} -> ${t.position + 1}`);
						t.position = t.position + 1;
						axios.patch(config.API_URL + 'task/' + t.id + '/', {
							position: t.position
						});
					});
				}
				const dragElement = newList2.filter(t => t.id === id)[0];
				//console.log(`${dragElement.name}: ${dragElement.position} -> ${destination.index}`);
				dragElement.position = destination.index;
				axios.patch(config.API_URL + 'task/' + dragElement.id + '/', {
					position: dragElement.position
				});
				newList.sort((a, b) => {
					if(a.position < b.position) return -1;
					if(a.position > b.position) return 1;
					return 0;
				});
				setTasks(newList);
				return;
			}
			// kontener dolecowy
			const destinationList = newList.filter(t => t.column === destinationColumn && t.row === destinationRow && t.position >= destinationPosition);
			destinationList.forEach(t => {
				//console.log(`${t.name}: ${t.position} -> ${t.position + 1}`);
				t.position = t.position + 1;
				axios.patch(config.API_URL + 'task/' + t.id + '/', {
					position: t.position
				});
			});
			//console.log(destinationList);
			// wybrany element
			const dragElement = newList.filter(t => t.id === id)[0];
			//console.log(`${dragElement.name}: ${dragElement.position} -> ${destination.index}`);
			dragElement.position = destination.index;
			dragElement.column = destinationColumn;
			dragElement.row = destinationRow;
			axios.patch(config.API_URL + 'task/' + dragElement.id + '/', {
				position: dragElement.position,
				column: dragElement.column,
				row: dragElement.row
			});
			// kontener źródłowy
			const sourceList = newList.filter(t => t.column === sourceColumn && t.row === sourceRow && t.position > sourcePosition);
			sourceList.forEach(t => {
				//console.log(`${t.name}: ${t.position} -> ${t.position - 1}`);
				t.position = t.position - 1;
				axios.patch(config.API_URL + 'task/' + t.id + '/', {
					position: t.position
				});
			});
			//console.log(sourceList);
			// sortowanie i aktualizacja
			newList.sort((a, b) => {
				if(a.position < b.position) return -1;
				if(a.position > b.position) return 1;
				return 0;
			});
			setTasks(newList);
		}
		if(type === 'user'){
			// Przypinanie użytkownika do zadania
			if(source.droppableId === 'user-container' && destination.droppableId.split('-').length === 3){
				const userId = parseInt(e.draggableId.split('-')[1]);
				const taskId = parseInt(destination.droppableId.split('-')[2]);
				const userIsInTask = taskUser.filter(tu => tu.task === taskId && tu.user === userId).length > 0;
				if(userIsInTask){
					NotificationManager.info('Użytkownik jest już przypięty do tego zadania');
					return;
				}
				// Tymczasowe zabezpieczenie (ANTI SLOW NETWORK)
				taskUser.push({
					task: taskId,
					user: userId
				});
				setTaskUser(taskUser);
				//
				axios.post(config.API_URL + 'taskUser/', {
					task: taskId,
					user: userId
				}).then(response => {
					NotificationManager.success('Użytkownik przypięty', 'Powiadomienie');
					axios.get(config.API_URL + 'taskUser').then(response => {
						setTaskUser(response.data);
					});
				})
				.catch(error => {
					NotificationManager.error('Użytkownik nieprzypięty', 'Błąd');
				});
				return;
			}
			// Odpinanie użytkownika od zadania
			if(destination.droppableId === 'user-container' && source.droppableId.split('-').length === 3){
				const taskUserId = parseInt(e.draggableId.split('-')[1]);
				axios.delete(config.API_URL + 'taskUser/' + taskUserId + '/').then(response => {
					NotificationManager.success('Użytkownik odpięty', 'Powiadomienie');
					axios.get(config.API_URL + 'taskUser').then(response => {
						setTaskUser(response.data);
					});
				})
				.catch(error => {
					NotificationManager.error('Użytkownik nieodpięty', 'Błąd');
				});
				return;
			}
			// Przepinanie użytkownika do innego zadania
			if(source.droppableId.split('-').length === 3 && destination.droppableId.split('-').length === 3){
				if(source.droppableId === destination.droppableId) return;
				const taskUserId = parseInt(e.draggableId.split('-')[1]);
				const destinationTaskId = parseInt(destination.droppableId.split('-')[2]);
				const userId = parseInt(e.draggableId.split('-')[2]);
				const userIsInTask = taskUser.filter(tu => tu.task === destinationTaskId && tu.user === userId).length > 0;
				if(userIsInTask){
					NotificationManager.info('Użytkownik jest już przypięty do tego zadania');
					return;
				}
				axios.patch(config.API_URL + 'taskUser/' + taskUserId + '/', {
					task: destinationTaskId
				}).then(response => {
					NotificationManager.success('Użytkownik przepięty', 'Powiadomienie');
					axios.get(config.API_URL + 'taskUser').then(response => {
						setTaskUser(response.data);
					});
				})
				.catch(error => {
					NotificationManager.error('Użytkownik nieprzepięty', 'Błąd');
				});
			}
		}
	}

	function noAdd(){
		NotificationManager.error('Brak kolumn lub wierszy', 'Błąd');
	}

	const loadAvailableUsers = () => {
		let i = 3;
		let a = []
		users.forEach(u => {
			for(let j = taskUser.filter(tu => tu.user === u.id).length; j < i; j++){
				a.push(u)
			}
		})
		return a;
	}

	return(
		<>
		<NavBar/>
		<Container>
			<DragDropContext onDragEnd={onDragEnd}>
				<Header>
					<div className='title'>KANBAN</div>
					<div className='addButton' onClick={openAddColumnModal}>Dodaj kolumnę</div>
					<div className='addButton' onClick={openAddRowModal}>Dodaj wiersz</div>
					<div className={columns.length > 0 && rows.length > 0 ? 'addButton' : 'addButton disabled'} onClick={columns.length > 0 && rows.length > 0 ? openAddTaskModal : noAdd}>Dodaj zadanie</div>
					<AvailableUsers>
						<div className='title'>
							Dostępni użytkownicy:
						</div>
						<Droppable droppableId='user-container' direction='horizontal' type='user'>
							{provider => (
								<div className='users'
									{...provider.droppableProps}
									ref={provider.innerRef}
								>
									{loadAvailableUsers().map((u, i) => {
										return <Draggable draggableId={'auser-' + u.id + '-' + i} index={i} key={'auser-' + u.id + '-' + i}>
											{(provider, snapshot) => (
												<div
													className='user'
													{...provider.draggableProps}
													ref={provider.innerRef}
													{...provider.dragHandleProps}
												>
													{u.email.split('')[0] + u.email.split('')[1]}
												</div>
											)}
										</Draggable>
									})}
									{provider.placeholder}
								</div>
							)}
						</Droppable>
					</AvailableUsers>
					<AddColumnModal/>
					<AddRowModal/>
					<AddTaskModal/>
				</Header>
				<Droppable droppableId='column-container' direction='horizontal' type='column'>
					{provider => (
						<ColumnContainer {...provider.droppableProps} ref={provider.innerRef}>
							{columns.map(c => (
								<Column column={c} tasks={tasks} columns={columns} refresh={loadAll} key={c.id}/>
							))}
							{provider.placeholder}
						</ColumnContainer>
					)}
				</Droppable>
				<div style={{display: 'flex', flexDirection: 'row'}}>
					<Droppable droppableId='row-container' direction='vertical' type='row'>
						{provider => (
							<RowContainer {...provider.droppableProps} ref={provider.innerRef}>
								{rows.map(r => (
									<Draggable draggableId={'row-' + r.id} index={r.position} key={r.id}>
										{(provider, snapshot) => (
											<Row
												{...provider.draggableProps}
												ref={provider.innerRef}
												{...provider.dragHandleProps}
												onClick={() => {setSelectedRow(r);openEditRowModal();}}
												isDragging={snapshot.isDragging}
												className={r.limit > 0 && tasks.filter(t => t.row === r.id).length > r.limit ? 'overLimit' : ''}
											>
												<div className='name'>{r.name}</div>
												<div className='limit'>{r.limit === 0 ? '∞' : r.limit}</div>
											</Row>
										)}
									</Draggable>
								))}
								{provider.placeholder}
							</RowContainer>
						)}
					</Droppable>
					<CellContainer>
						{rows.map(r => (
							<CellRowContainer key={r.id}>
								{columns.map(c => (
									<TaskContainer key={c.id} className={limits.filter(l => l.column === c.id && l.row === r.id).length > 0 && limits.filter(l => l.column === c.id && l.row === r.id)[0].limit > 0 && tasks.filter(t => t.column === c.id && t.row === r.id).length > limits.filter(l => l.column === c.id && l.row === r.id)[0].limit ? 'limit overLimit' : 'limit'}>
										<Droppable droppableId={'row-' + r.id + '-column-' + c.id} direction='vertical' type='task' key={c.id}>
											{(provider, snapshot) => (
												<TaskList
													{...provider.droppableProps}
													ref={provider.innerRef}
													isDraggingOver={snapshot.isDraggingOver}
												>
													{tasks.filter(t => t.column === c.id && t.row === r.id).map(t => (
														<Draggable draggableId={'task-' + t.id} index={t.position} key={t.id}>
															{(provider, snapshot) => (
																<Task
																	{...provider.draggableProps}
																	ref={provider.innerRef}
																	{...provider.dragHandleProps}
																	isDragging={snapshot.isDragging}
																>
																	<div className='container'
																		onClick={() => {setSelectedTask(t);openEditTaskModal();}}
																		style={{background: t.color}}
																	>
																		<div className='title'>{t.name}</div>
																		<div className='description'>{t.description}</div>
																		<Droppable droppableId={'user-container-' + t.id} direction='horizontal' type='user'>
																			{(provider, snapshot) => (
																				<Users
																					{...provider.droppableProps}
																					ref={provider.innerRef}
																					isDraggingOver={snapshot.isDraggingOver}
																				>
																					{taskUser.filter(tu => tu.task === t.id).map((tu, i) => {
																						if(users.length === 0) return;
																						const u = users.filter(u => u.id === tu.user)[0];
																						return <Draggable draggableId={'user-' + tu.id + '-' + u.id} index={i} key={'user-' + tu.id + '-' + u.id}>
																							{(provider, snapshot) => (
																								<div
																									{...provider.draggableProps}
																									ref={provider.innerRef}
																									{...provider.dragHandleProps}
																									className='user'
																								>
																									{u.email.split('')[0] + u.email.split('')[1]}
																								</div>
																							)}
																						</Draggable>
																						})
																					}
																					{provider.placeholder}
																				</Users>
																			)}
																		</Droppable>
																	</div>
																</Task>
															)}
														</Draggable>
													))}
													{provider.placeholder}
												</TaskList>
											)}
										</Droppable>
										<div className='limit' onClick={() => {
											setSelectedColumn(c);
											setSelectedRow(r);
											setSelectedCell(limits.filter(l => l.column === c.id && l.row === r.id)[0])
											openEditLimitModal();
										}}>
											Limit zadań: {limits.filter(l => l.column === c.id && l.row === r.id).length > 0 && limits.filter(l => l.column === c.id && l.row === r.id)[0].limit > 0 ? limits.filter(l => l.column === c.id && l.row === r.id)[0].limit : '∞'}
										</div>
									</TaskContainer>
								))}
							</CellRowContainer>
						))}
					</CellContainer>
				</div>
			</DragDropContext>
			<EditLimitModal/>
			<EditRowModal/>
			<EditTaskModal/>
			<NotificationContainer/>
		</Container>
		</>
	);
}
