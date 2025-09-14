import { useRef, useState } from 'react';
import styles from './ControlPanel.module.css';

export function ControlPanel({
	isSort,
	setIsSort,
	textToSearch,
	setTextToSearch,
}) {
	const timerRef = useRef(null);
	const [inputValue, setInputValue] = useState(textToSearch);

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			setTextToSearch(event.target.value);
		}, 2000);
	};

	return (
		<form>
			<button
				type="button"
				className={`${styles.controlItem} ${isSort ? styles.sortBtton : ''} `}
				onClick={() => setIsSort(!isSort)}
			>
				По алфавиту
			</button>
			<input
				className={styles.controlItem}
				type="text"
				placeholder="Поиск..."
				value={inputValue}
				onChange={handleInputChange}
			/>
		</form>
	);
}
