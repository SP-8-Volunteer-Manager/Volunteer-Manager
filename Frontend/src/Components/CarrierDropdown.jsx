function CarrierDropdown({dropdownChange, receivesms, carrier}) {
  const carriers = ["AT&T", "Boost Mobile", "Cricket Wireless", "Consumer Cellular", "FreedomPop", "H2O Wireless", "Mint Mobile", "Metro by T-Mobile", "Republic Wireless", "Simple Mobile", "Sprint", "Straight Talk", "T-Mobile", "Ting", "TracFone", "US Cellular", "Verizon", "Virgin Mobile", "Xfinity Mobile"];

  return (
    <select 
      className="form-select" 
      id="PhoneCarrier" 
      value={carrier}
      name="carrier" 
      onChange={dropdownChange} 
      disabled={!receivesms}
    >
      <option value="">Select Carrier</option>
      {carriers.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}

export default CarrierDropdown;