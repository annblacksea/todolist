export function Checkbox({ id, completed, changeCompleted }) {
	return (
		<input
			type="checkbox"
			checked={completed}
			onChange={() => changeCompleted(id)}
		/>
	);
}
