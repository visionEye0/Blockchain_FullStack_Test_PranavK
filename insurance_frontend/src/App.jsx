import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PolicyList from "./pages/PolicyList";
import PolicyDetail from "./pages/PolicyDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PolicyList />} />
        <Route path="/policy/:id" element={<PolicyDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
