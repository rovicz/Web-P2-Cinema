import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Navbar } from "./components/Navbar";
import { Filmes } from "./pages/Filmes";
import { Salas } from "./pages/Salas";
import { Sessoes } from "./pages/Sessoes";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container mt-4">
        <Routes>
          <Route path="/filmes" element={<Filmes />} />
          <Route path="/salas" element={<Salas />} />
          <Route path="/sessoes" element={<Sessoes />} />
          <Route path="/" element={<Filmes />} />
        </Routes>
      </main>
      <Toaster richColors />
    </Router>
  );
}

export default App;