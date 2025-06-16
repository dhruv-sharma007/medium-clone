import { type ChangeEvent, type HTMLInputTypeAttribute } from "react";

const Input = ({
  label,
  placeholder,
  onChange,
  type,
}: {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: HTMLInputTypeAttribute;
}) => {
  return (
    <div>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">{label}</legend>
        <input
          className="input"
          placeholder={placeholder}
          onChange={onChange}
          type={type}
        />
      </fieldset>
    </div>
  );
};

export default Input;
