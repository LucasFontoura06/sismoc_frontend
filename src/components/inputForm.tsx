import { TextField, useTheme, InputBaseComponentProps } from "@mui/material";
import TextMaskCustom from "./inputFormMask";

interface InputFormProps {
  label: string;
  mask?: string;
  value: string;
  name?: string;
  type?: string;
  onChange: (event: any) => void;
  tamanhoMax?: number;
  isInvalid?: boolean;
  disabled?: boolean;
  msgError?: string | boolean;
  sx?: any;
  fullWidth?: boolean;
  id?: string;
  InputProps?: {
    endAdornment?: React.ReactNode;
    inputComponent?: React.ElementType<InputBaseComponentProps>;
    inputProps?: {
      mask?: string;
      maxLength?: number;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

const InputForm = ({
  label,
  mask,
  value,
  name,
  type = "text",
  onChange,
  tamanhoMax,
  isInvalid,
  disabled = false,
  msgError,
  sx,
  fullWidth = true,
  id,
  InputProps,
}: InputFormProps) => {
  const theme = useTheme();

  const defaultInputProps = mask ? {
    inputComponent: TextMaskCustom as any,
    inputProps: { mask, maxLength: tamanhoMax ?? 240 },
  } : undefined;

  return (
    <TextField
      id={id}
      label={label}
      fullWidth={fullWidth}
      type={type}
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
        ...sx
      }}
      value={value}
      name={name}
      onChange={onChange}
      error={isInvalid}
      helperText={msgError}
      disabled={disabled}
      InputProps={{ ...defaultInputProps, ...InputProps }}
    />
  );
};

export default InputForm;