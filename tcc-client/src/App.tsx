import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import Auth from "./pages/auth/Auth";
import { AdminDashboard } from "./pages/admin";
import { RecordFormList } from "./pages/admin/RecordFormList";
import Sidenav from "./pages/admin/Sidenav";
import { ComelecRecordsProvider } from "./contexts/comelec-record-context";
import NewsPage from "./pages/admin/NewsPage";
import AdminNews from "./pages/admin/AdminNews";
import { useUser } from "@clerk/clerk-react";


export default function App() {
  return (
    <ComelecRecordsProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/news" element={<NewsPage />} />
        {/* <Route path="/adminNews" element={<AdminNews />} /> */}
        {/* Admin routes */}
        <Route
          path="/admin"
          element={ 
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/adminNews"
          element={ 
            <AdminRoute>
              <AdminNews />
            </AdminRoute>
          }
        />
        <Route
          path="/votersRecord"
          element={
            <AdminRoute>
              <RecordFormList />
            </AdminRoute>
          }
        />
      </Routes>
    </ComelecRecordsProvider>
  );
}

// Protect admin routes
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();

  // Wait until Clerk finishes loading
  if (!isLoaded) return <div>Loading...</div>;

  const isAdmin =
    user?.publicMetadata?.isAdmin === true ||
    user?.publicMetadata?.isAdmin === "true" ||
    user?.publicMetadata?.role === "admin";

  // Debug log
  console.log("Signed In:", isSignedIn);
  console.log("User:", user);
  console.log("Is Admin:", isAdmin);

  if (!isSignedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

// Admin layout with fixed sidenav
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-container">
      <Sidenav />
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
