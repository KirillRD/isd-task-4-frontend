import { Navigate } from "react-router-dom";
import { UserAuth } from "../types/user-auth.type";
import { ApiRoutes } from "../utils/constant";

type GuestRouteProps = {
  user: UserAuth | null;
  children: JSX.Element;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ user, children }) => {
  if (user) {
    return <Navigate to={ApiRoutes.DEFAULT} />;
  }

  return children;
};
