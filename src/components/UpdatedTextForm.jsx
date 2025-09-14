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
		<form className={styles.updateForm} onSubmit={updateItem}>
			<textarea
				className={styles.text}
				type="text"
				value={value}
				onChange={({ target }) => setValue(target.value)}
			/>
			<div className={styles.buttonsContainer}>
				<button
					className={styles.button}
					type="button"
					onClick={canselForm}
				>
					Закрыть
				</button>
				<button className={styles.button} type="submit">
					Изменить
				</button>
			</div>
		</form>
	);
}
