import { TextField } from "@mui/material";
import InputFormMask from "./inputFormMask";
import { isError } from "util";

const InputFormMultiline = (props: any) => {
  const {
    label,
    value,
    name,
    onChange,
    tamanhoMax,
    isInvalid,
    msgError,
  } = props;

  return (
    <TextField
      label={label}
      fullWidth
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#cbd5e1",
          },
          "&:hover fieldset": {
            borderColor: "#cbd5e1",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#cbd5e1",
          },
          "& input": {
            color: "#fff",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#cbd5e1",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#cbd5e1",
        },
      }}
      value={value}
      name={name}
      multiline
      rows={4}
      onChange={onChange}
      error={isInvalid}
      helperText={msgError}
      InputProps={{
        style: { color: '#fff' }, 
        inputProps: { maxLength: tamanhoMax ?? 360 },
      }}
    />
  );
};

export default InputFormMultiline;