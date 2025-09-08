import styles from './AddItemForm.module.css';

export function AddItemForm({ updateList, setText, text }) {
	const addItem = (event) => {
		event.preventDefault();
		fetch('http://localhost:3000/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({ text: text }),
		})
			.then((response) => response.json())
			.then((newList) => {
				updateList(newList);
			})
			.finally(() => setText(''));
	};
	return (
		<form onSubmit={addItem}>
			<input
				className={styles.formItem}
				type="text"
				value={text}
				onChange={({ target }) => setText(target.value)}
			/>
			<button className={styles.formItem} type="submit">
				Добавить дело
			</button>
		</form>
	);
}
