import styles from './TextItem.module.css';

export function TextItem({
	text,
	id,
	updateItemClick,
	updateList,
	textToSearch,
}) {
	const deleteItem = (id) => {
		fetch(`http://localhost:3000/todos/${id}`, {
			method: 'DELETE',
		}).then(() => updateList(id));
	};

	return (
		<div
			className={`${styles.toDoListItem}${textToSearch && text.includes(textToSearch) ? ` ${styles.textSelection}` : ''}`}
		>
			{text}
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
						updateItemClick(id, text);
					}}
				>
					Изменить
				</button>
			</div>
		</div>
	);
}
