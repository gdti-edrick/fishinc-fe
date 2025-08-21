import { useEffect, useRef, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputBase,
  IconButton,
  Paper,
} from "@mui/material";
import "./styles.css";
import { Text } from "../Typography";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const BasicInput = ({ style, ...props }) => {
  return (
    <TextField
      style={{
        // padding: "12px 16px",
        borderRadius: "6.361px",
        border: "0.795px solid var(--Text-Slate-Color-20, #CBD1D8)",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "16px" /* 114.286% */,
        letterSpacing: "0.56px",
        color: "#323A46",
        ...style,
      }}
      {...props}
    />
  );
};

const InputSizer = ({
  size,
  className,
  stacked,
  children,
  value,
  onChange,
}) => {
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (onChange) {
      onChange(inputValue);
    }
  };

  const classNames = ["input-sizer"];

  if (stacked) {
    classNames.push("stacked");
  }

  if (className) {
    classNames.push(className);
  }

  return (
    <label className={classNames.join(" ")} data-value={value}>
      {children}
      <input
        type="text"
        size={size}
        value={value}
        onChange={handleInputChange}
      />
    </label>
  );
};

InputSizer.defaultProps = {
  size: 1,
  className: "",
  stacked: false,
  children: null,
  onChange: null,
};

const MyInput = () => {
  const inputRef = useRef();

  const handleInputChange = (event) => {
    event.target.style.minWidth = "min-content";
  };

  return (
    <TextField
      inputRef={inputRef}
      onChange={handleInputChange}
      // Add any other props here, such as label, variant, etc.
    />
  );
};

// const BasicDropDown = ({
//   label,
//   listDropdown = [],
//   keyFilter = "id",
//   onChange,
//   style,
// }) => {
//   const [selectedValue, setSelectedValue] = useState("");

//   const handleChange = (event) => {
//     setSelectedValue(event.target.value);
//     if (onChange) onChange(event.target.value);
//   };

//   return (
//     <FormControl fullWidth style={style}>
//       {label && <InputLabel>{label}</InputLabel>}
//       <Select value={selectedValue} onChange={handleChange} displayEmpty>
//         <MenuItem value="" disabled>
//           Select an option
//         </MenuItem>
//         {listDropdown.map((item, index) => (
//           <MenuItem key={index} value={item[keyFilter]}>
//             {item[keyFilter]}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// };

const BasicDropDown = ({
  style = {},
  label,
  labelStyle = {},
  errors = {},
  keyFilter = "id", // Default key for values
  listDropdown = [],
  onChange,
  value, // Initial selected value
}) => {
  const [selectedValue, setSelectedValue] = useState(value || "");

  useEffect(() => {
    setSelectedValue(value || ""); // Sync with prop changes
  }, [value]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        ...style,
      },
    },
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if (onChange) onChange(newValue);
  };

  const errorMessage = errors[keyFilter]?.message
    ? `${label} ${errors[keyFilter]?.message.replace(keyFilter, "").trim()}`
    : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        width: "100%",
        ...style,
      }}
    >
      {label && (
        <Text variant="body1" sx={labelStyle}>
          {label}
        </Text>
      )}

      <div
        style={{
          width: "100%",
          position: "relative",
          padding: "0px 0px 20px 0px",
        }}
      >
        <FormControl fullWidth>
          <Select
            value={selectedValue}
            onChange={handleChange}
            displayEmpty
            MenuProps={MenuProps}
            sx={{ width: "100%" }}
          >
            <MenuItem value="" disabled>
              {value ? "Select an option" : "No selection"}
            </MenuItem>
            {listDropdown.length > 0 ? (
              listDropdown.map((item, index) => (
                <MenuItem key={index} value={item[keyFilter]}>
                  {item.label || item[keyFilter]}{" "}
                  {/* Display label if available */}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No results found</MenuItem>
            )}
          </Select>
        </FormControl>

        {errors[keyFilter] && (
          <Text
            variant="body2"
            sx={(labelStyle, { color: "red", position: "absolute" })}
          >
            {/* {errorMessage()} */}
            {errorMessage}
          </Text>
        )}
      </div>
    </div>
  );
};

const SearchBar = ({ search, setSearch }) => {
  const handleClear = () => {
    setSearch("");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        width: 300,
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "2px 8px",
      }}
    >
      <SearchIcon sx={{ color: "gray", mr: 1 }} />
      <InputBase
        sx={{ flex: 1 }}
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <IconButton onClick={handleClear} size="small">
          <CloseIcon sx={{ color: "#aaa" }} />
        </IconButton>
      )}
    </Paper>
  );
};

export { BasicInput, InputSizer, MyInput, BasicDropDown, SearchBar };
