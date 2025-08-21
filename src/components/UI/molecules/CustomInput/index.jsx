import { useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  ListSubheader,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Search as SearchIcon } from "@mui/icons-material";

import { Text } from "../../atoms/Typography";
import { BasicInput } from "../../atoms/BasicInput";

import "./index.css";
import { Controller } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";
import PhoneInput from "react-phone-input-2";

const FormInput = ({
  type = "text",
  style,
  label,
  labelStyle,
  errors,
  register = null,
  id = "id",
  inputRef,
  autoComplete,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const errorMessage = () => {
    const message = errors[id]?.message;
    const startIndex = message.indexOf(id);
    const output = message.slice(startIndex + id.length).trim();
    if (label === "Confirm Password") {
      return `Confirm ${output}`;
    }
    return `${label} ${output}`;
  };

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
      <Text variant="body1" sx={labelStyle}>
        {label}
      </Text>
      <div
        style={{
          width: "100%",
          position: "relative",
          padding: "0px 0px 20px 0px",
        }}
      >
        <TextField
          {...register(id)}
          id={id}
          inputRef={inputRef}
          autoComplete={autoComplete}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              '&:has(> input[data-com-onepassword-filled="light"])': {
                backgroundColor: "rgb(219, 237, 255)",
              },
            },
          }}
          style={{
            // padding: "12px 16px",
            borderRadius: "6.361px",
            // border: "0.795px solid var(--Text-Slate-Color-20, #CBD1D8)",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "16px" /* 114.286% */,
            letterSpacing: "0.56px",
            color: "#323A46",
            width: "100%",
          }}
          {...props}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {type === "password" && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9.46992 15.28C9.27992 15.28 9.08992 15.21 8.93992 15.06C8.11992 14.24 7.66992 13.15 7.66992 12C7.66992 9.60998 9.60992 7.66998 11.9999 7.66998C13.1499 7.66998 14.2399 8.11998 15.0599 8.93998C15.1999 9.07998 15.2799 9.26998 15.2799 9.46998C15.2799 9.66998 15.1999 9.85998 15.0599 9.99998L9.99992 15.06C9.84992 15.21 9.65992 15.28 9.46992 15.28ZM11.9999 9.16998C10.4399 9.16998 9.16992 10.44 9.16992 12C9.16992 12.5 9.29992 12.98 9.53992 13.4L13.3999 9.53998C12.9799 9.29998 12.4999 9.16998 11.9999 9.16998Z"
                          fill="#292D32"
                        />
                        <path
                          d="M5.59984 18.51C5.42984 18.51 5.24984 18.45 5.10984 18.33C4.03984 17.42 3.07984 16.3 2.25984 15C1.19984 13.35 1.19984 10.66 2.25984 8.99998C4.69984 5.17998 8.24984 2.97998 11.9998 2.97998C14.1998 2.97998 16.3698 3.73998 18.2698 5.16998C18.5998 5.41998 18.6698 5.88998 18.4198 6.21998C18.1698 6.54998 17.6998 6.61998 17.3698 6.36998C15.7298 5.12998 13.8698 4.47998 11.9998 4.47998C8.76984 4.47998 5.67984 6.41998 3.51984 9.80998C2.76984 10.98 2.76984 13.02 3.51984 14.19C4.26984 15.36 5.12984 16.37 6.07984 17.19C6.38984 17.46 6.42984 17.93 6.15984 18.25C6.01984 18.42 5.80984 18.51 5.59984 18.51Z"
                          fill="#292D32"
                        />
                        <path
                          d="M12.0001 21.02C10.6701 21.02 9.37006 20.75 8.12006 20.22C7.74006 20.06 7.56006 19.62 7.72006 19.24C7.88006 18.86 8.32006 18.68 8.70006 18.84C9.76006 19.29 10.8701 19.52 11.9901 19.52C15.2201 19.52 18.3101 17.58 20.4701 14.19C21.2201 13.02 21.2201 10.98 20.4701 9.81C20.1601 9.32 19.8201 8.85 19.4601 8.41C19.2001 8.09 19.2501 7.62 19.5701 7.35C19.8901 7.09 20.3601 7.13 20.6301 7.46C21.0201 7.94 21.4001 8.46 21.7401 9C22.8001 10.65 22.8001 13.34 21.7401 15C19.3001 18.82 15.7501 21.02 12.0001 21.02Z"
                          fill="#292D32"
                        />
                        <path
                          d="M12.6901 16.27C12.3401 16.27 12.0201 16.02 11.9501 15.66C11.8701 15.25 12.1401 14.86 12.5501 14.79C13.6501 14.59 14.5701 13.67 14.7701 12.57C14.8501 12.16 15.2401 11.9 15.6501 11.97C16.0601 12.05 16.3301 12.44 16.2501 12.85C15.9301 14.58 14.5501 15.95 12.8301 16.27C12.7801 16.26 12.7401 16.27 12.6901 16.27Z"
                          fill="#292D32"
                        />
                        <path
                          d="M1.99994 22.75C1.80994 22.75 1.61994 22.68 1.46994 22.53C1.17994 22.24 1.17994 21.76 1.46994 21.47L8.93994 14C9.22994 13.71 9.70994 13.71 9.99994 14C10.2899 14.29 10.2899 14.77 9.99994 15.06L2.52994 22.53C2.37994 22.68 2.18994 22.75 1.99994 22.75Z"
                          fill="#292D32"
                        />
                        <path
                          d="M14.5302 10.22C14.3402 10.22 14.1502 10.15 14.0002 10C13.7102 9.71 13.7102 9.23 14.0002 8.94L21.4702 1.47C21.7602 1.18 22.2402 1.18 22.5302 1.47C22.8202 1.76 22.8202 2.24 22.5302 2.53L15.0602 10C14.9102 10.15 14.7202 10.22 14.5302 10.22Z"
                          fill="#292D32"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M11.9999 16.33C9.60992 16.33 7.66992 14.39 7.66992 12C7.66992 9.60998 9.60992 7.66998 11.9999 7.66998C14.3899 7.66998 16.3299 9.60998 16.3299 12C16.3299 14.39 14.3899 16.33 11.9999 16.33ZM11.9999 9.16998C10.4399 9.16998 9.16992 10.44 9.16992 12C9.16992 13.56 10.4399 14.83 11.9999 14.83C13.5599 14.83 14.8299 13.56 14.8299 12C14.8299 10.44 13.5599 9.16998 11.9999 9.16998Z"
                          fill="#292D32"
                        />
                        <path
                          d="M12.0001 21.02C8.24008 21.02 4.69008 18.82 2.25008 15C1.19008 13.35 1.19008 10.66 2.25008 8.99998C4.70008 5.17998 8.25008 2.97998 12.0001 2.97998C15.7501 2.97998 19.3001 5.17998 21.7401 8.99998C22.8001 10.65 22.8001 13.34 21.7401 15C19.3001 18.82 15.7501 21.02 12.0001 21.02ZM12.0001 4.47998C8.77008 4.47998 5.68008 6.41998 3.52008 9.80998C2.77008 10.98 2.77008 13.02 3.52008 14.19C5.68008 17.58 8.77008 19.52 12.0001 19.52C15.2301 19.52 18.3201 17.58 20.4801 14.19C21.2301 13.02 21.2301 10.98 20.4801 9.80998C18.3201 6.41998 15.2301 4.47998 12.0001 4.47998Z"
                          fill="#292D32"
                        />
                      </svg>
                    )}
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
        {errors[id] && (
          <Text
            variant="body2"
            sx={(labelStyle, { color: "red", position: "absolute" })}
          >
            {/* {errors[id]?.message} */}
            {errorMessage()}
          </Text>
        )}
      </div>
    </div>
  );
};
const FormPhone = ({
  style,
  label,
  labelStyle,
  errors,
  id = "id",
  inputRef,
  autoComplete,
  countryValue,
  countryChange,
  countryName,
  dataCountry = () => {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const errorMessage = () => {
    const message = errors[id]?.message;
    const startIndex = message.indexOf(id);
    const output = message.slice(startIndex + id.length).trim();
    if (label === "Confirm Password") {
      return `Confirm ${output}`;
    }
    return `${label} ${output}`;
  };

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
      <Text variant="body1" sx={labelStyle}>
        {label}
      </Text>
      <div
        style={{
          width: "100%",
          position: "relative",
          padding: "0px 0px 20px 0px",
        }}
      >
        <TextField
          id={id}
          inputRef={inputRef}
          autoComplete={autoComplete}
          type="text"
          sx={{
            "& .MuiOutlinedInput-root": {
              '&:has(> input[data-com-onepassword-filled="light"])': {
                backgroundColor: "rgb(219, 237, 255)",
              },
              // padding: "0px 0px 0px 100px",
            },
          }}
          style={{
            // padding: "12px 16px",

            borderRadius: "6.361px",
            // border: "0.795px solid var(--Text-Slate-Color-20, #CBD1D8)",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "16px" /* 114.286% */,
            letterSpacing: "0.56px",
            color: "#323A46",
            width: "100%",
          }}
          InputProps={{
            style: { padding: "0px 0px 0px 0px" },
            startAdornment: (
              <InputAdornment position="start" sx={{ px: 0 }}>
                <PhoneInput
                  country={countryName}
                  enableSearch={true}
                  value={countryValue}
                  onChange={(phone, country) => {
                    countryChange(phone);

                    if (typeof dataCountry === "function") {
                      dataCountry(country);
                    }
                  }}
                  inputStyle={{
                    display: "none",
                  }}
                  buttonStyle={{
                    // height: "100%",
                    border: "none",
                    background: "none",
                  }}
                  containerStyle={{
                    border: "none",
                    marginRight: "40px",
                  }}
                />
                <Text>{countryValue}</Text>
              </InputAdornment>
            ),
          }}
          {...props}
          input
        />
        {errors[id] && (
          <Text
            variant="body2"
            sx={(labelStyle, { color: "red", position: "absolute" })}
          >
            {/* {errors[id]?.message} */}
            {errorMessage()}
          </Text>
        )}
      </div>
    </div>
  );
};

const FormDropDown = ({
  control,
  style,
  label,
  labelStyle,
  errors,
  id = "id",
  listDropdown = [],
  keyFilter = "",
  renderMenuItem,
  onChange,
}) => {
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

  const errorMessage = () => {
    const message = errors[id]?.message;
    const startIndex = message.indexOf(id);
    const output = message.slice(startIndex + id.length).trim();
    if (label === "Confirm Password") {
      return `Confirm ${output}`;
    }
    return `${label} ${output}`;
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // **Filter the original listDropdown**
  const filteredItems = listDropdown.filter((item) =>
    item[keyFilter].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
        ...style,
      }}
    >
      <Text variant="body1" sx={labelStyle}>
        {label}
      </Text>
      <div
        style={{
          width: "100%",
          position: "relative",
          padding: "0px 0px 20px 0px",
        }}
      >
        <Controller
          name={id}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              onChange={(event) => {
                field.onChange(event);
                if (onChange) onChange(event.target.value);
              }}
              displayEmpty
              sx={{ width: "100%" }}
            >
              <ListSubheader>
                <TextField
                  size="small"
                  placeholder="Search..."
                  fullWidth
                  value={searchTerm}
                  onChange={handleSearchChange}
                  // autoFocus
                />
              </ListSubheader>

              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <MenuItem key={index} value={item[keyFilter]}>
                    {item[keyFilter]}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No results found</MenuItem>
              )}
            </Select>
          )}
        />

        {/* {renderMenuItem && (
          <Controller
            name={id}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value ?? ""}
                onChange={(event) => {
                  field.onChange(event);
                  if (onChange) onChange(event.target.value);
                }}
                sx={{ width: "100%" }}
                MenuProps={MenuProps}
                displayEmpty
              >
                {renderMenuItem}
              </Select>
            )}
          />
        )} */}
        {errors[id] && (
          <Text variant="body2" sx={(labelStyle, { color: "red" })}>
            {/* {errors[id]?.message} */}
            {errorMessage()}
          </Text>
        )}
      </div>
    </div>
  );
};

