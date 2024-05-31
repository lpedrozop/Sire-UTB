function Input({
  id,
  inputType,
  placeholder,
  readOnly,
  onChange,
  value,
  onBlur,
  disabled,
  min,
}) {
  return (
    <div className="input-frm">
      <input
        className="input-size"
        type={inputType}
        placeholder={placeholder}
        value={value}
        id={id}
        name={id}
        readOnly={readOnly}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        min={min}
      />
    </div>
  );
}

export default Input;
