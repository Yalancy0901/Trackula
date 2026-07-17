import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard, {
  type SavingsItem,
  type Transaction,
} from "./pages/Dashboard";
import Savings from "./pages/Savings";
// import Investments from "./pages/Investments";
// import Yearbook from "./pages/Yearbook";

function App() {
  // Savings
  const [savings, setSavings] = useState<SavingsItem[]>([
    {
      id: 1,
      name: "Europe Trip",
      amount: 35000,
    },
    {
      id: 2,
      name: "Coach Bag",
      amount: 15000,
    },
  ]);

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Dashboard
                savings={savings}
                setSavings={setSavings}
                transactions={transactions}
                setTransactions={setTransactions}
              />
            }
          />

          <Route
            path="/savings"
            element={
              <Savings
                savings={savings}
                setSavings={setSavings}
              />
            }
          />

          {/* Future Pages */}

          {/* 
          <Route
            path="/investments"
            element={<Investments />}
          />

          <Route
            path="/yearbook"
            element={<Yearbook />}
          />
          */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;