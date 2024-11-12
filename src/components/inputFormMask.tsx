import { TextField } from "@mui/material";
import { IMaskInput } from "react-imask";
import React from "react";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  mask: string;
}

interface InputFormMaskProps {
  label: string;
  value: string;
  name: string;
  mask: string;
  onChange: (event: any) => void;
  disabled?: boolean;
  isInvalid?: boolean;
  msgError?: string | boolean;
  sx?: any;
}

const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, mask, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask={mask}
        definitions={{
          "#": /[0-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  }
);

const InputFormMask: React.FC<InputFormMaskProps> = ({
  label,
  value,
  name,
  mask,
  onChange,
  disabled = false,
  isInvalid = false,
  msgError,
  sx,
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      name={name}
      disabled={disabled}
      error={isInvalid}
      helperText={msgError}
      sx={sx}
      InputProps={{
        inputComponent: TextMaskCustom as any,
        inputProps: {
          mask: mask,
        },
      }}
    />
  );
};

InputFormMask.displayName = 'InputFormMask';

export default InputFormMask;