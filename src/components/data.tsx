import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br'; // Importa a localização para o português do Brasil
import { useTheme } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';

interface ControlledComponentProps {
  label: string;
  value: Dayjs | null; // Aceita o valor da data externamente
  onChange: (newValue: Dayjs | null) => void; // Função de callback para mudança de valor
  isInvalid?: boolean;
  msgError?: string | boolean;
  customStyles?: any;
  disableFuture?: boolean;
  disablePast?: boolean;
}

export default function ControlledComponent({
  label,
  value,
  onChange,
  isInvalid = false,
  msgError = "",
  customStyles = {},
  disableFuture = false,
  disablePast = false,
}: ControlledComponentProps) {
  const theme = useTheme();

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="pt-br" // Configura o idioma para português do Brasil
    >
      <DatePicker
        label={label}
        value={value} // Usa o valor recebido por props
        onChange={onChange} // Dispara a função onChange recebida por props
        format="DD/MM/YYYY" // Define o formato da data para o padrão brasileiro
        disableFuture={disableFuture}
        disablePast={disablePast}
        sx={{
          width: '100%',
          '& .MuiInputBase-input': {
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Cor do texto
          },
          '& .MuiInputLabel-root': {
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Cor do label
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Cor da borda
            },
            '&:hover fieldset': {
              borderColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Cor da borda ao hover
            },
          },
        }}
      />
      {isInvalid && msgError && (
        <FormHelperText error>{msgError}</FormHelperText>
      )}
    </LocalizationProvider>
  );
}

