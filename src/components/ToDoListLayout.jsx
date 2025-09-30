import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import styles from './ToDoListLayout.module.css';
import { TextItem } from './TextItem';
import { AddItemForm } from './AddItemForm';
import { ControlPanel } from './ControlPanel';
import { API_ENDPOINT } from '../constants/API';
import { Checkbox } from './Checkbox';
import { NotFound } from './NotFound';

export function ToDoListLayout() {
	const [list, setList] = useState([]);
	const [text, setText] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errorFlag, setErrorFlag] = useState(false);
	const [isSort, setIsSort] = useState(false);
	const [textToSearch, setTextToSearch] = useState('');

	const fetchServer = (sort = false, textToSearch = '') => {
		let url = API_ENDPOINT + 'todos';

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
		fetchServer();
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

		fetch(API_ENDPOINT + `todos/${id}`, {
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
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							(isLoading && <p>Loading...</p>) ||
							(errorFlag && <p>ERROR</p>) || (
								<>
									<ControlPanel
										isSort={isSort}
										setIsSort={setIsSort}
										textToSearch={textToSearch}
										setTextToSearch={setTextToSearch}
									/>
									<ul className={styles.toDoList}>
										{list.map(({ id, text, completed }) => {
											return (
												<li
													className={styles.listItem}
													key={id}
												>
													<>
														<Checkbox
															id={id}
															completed={
																completed
															}
															changeCompleted={
																changeCompleted
															}
														/>
														<Link to={`todo/${id}`}>
															{text.length > 50
																? text.slice(
																		0,
																		51,
																	) + '...'
																: text}
														</Link>
													</>
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
							)
						}
					/>
					<Route
						path="todo/:id"
						element={
							<TextItem
								updateListItem={updateListItem}
								updateList={updateListWithoutItem}
							/>
						}
					/>
					<Route path="/404" element={<NotFound />} />
					<Route
						path="*"
						element={<Navigate to="/404" replace={true} />}
					/>
				</Routes>
			</BrowserRouter>
		</section>
	);
}
