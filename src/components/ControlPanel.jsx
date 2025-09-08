import styles from './ControlPanel.module.css';

export function ControlPanel({
	isSort,
	setIsSort,
	textToSearch,
	setTextToSearch,
}) {
	return (
		<div>
			<button
				className={styles.controlItem}
				onClick={() => setIsSort(!isSort)}
			>
				По алфавиту
			</button>
			<input
				className={styles.controlItem}
				type="text"
				placeholder="Поиск..."
				value={textToSearch}
				onChange={({ target }) => setTextToSearch(target.value)}
			/>
		</div>
	);
}
