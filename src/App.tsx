import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProduitPage from "./pages/ProduitPage";
import RecherchePage from "./pages/RecherchePage";
import CategoriePage from "./pages/CategoriePage";
import DashboardPage from "./pages/DashboardPage";
import AjouterProduitPage from "./pages/AjouterProduitPage";
import AuthPage from "./pages/AuthPage";
import ComparePage from "./pages/ComparePage";
import VendorProfilePage from "./pages/VendorProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import MarketplacePage from "./pages/MarketplacePage";
import AdminPage from "./pages/AdminPage";
import BottomNav from "./components/BottomNav";
//import ChatbotAssistant from "./components/ChatbotAssistant";

export default function App() {
  return (
    <Router>
      <div className="pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produit/:id" element={<ProduitPage />} />
          <Route path="/recherche" element={<RecherchePage />} />
          <Route path="/vendeur/:id" element={<VendorProfilePage />} />
          <Route path="/categorie/:slug" element={<CategoriePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/ajouter" element={<AjouterProduitPage />} />
          <Route path="/connexion" element={<AuthPage />} />
          <Route path="/comparer" element={<ComparePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {/* <ChatbotAssistant /> */}
        <BottomNav />
      </div>
    </Router>
  );
}
