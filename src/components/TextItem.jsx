import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import styles from './TextItem.module.css';
import { API_ENDPOINT } from '../constants/API';
import { UpdatedTextForm } from './UpdatedTextForm';
import { Checkbox } from './Checkbox';
import { BackButton } from './BackButton';
import { NotFound } from './NotFound';

export function TextItem({ updateList, updateListItem }) {
	const { id } = useParams();
	const [todo, setTodo] = useState(null);
	const [isUpdatin, setIsUpdatin] = useState(false);
	// const [error, setError] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		fetch(API_ENDPOINT + `todos/${id}`)
			.then((response) => {
				if (!response.ok) {
					navigate('/404', { replace: true });
				}
				return response.json();
			})
			.then((data) => {
				setTodo(data);
			});
	}, [id, navigate]);

	const updateTodo = (updatedItem) => {
		updateListItem(updatedItem);
		setTodo(updatedItem);
		setIsUpdatin(false);
	};

	const deleteItem = (id) => {
		fetch(API_ENDPOINT + `todos/${id}`, {
			method: 'DELETE',
		}).then(() => {
			updateList(id);
			navigate('/');
		});
	};

	const updateCompleted = () => {
		fetch(API_ENDPOINT + `todos/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				completed: !todo.completed,
			}),
		})
			.then((response) => response.json())
			.then((updatedItem) => {
				setTodo(updatedItem);
				updateListItem(updatedItem);
			});
	};

	return (
		<>
			<BackButton />
			<div className={styles.toDoListItem}>
				{todo &&
					(isUpdatin ? (
						<UpdatedTextForm
							text={todo.text}
							canselForm={() => setIsUpdatin(false)}
							id={id}
							onUpdate={updateTodo}
						/>
					) : (
						<>
							<Checkbox
								id={id}
								completed={todo.completed}
								changeCompleted={updateCompleted}
							/>
							<p className={styles.text}>{todo.text}</p>
							<div className={styles.buttonsContainer}>
								<button
									className={styles.button}
									onClick={() => deleteItem(id)}
								>
									Удалить
								</button>
								<button
									className={styles.button}
									onClick={() => {
										setIsUpdatin(true);
									}}
								>
									Изменить
								</button>
							</div>
						</>
					))}
			</div>
		</>
	);
}
