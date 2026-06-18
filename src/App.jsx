import { useState } from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  // const [role, setRole] = useState(null);
  return (
    <>
      <Navbar />
      <AppRoutes/>
    </>
  );
}

export default App;
