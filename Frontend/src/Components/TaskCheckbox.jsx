function TaskCheckbox ({ task_type, label, checkboxChange }) {
    return (
        
        <div className="form-check form-check-inline">
        <input
            className="form-check-input"
            type="checkbox"
            name={`${task_type}`}
            id={`${task_type}`}
            onChange={checkboxChange} />
            <label htmlFor={`${task_type}`}>
                {label}
            </label>
        </div>
        
    );
  };

export default TaskCheckbox;