const FormDropDown2 = ({
  control,
  style,
  label,
  labelStyle,
  errors,
  id = "id",
  listDropdown = [],
  keyFilter = "",
  onChange,
}) => {
  const [customValue, setCustomValue] = useState("");
  const [isManualInput, setIsManualInput] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
        ...style,
      }}
    >
      <Text variant="body1" sx={labelStyle}>
        {label}
      </Text>
      <div
        style={{
          width: "100%",
          position: "relative",
          padding: "0px 0px 20px 0px",
        }}
      >
        <Controller
          name={id}
          control={control}
          render={({ field }) =>
            isManualInput ? (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="Type manually"
                value={customValue || field.value}
                onChange={(event) => {
                  setCustomValue(event.target.value);
                  field.onChange(event.target.value);
                  if (onChange) onChange(event.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setIsManualInput(false)}>
                        <EditIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: {
                    padding: "8px 0px",
                  },
                }}
              />
            ) : (
              <Select
                {...field}
                value={customValue || field.value}
                onChange={(event) => {
                  setCustomValue(event.target.value);
                  field.onChange(event.target.value);
                  if (onChange) onChange(event.target.value);
                }}
                displayEmpty
                fullWidth
              >
                {listDropdown.map((item, index) => (
                  <MenuItem key={index} value={item[keyFilter]}>
                    {item[keyFilter]}
                  </MenuItem>
                ))}
                <MenuItem onClick={() => setIsManualInput(true)}>
                  <EditIcon style={{ marginRight: 8 }} /> Type manually
                </MenuItem>
              </Select>
            )
          }
        />
        {errors[id] && (
          <Text variant="body2" sx={{ color: "red" }}>
            {errors[id]?.message}
          </Text>
        )}
      </div>
    </div>
  );
};

