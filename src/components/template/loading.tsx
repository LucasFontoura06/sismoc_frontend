import { Backdrop } from "@mui/material";
import { Atom } from "react-loading-indicators";

const Loading = (props: any) => {
  return <Backdrop
    open={props.open}
    sx={{
      color: "#fff",
      zIndex: (theme) => theme.zIndex.drawer + 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    }}
  >
    <Atom color="#cbd5e1" size="large" text="" textColor="#b7d350" />
  </Backdrop>;
};

export default Loading;
