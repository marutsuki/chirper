import "./App.css";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
    return <MantineProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/"><Home/></Route>
            </Routes>
        </BrowserRouter>
    </MantineProvider>
}

export default App;
