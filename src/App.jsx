import "./styles/global.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

import Home from "./pages/Home.jsx";
import Sectors from "./pages/sectors.jsx";
import About from "./pages/About.jsx";
import Dashboard from "./pages/dashboard/index.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/profile/index.jsx";
import MainLoader from "./components/MainLoader";
import Spinner from "./components/Spinner";
import Payment from "./pages/dashboard/components/payment.jsx";
import Withdraw from "./pages/dashboard/components/withdraw.jsx";
import CoinTrendPage from "./pages/dashboard/components/cointrendpage.jsx";
import ActivePlan from "./pages/dashboard/components/activeplans.jsx"; // <-- Add this import
import Airtime from "./pages/dashboard/components/airtime.jsx"; // <-- Import Airtime component
import Data from "./pages/dashboard/components/data.jsx"; // <-- Import Data component
import Transactions from "./pages/dashboard/components/transactions.jsx"; // <-- Import the Transactions component
import FacialRecognition from "./pages/FacialRecognition";
import SetTransactionCode from "./pages/SetTransactionCode";
import SetLoginPin from "./pages/setloginpin"; // <-- Add this import
import Reward from "./pages/dashboard/components/reward.jsx"; // <-- Import Reward component
import ForgotPassword from "./pages/forgot-password.jsx"; // <-- Import the ForgotPassword page

function AppRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only show MainLoader on first load of Home page
    if (location.pathname === "/") {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  if (loading && location.pathname === "/") return <MainLoader />;
  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-[#090b14] text-white relative">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sectors" element={<Sectors />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/payment" element={<Payment />} />
        <Route path="/dashboard/withdraw" element={<Withdraw />} />
        <Route path="/dashboard/cointrend/:symbol" element={<CoinTrendPage />} />
        <Route path="/dashboard/activeplans" element={<ActivePlan />} />
        <Route path="/dashboard/airtime" element={<Airtime />} />
        <Route path="/dashboard/data" element={<Data />} />
        <Route path="/dashboard/transactions" element={<Transactions />} /> {/* <-- Add this line */}
        <Route path="/dashboard/rewards" element={<Reward />} /> {/* <-- Add this line */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/facial-recognition" element={<FacialRecognition />} />
        <Route path="/set-transaction-code" element={<SetTransactionCode />} />
        <Route path="/setloginpin" element={<SetLoginPin />} /> {/* <-- Add this line */}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* <-- Add this line */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;

