import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

interface Item {
  codigo: string | number;
  descricao: string;
}

interface SelectChipFormProps {
  id?: string;
  label: string;
  itens: Item[];
  value: string[];
  onChange: (event: any) => void;
  isInvalid?: boolean;
  msgError?: string | boolean;
}

const SelectChipForm = ({
  id,
  label,
  itens,
  value,
  onChange,
  isInvalid,
  msgError,
}: SelectChipFormProps) => {
  return (
    <FormControl variant="outlined" fullWidth error={isInvalid}>
      <InputLabel
        id={label}
        sx={{
          color: "#cbd5e1",
          transform: "translate(14px, 16px) scale(1)",
          "&.Mui-focused": {
            color: "#cbd5e1",
          },
          "&.MuiInputLabel-shrink": {
            transform: "translate(14px, -9px) scale(0.75)",
            paddingX: 1,
            backgroundColor: "#242833",
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        multiple={true}
        labelId={label}
        value={value}
        onChange={onChange}
        error={isInvalid}
        input={<OutlinedInput id="select-multiple-chip" label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {Array.isArray(selected) && selected.map((value) => {
              const item = itens.find(
                (element) => element.codigo === value
              );
              return item ? (
                <Chip 
                  key={item.codigo} 
                  label={item.descricao ?? (item as any).label} 
                  color="secondary"
                />
              ) : null;
            })}
          </Box>
        )}
        sx={{
          color: "#cbd5e1",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "#cbd5e1",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#cbd5e1",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#cbd5e1",
          },
        }}
      >
        {itens.map((item: any) => (
          <MenuItem
            key={item.codigo}
            value={item.codigo}
          >
            {item.descricao ?? item.label}
          </MenuItem>
        ))}
      </Select>
      {isInvalid && msgError && (
        <FormHelperText>{msgError}</FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectChipForm;