const FormDropDown3 = ({
  control,
  style,
  label,
  labelStyle,
  errors,
  id = "id",
  listDropdown = [],
  value,
  keyFilter = "",
  renderMenuItem,
  onChange,
}) => {
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

  const errorMessage = () => {
    const message = errors[id]?.message;
    const startIndex = message.indexOf(id);
    const output = message.slice(startIndex + id.length).trim();
    if (label === "Confirm Password") {
      return `Confirm ${output}`;
    }
    return `${label} ${output}`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
        ...style,
      }}
    >
      <Text variant="body1" sx={labelStyle}>
        {label}
      </Text>
      <div
        style={{
          width: "100%",
          position: "relative",
          padding: "0px 0px 20px 0px",
        }}
      >
        {renderMenuItem && (
          <Select
            value={value}
            onChange={onChange}
            sx={{ width: "100%" }}
            MenuProps={MenuProps}
            displayEmpty
          >
            {renderMenuItem}
          </Select>
        )}
        {errors[id] && (
          <Text variant="body2" sx={(labelStyle, { color: "red" })}>
            {errorMessage()}
          </Text>
        )}
      </div>
    </div>
  );
};

const FormInputWithSuggestions = ({
  type = "text",
  style,
  label,
  labelStyle,
  errors,
  register = null,
  id = "id",
  suggestions = [],
  onSuggestionSelect,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
        ...style,
      }}
    >
      <Text variant="body1" sx={labelStyle}>
        {label}
      </Text>
      <div style={{ width: "100%", position: "relative" }}>
        <TextField
          {...register(id)}
          id={id}
          type={type === "password" && !showPassword ? "password" : "text"}
          value={searchTerm}
          onChange={handleInputChange}
          style={{ width: "100%" }}
          {...props}
          InputProps={{
            endAdornment:
              type === "password" ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </IconButton>
                </InputAdornment>
              ) : null,
          }}
        />
        {filteredSuggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              width: "100%",
              background: "white",
              border: "1px solid #ccc",
              listStyle: "none",
              margin: 0,
              padding: 0,
              zIndex: 1000,
            }}
          >
            {filteredSuggestions.map((s, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(s)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
        {errors[id] && (
          <Text variant="body2" sx={{ color: "red", position: "absolute" }}>
            {errors[id]?.message}
          </Text>
        )}
      </div>
    </div>
  );
};

const SearchInput = ({ sx, id = "id", ...props }) => {
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
      }}
    >
      <TextField
        id={id}
        className={`without-padding`}
        sx={{
          "& .MuiInputBase-input": { p: 0 },
          sx,
        }}
        {...props}
        InputProps={{
          style: { fontSize: "12px", color: "#323A46", padding: "6px 10px" },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ width: "12px" }} />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

