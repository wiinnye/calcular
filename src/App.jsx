import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./services/firebase"; 
import { doc, getDoc } from "firebase/firestore";
import Login from "../src/page/Login/Login"
import Dashboard from "./page/Dashboard/Dashboard"
import TabelaNova from "./page/TabelaNova/TabelaNova"
import TabelasAntigas from "./page/TabelasAntigas/TabelasAntigas"
import { useEffect, useState } from "react";


function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUsuario({ ...user, tipo: docSnap.data().tipo });
        } else {
          setUsuario(user); 
        }
      } else {
        setUsuario(null);
      }
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  if (carregando) {
    return (
      <Flex justify='center' align='center'>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
          {!usuario ? (
          <>
            <Route path="/" element={<Login />} />
          </>
        ) : (
          <>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/tabelaNova" element={<TabelaNova />} />
          <Route path="/tabelasAntigas" element={<TabelasAntigas />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App;
