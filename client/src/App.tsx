import { useState, useContext, createContext } from "react";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { store } from "./store/store";

import { MainPage, LoginPage } from "./components/organisms";

type TokenContextType = string | null;

export const TokenContext = createContext<TokenContextType>(null);

const ProtectedRoute = ({ element }: any) => {
  const token = useContext<TokenContextType>(TokenContext);
  return token ? element : <Navigate to="/login" />;
};

function App() {
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem("token")
  );

  const theme = createTheme({
    palette: {
      primary: {
        main: "#549FA4",
      },
      secondary: {
        main: "#4D6066",
      },
    },
  });

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <TokenContext.Provider value={token}>
            <Routes>
              <Route
                path="/"
                element={<ProtectedRoute element={<MainPage setToken={setToken}/>} />}
              />
              <Route path="/login" element={<LoginPage setToken={setToken} />} />
            </Routes>
          </TokenContext.Provider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
