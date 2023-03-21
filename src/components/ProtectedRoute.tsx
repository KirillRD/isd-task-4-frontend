import { Navigate } from "react-router-dom";
import { UserAuth } from "../types/user-auth.type";
import { ApiRoutes } from "../utils/constant";

type ProtectedRouteProps = {
  user: UserAuth | null;
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  if (!user) {
    return <Navigate to={ApiRoutes.DEFAULT} />;
  }

  return children;
};
