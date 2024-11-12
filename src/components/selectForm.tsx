import { FormControl, FormHelperText, InputLabel, MenuItem, Select, useTheme } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

const SelectForm = (props: any) => {
  const theme = useTheme();
  const { 
    label, 
    itens, 
    value, 
    onChange, 
    disabled, 
    isInvalid, 
    msgError, 
    explicit=false, 
    customStyles, 
    isKeyId 
  } = props;

  const baseStyles = {
    backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
    color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#000000',
    borderColor: theme.palette.mode === 'dark' ? '#cbd5e1' : '#666666',
  };

  return (
    <FormControl variant="outlined" fullWidth error={isInvalid}>
      <InputLabel
        id={label}
        sx={{
          color: baseStyles.color,
          transform: "translate(14px, 16px) scale(1)",
          "&.Mui-focused": {
            color: baseStyles.color,
          },
          "&.MuiInputLabel-shrink": {
            transform: "translate(14px, -9px) scale(0.75)",
            paddingX: 1,
            backgroundColor: baseStyles.backgroundColor,
          },
          ...(customStyles || {}),
        }}
      >
        {label}
      </InputLabel>
      <Select
        labelId={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={isInvalid}
        sx={{
          color: baseStyles.color,
          backgroundColor: baseStyles.backgroundColor,
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: baseStyles.borderColor,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: baseStyles.borderColor,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: baseStyles.borderColor,
          },
          "& .MuiSelect-icon": {
            color: baseStyles.color,
          },
          "& .MuiMenuItem-root": {
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          },
          ...(customStyles || {}),
        }}
      >
        {itens?.map((item: any) => (
          <MenuItem
            key={uuidv4()}
            value={explicit ? item.label : item.codigo}
            sx={{
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#f5f5f5',
              },
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {isInvalid && (
        <FormHelperText sx={{ color: theme.palette.error.main }}>
          {msgError}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectForm;
