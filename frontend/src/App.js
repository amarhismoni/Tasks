import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home'
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
    return (
        <div className="App">
            
          
            <BrowserRouter>
                <Routes>
                  <Route path="/" exact element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
