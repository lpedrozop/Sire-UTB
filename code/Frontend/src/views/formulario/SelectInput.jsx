function Select({ id, options, defaultValue, onChange, disabled }) {
    return (
      <div className="select-frm">
        <select
          className="select-size"
          id={id}
          name={id}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  export default Select;