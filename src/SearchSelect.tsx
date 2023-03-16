import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import "./SearchSelect.css";

interface SearchSelectProps {
  onOptionSelect: (option: object) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: Array<object>;
  accessorKey: string;
  label: string;
  isMultiple: boolean;
}

// select searsh component
const SearchSelect: FC<SearchSelectProps> = ({
  label = "",
  options = [],
  accessorKey = "",
  onChange = () => {},
  onOptionSelect = () => {},
  isMultiple = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef(null);
  const [toggleOption, setToggleOption] = useState(false);
  const [selectedOption, selectOption] = useState({
    id: undefined,
    index: undefined,
    label: undefined,
    original: undefined,
    isSelected: false,
    setToggleSelect() {
      const isSelected = true;
    },
    getIsRowSelected() {
      return false;
    },
    resetToggleSelect() {
      const isSelected = false;
    },
  });
  const [selectedOptions, selectOptions] = useState([]);

  const { rowOptions } = useMemo(
    () => ({
      rowOptions: options[0]
        ? options.flatMap((item, i) => [
            {
              id: i,
              index: i,
              label: item[accessorKey],
              original: item,
              isSelected: false,
              setToggleSelect() {
                this.isSelected = true;
              },
              getIsRowSelected() {
                if (selectedOption.index === undefined) {
                  return false;
                }

                if (selectedOption.index === this.index) {
                  this.setToggleSelect();
                  return true;
                }
                return false;
              },
              resetToggleSelect() {
                this.isSelected = false;
              },
            },
          ])
        : [],
    }),
    [options, selectedOption]
  );

  const onSelect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: object
  ) => {
    const input = e.target as HTMLElement;
    if (isMultiple) {
      setInputValue;
    }
    setInputValue(input.innerText);
    onOptionSelect(option);
    setToggleOption(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log("gggggg");
    if (/arrowdown/i.test(e.code)) {
      if (
        selectedOption.index === undefined ||
        selectedOption.index === rowOptions.length - 1
      ) {
        selectOption(rowOptions[0]);
        return;
      }
      const rowIndex = rowOptions.filter(
        (item) => item.id === selectedOption.id + 1
      )[0].index;
      selectOption(rowOptions[rowIndex]);
      return;
    }

    if (/arrowup/i.test(e.code)) {
      if (selectedOption.index === undefined || selectedOption.index === 0) {
        selectOption(rowOptions[rowOptions.length - 1]);
        return;
      }
      const rowIndex = rowOptions.filter(
        (item) => item.id === selectedOption.id - 1
      )[0].index;
      selectOption(rowOptions[rowIndex]);
      return;
    }

    if (/enter/i.test(e.code)) {
      setInputValue(selectedOption.label ? selectedOption.label : "");
      selectedOption.setToggleSelect();
      onOptionSelect(selectedOption);
      setToggleOption(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!toggleOption) {
      setToggleOption(true);
    }
    setInputValue(e.target.value);
    onChange(e);
  };

  return (
    <div
      ref={containerRef}
      className="search-select-box"
      style={{ display: "inline-block" }}
      aria-activedescendant={`${toggleOption}`}
      aria-selected={toggleOption || inputValue !== ""}
      onKeyDown={handleKeyDown}
    >
      <div
        className="search-input"
        aria-labelledby="search-bx"
        onClick={(e) => {
          setToggleOption(!toggleOption);
        }}
      >
        <label htmlFor="ss-input-field" className="ss-input_label">
          {label}
        </label>
        <input
          id="ss-input-field"
          value={inputValue}
          onChange={onInputChange}
          spellCheck="false"
        />
        <button
          title={toggleOption ? "close" : "open"}
          className={
            toggleOption ? "search-select-close-btn" : "search-select-open-btn"
          }
        >
          &#9660;
        </button>
        <fieldset aria-hidden="true" className="search-select-input-fieldset">
          <legend className={toggleOption ? "legend-open" : "legend-close"}>
            <span>{label}</span>
          </legend>
        </fieldset>
      </div>
      <div className={`search-options-box`} aria-labelledby="options-bx">
        {options[0]
          ? rowOptions.map((option) => (
              <div
                onClick={(e) => {
                  selectOption(option);
                  option.setToggleSelect();
                  onSelect(e, option);
                }}
                onMouseOut={() => {
                  option.resetToggleSelect();
                }}
                aria-labelledby="option-item"
                aria-selected={`${option.getIsRowSelected()}`}
                className="search-option-item"
                key={option.id}
                onKeyDown={handleKeyDown}
              >
                {option.label}
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default SearchSelect;
