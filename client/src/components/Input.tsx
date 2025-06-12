import { type ChangeEvent } from "react";

const Input = ({
  label,
  placeholder,
  onChange,
}: {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">{label}</legend>
        <input
          type="text"
          className="input"
          placeholder={placeholder}
          onChange={onChange}
        />
      </fieldset>
    </div>
  );
};

export default Input;
