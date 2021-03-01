import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";

interface ChipInputProps {
  label: string;
  value: unknown[];
  options: string[];
  onChange: (e: React.ChangeEvent<{}>, value: unknown[], reason?: string) => void;
  tagClass: string;
  errors?: string | null;
  fullWidth?: boolean;
  freeSolo?: boolean;
  allowDuplicates?: boolean;
  placeholder?: string;
}

const ChipInput: React.FC<ChipInputProps> = ({
  label,
  value,
  options,
  onChange,
  tagClass,
  errors,
  fullWidth = false,
  freeSolo = false,
  placeholder,
}) => {
  console.log(errors);
  return (
    <Autocomplete
      multiple
      freeSolo={freeSolo}
      fullWidth={fullWidth}
      options={options.sort((a, b) => -b.slice(0, 1).localeCompare(a.slice(0, 1)))}
      filterSelectedOptions
      autoComplete
      value={value || []}
      onChange={onChange}
      classes={{
        tag: tagClass,
      }}
      renderInput={(params): JSX.Element => (
        <TextField
          {...params}
          variant="outlined"
          placeholder={placeholder}
          label={label}
          fullWidth
          error={!!errors}
          helperText={errors}
        />
      )}
    />
  );
};

export default ChipInput;
