import { useState } from "react";
import DashBoardLayouts from "./Layout/DashBoardLayouts";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import Login from "./pages/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route
          path="/dashboard" element={ isLoggedIn ? <DashBoardLayouts /> 
            : <Navigate to="/login" />}/>
            
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
