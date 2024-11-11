function StateDropdown({dropdownChange, isEditMode, stateValue}) {
  const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
  return (
    <select className="form-select" name="state" id="inputState" onChange={dropdownChange} 
    disabled={!isEditMode} 
    value={stateValue}>
      <option value="">Select State</option>
      {states.map((st) => (
        <option key={st} value={st}>
          {st}
        </option>
      ))}
    </select>
  );
}

export default StateDropdown;