const SearchPhoneInput = ({ id = "id", ...props }) => {
  return (
    <TextField
      size="small"
      id={id}
      style={{
        padding: "0px",
      }}
      {...props}
      InputProps={{
        disableunderline: 1,
        endAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        style: {
          padding: "7.5px 20px 7.5px 6px",
          fontSize: "14px",
          borderRadius: "1000px",
        },
      }}
    />
  );
};

const CustomInput = ({ label, span, containerStyle, labelStyle, ...props }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "6px",
        flexDirection: "column",
        padding: { xs: "6px 0px", sm: "6px 0px", md: "6px 0px" },
        width: "100%",
        ...containerStyle,
      }}
    >
      <Text variant="body1" sx={labelStyle}>
        {label} {span}
      </Text>
      <BasicInput
        inputProps={{
          style: {
            padding: "6px 12px 6px 12px",
            lineHeight: "18px",
            fontSize: "12px",
          },
        }}
        {...props}
      />
    </Box>
  );
};

const InLineInput = ({ label, containerStyle, labelStyle, ...props }) => {
  return (
    <Box
      sx={[
        {
          display: "flex",
          flexDirection: { xs: "column", sm: "row", md: "row" },
          alignItems: { xs: "left", sm: "center", md: "center" },
          // padding: { xs: "6px 0px", sm: "12px 0px", md: "12px 0px" },
          width: "100%",
        },
        containerStyle,
      ]}
    >
      <Text
        variant="body1"
        sx={[
          { fontWeight: 500, width: "110px", marginRight: "16px" },
          labelStyle,
        ]}
      >
        {label}
      </Text>
      <BasicInput
        inputProps={{
          style: {
            padding: "12px 16px",
            lineHeight: "16px",
          },
        }}
        sx={{ width: { xs: "100%", sm: "100%", md: "420px" } }}
        {...props}
      />
    </Box>
  );
};

const FormRadioGroup = ({
  id = "id",
  label,
  labelStyle,
  style,
  errors,
  register = null,
  options = [], // [{ label: 'Option 1', value: '1' }, ...]
  inputRef,
  ...props
}) => {
  const errorMessage = () => {
    const message = errors[id]?.message;
    const startIndex = message?.indexOf(id);
    const output = message?.slice(startIndex + id.length).trim();
    return `${label} ${output}`;
  };

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
      <Text variant="body1" sx={labelStyle}>
        {label}
      </Text>
      <FormControl component="fieldset" error={!!errors[id]}>
        <RadioGroup row {...register(id)} id={id} ref={inputRef} {...props}>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
        {errors[id] && (
          <Text variant="body2" sx={{ color: "red", marginTop: "4px" }}>
            {errorMessage()}
          </Text>
        )}
      </FormControl>
    </div>
  );
};

export {
  CustomInput,
  FormInput,
  FormPhone,
  FormInputWithSuggestions,
  FormDropDown,
  FormDropDown2,
  FormDropDown3,
  SearchInput,
  SearchPhoneInput,
  InLineInput,
  FormRadioGroup,
};
