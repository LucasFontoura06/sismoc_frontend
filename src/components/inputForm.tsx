import { TextField, useTheme } from "@mui/material";
import InputFormMask from "./inputFormMask";

const InputForm = (props: any) => {
  const theme = useTheme();
  const {
    label,
    mask,
    value,
    name,
    type,
    onChange,
    tamanhoMax,
    isInvalid,
    disabled = false,
    msgError,
  } = props;

  return (
    <TextField
      label={label}
      fullWidth
      type={type ?? "text"}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: theme.palette.mode === 'dark' ? '#cbd5e1' : '#666666',
          },
          "&:hover fieldset": {
            borderColor: theme.palette.mode === 'dark' ? '#cbd5e1' : '#666666',
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.mode === 'dark' ? '#cbd5e1' : '#666666',
          },
          "& input": {
            color: theme.palette.mode === 'dark' ? '#fff' : '#000000',
          },
        },
        "& .MuiInputLabel-root": {
          color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#666666',
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#666666',
        },
        "& .MuiFormHelperText-root": {
          color: theme.palette.error.main,
        },
        ...(props.sx || {}), // Permite sobrescrever estilos via prop
      }}
      value={value}
      name={name}
      onChange={onChange}
      error={isInvalid}
      helperText={msgError}
      disabled={disabled}
      InputProps={{
        inputComponent: InputFormMask,
        inputProps: { mask: mask, maxLength: tamanhoMax ?? 240 },
      }}
    />
  );
};

export default InputForm;