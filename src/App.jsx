import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Login} from "../src/page/Login/Login"
import {Dashboard} from "./page/Dashboard/Dashboard"


function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Login />} />
          <Route path="/home" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
