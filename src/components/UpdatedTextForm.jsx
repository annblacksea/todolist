import { useState } from 'react';
import styles from './UpdatedTextForm.module.css';

export function UpdatedTextForm({ text, canselForm, id, onUpdate }) {
	const [value, setValue] = useState(text);

	const updateItem = (event) => {
		event.preventDefault();
		fetch(`http://localhost:3000/todos/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				text: value,
			}),
		})
			.then((response) => response.json())
			.then((updatedItem) => {
				onUpdate(updatedItem);
				canselForm();
			});
	};

	return (
		<form onSubmit={updateItem}>
			<input
				type="text"
				value={value}
				onChange={({ target }) => setValue(target.value)}
			/>
			<button type="button" onClick={canselForm}>
				Закрыть
			</button>
			<button type="submit">Изменить</button>
		</form>
	);
}
