import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import ArticlesPage from "./pages/ArticlesPage.jsx";
import About from "./pages/About.jsx";
import Counterbalance from "./pages/Counterbalance.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminArticles from "./admin/AdminArticles.jsx";
import AdminArticleEdit from "./admin/AdminArticleEdit.jsx";
import AdminNavigation from "./admin/AdminNavigation.jsx";
import AdminHomeSections from "./admin/AdminHomeSections.jsx";
import AdminMosaic from "./admin/AdminMosaic.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="articles" element={<AdminArticles />} />
        <Route path="articles/:slug" element={<AdminArticleEdit />} />
        <Route path="navigation" element={<AdminNavigation />} />
        <Route path="home-sections" element={<AdminHomeSections />} />
        <Route path="mosaic" element={<AdminMosaic />} />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/:slug" element={<ArticlePage />} />
        <Route path="about" element={<About />} />
        <Route path="counterbalance" element={<Counterbalance />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
