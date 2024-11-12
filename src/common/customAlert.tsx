import { Alert, AlertTitle, Slide } from "@mui/material";

interface CustomAlertProps {
  message: string;
  severity: "success" | "error" | "info" | "warning";
  show: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, severity, show }) => {
  return (
    <Slide direction="up" in={show} mountOnEnter unmountOnExit>
      <Alert
        severity={severity}
        sx={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: '90%',
          maxWidth: 600
        }}
      >
        <AlertTitle>{severity === "success" ? "Sucesso" : "Erro"}</AlertTitle>
        {message}
      </Alert>
    </Slide>
  );
};

export default CustomAlert;
