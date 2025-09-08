import { ToDoListLayout } from './components/ToDoListLayout';
import styles from './App.module.css';

function App() {
	return (
		<main className={styles.app}>
			<ToDoListLayout />
		</main>
	);
}

export default App;
