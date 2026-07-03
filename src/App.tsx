import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
// import Expenses from "./pages/Expenses";
// import Income from "./pages/Income";
// import Savings from "./pages/Savings";
// import Analytics from "./pages/Analytics";
// import Yearbook from "./pages/Yearbook";
// import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<Layout />}>

          <Route path="/" element={<Dashboard />} />

          {/* <Route path="/expenses" element={<Expenses />} />

          <Route path="/income" element={<Income />} />

          <Route path="/savings" element={<Savings />} />

          <Route path="/analytics" element={<Analytics />} />

          <Route path="/yearbook" element={<Yearbook />} />

          <Route path="/settings" element={<Settings />} /> */}

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;