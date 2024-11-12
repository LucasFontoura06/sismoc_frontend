import React from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
} from '@mui/material';

interface SalarioInputProps {
  label?: string;
  id?: string;
  simbolo?: string;
  posicao?: 'start'|'end';
  value?: any; // Adicionado para suportar o valor
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Adicionado para suportar onChange
  isInvalid?: boolean; // Adicionado para suportar validação
  msgError?: string; // Adicionado para mostrar mensagem de erro
}

const SimboloField: React.FC<SalarioInputProps> = ({
  label = "Salário",
  id,
  simbolo,
  posicao = "start",
  value,
  onChange,
  isInvalid,
  msgError
}) => {
  return (
    <FormControl
      fullWidth
      error={isInvalid} // Indica se o campo tem erro
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
        "& .MuiInputAdornment-root": {
          "& p": {
            color: "#cbd5e1", // Cor do "R$"
          }
        },
      }}
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        id={id}
        startAdornment={<InputAdornment position={posicao}>{simbolo}</InputAdornment>}
        label={label}
        value={value} // Agora aceita o valor
        onChange={onChange} // Agora aceita o onChange
      />
      {isInvalid && <FormHelperText>{msgError}</FormHelperText>} {/* Mensagem de erro */}
    </FormControl>
  );
};

export default SimboloField;
