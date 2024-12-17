import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
