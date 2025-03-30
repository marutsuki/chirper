import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/app/routes/home/Home";
import Landing from "@/app/routes/(root)/Landing";
import Login from "@/app/routes/login/Login";
import Register from "@/app/routes/register/Register";
import { AuthProvider } from "@/app/AuthContext";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
