import { useEffect, useState } from 'react';
import { UpdatedTextForm } from './UpdatedTextForm';
import styles from './ToDoListLayout.module.css';
import { TextItem } from './TextItem';
import { AddItemForm } from './AddItemForm';
import { ControlPanel } from './ControlPanel';

export function ToDoListLayout() {
	const [list, setList] = useState([]);
	const [text, setText] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errorFlag, setErrorFlag] = useState(false);
	const [updatingID, setUpdatingID] = useState(null);
	const [updatingText, setUpdatingText] = useState(null);
	const [isSort, setIsSort] = useState(false);
	const [textToSearch, setTextToSearch] = useState('');

	useEffect(() => {
		setIsLoading(true);
		fetch('http://localhost:3000/todos')
			.then((response) => {
				if (!response.ok) {
					throw new Error();
				}
				return response.json();
			})
			.then((loadedData) => setList(loadedData))
			.catch(() => setErrorFlag(true))
			.finally(() => setIsLoading(false));
	}, []);

	const updateListWithNewItem = (newList) => {
		setList((prevList) => [...prevList, newList]);
	};

	const updateListWithoutItem = (id) => {
		setList((prevList) => prevList.filter((item) => item.id !== id));
	};

	const updateItemClick = (id, text) => {
		setUpdatingID(id);
		setUpdatingText(text);
	};

	const updateListItem = (updatedItem) => {
		setList((prevList) =>
			prevList.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
		);
	};

	return (
		<section className={styles.mainSection}>
			<ControlPanel
				isSort={isSort}
				setIsSort={setIsSort}
				textToSearch={textToSearch}
				setTextToSearch={setTextToSearch}
			/>
			{(isLoading && <p>Loading...</p>) || (errorFlag && <p>ERROR</p>) || (
				<>
					<ul className={styles.toDoList}>
						{(isSort
							? [...list].sort((a, b) => a.text.localeCompare(b.text, 'ru'))
							: list
						).map(({ id, text }) => {
							return (
								<li key={id}>
									{updatingID === id ? (
										<UpdatedTextForm
											text={updatingText}
											canselForm={() => setUpdatingID(null)}
											id={updatingID}
											onUpdate={updateListItem}
										/>
									) : (
										<TextItem
											text={text}
											id={id}
											updateItemClick={updateItemClick}
											updateList={updateListWithoutItem}
											textToSearch={textToSearch}
										/>
									)}
								</li>
							);
						})}
					</ul>
					<AddItemForm
						updateList={updateListWithNewItem}
						text={text}
						setText={setText}
					/>
				</>
			)}
		</section>
	);
}
