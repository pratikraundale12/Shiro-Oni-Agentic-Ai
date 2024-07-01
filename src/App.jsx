import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, theme } from "./styles";
import { GlobalProvider } from "./utils";
import Routes from "./routes";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <GlobalProvider>
        <Routes />
      </GlobalProvider>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
