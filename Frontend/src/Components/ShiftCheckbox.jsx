function ShiftCheckbox ({ day, time, checkboxChange }) {
    return (
        
        <div className="form-check form-check-inline">
        <input
            className="form-check-input"
            type="checkbox"
            name={`${day}${time}`}
            id={`${day}-${time}`}
            onChange={checkboxChange} />
            <label htmlFor={`${day}-${time}`}>
                {day}
            </label>
        </div>
        
    );
  };

export default ShiftCheckbox;

