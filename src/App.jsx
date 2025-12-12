import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Login from "../src/page/Login/Login"
import Dashboard from "./page/Dashboard/Dashboard"
import TabelaNova from "./page/TabelaNova/TabelaNova"
import TabelasAntigas from "./page/TabelasAntigas/TabelasAntigas"


function App() {
  return (
    <BrowserRouter>
      <Routes>
         {/* <Route path="/" element={<Login />} /> */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/tabelaNova" element={<TabelaNova />} />
          <Route path="/tabelasAntigas" element={<TabelasAntigas />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
