import React, { FC, useState } from "react";
import { useDebounce } from "../Hooks/useDebounce";

interface DebouncedInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
}

const DebouncedInput: FC<DebouncedInputProps> = ({
  value,
  onChange,
  className = "",
  placeholder = "",
}) => {
  const [inputValue, setValue] = useState(value || "");
  const debounce = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  }, 200);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.target = e.target[0];
        debounce(e);
      }}
      className={className}
    >
      <input
        className="sonic-table-db-search"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setValue(e.target.value);
          debounce(e);
        }}
      />
      <button
        type="submit"
        className="sonic-table-search-btn border-none bg-lgt"
      >
        &#x1F50E;&#xFE0E;
      </button>
    </form>
  );
};

export default DebouncedInput;
