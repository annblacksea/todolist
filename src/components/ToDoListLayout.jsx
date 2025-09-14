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

	const fetchServer = (sort = false, textToSearch = '') => {
		let url = 'http://localhost:3000/todos';

		let params = '';

		if (sort) {
			params += `_sort=text&_order=desc`;
		}
		if (textToSearch) {
			params += (params ? '&' : '') + `text_like=${textToSearch}`;
		}

		if (params) url = url + '?' + params;

		fetch(url)
			.then((response) => {
				if (!response.ok) {
					throw new Error();
				}
				return response.json();
			})
			.then((loadedData) => setList(loadedData))
			.catch(() => setErrorFlag(true))
			.finally(() => setIsLoading(false));
	};

	useEffect(() => {
		setIsLoading(true);
		fetchServer(isSort, textToSearch);
	}, [isSort, textToSearch]);

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
			prevList.map((item) =>
				item.id === updatedItem.id ? updatedItem : item,
			),
		);
	};

	const changeCompleted = (id) => {
		const item = list.find((item) => item.id === id);
		const newCompleted = !item.completed;

		fetch(`http://localhost:3000/todos/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				completed: newCompleted,
			}),
		})
			.then((response) => response.json())
			.then((updatedItem) => {
				setList((prevList) =>
					prevList.map((item) =>
						item.id === updatedItem.id ? updatedItem : item,
					),
				);
			});
	};

	return (
		<section className={styles.mainSection}>
			<ControlPanel
				isSort={isSort}
				setIsSort={setIsSort}
				textToSearch={textToSearch}
				setTextToSearch={setTextToSearch}
			/>
			{(isLoading && <p>Loading...</p>) ||
				(errorFlag && <p>ERROR</p>) || (
					<>
						<ul className={styles.toDoList}>
							{list.map(({ id, text, completed }) => {
								return (
									<li className={styles.listItem} key={id}>
										{updatingID === id ? (
											<UpdatedTextForm
												text={updatingText}
												canselForm={() =>
													setUpdatingID(null)
												}
												id={updatingID}
												onUpdate={updateListItem}
											/>
										) : (
											<>
												<input
													type="checkbox"
													checked={completed}
													onChange={() =>
														changeCompleted(id)
													}
												/>
												<TextItem
													text={text}
													id={id}
													updateItemClick={
														updateItemClick
													}
													updateList={
														updateListWithoutItem
													}
													textToSearch={textToSearch}
												/>
											</>
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
