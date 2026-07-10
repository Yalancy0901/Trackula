import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Savings from "./pages/Savings";
// import Yearbook from "./pages/Yearbook";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout />}>

          <Route path="/" element={<Dashboard />} />

          <Route path="/savings" element={<Savings />} />

          {/* <Route path="/yearbook" element={<Yearbook />} /> */}

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App; 