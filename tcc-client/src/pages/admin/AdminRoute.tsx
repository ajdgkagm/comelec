import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isSignedIn } = useUser();
  const isAdmin = user?.publicMetadata?.isAdmin === true;

  if (!isSignedIn || !isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminRoute;