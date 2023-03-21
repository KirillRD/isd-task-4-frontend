import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { UserAuth } from "../types/user-auth.type"
import { getRefreshToken, removeTokens, saveTokens } from '../services/token-storage.service';
import { Tokens } from "../types/token.type";
import { getAuthUser, isAuth } from "../services/user-auth.service";
import { updateTokens } from './../services/user-auth.service';
import { useNavigate } from 'react-router-dom';
import { ApiRoutes } from "../utils/constant";

export type CreateUserContext = {
  user: UserAuth | null;
  setUser: (tokens: Tokens) => void;
  removeUser: () => void;
};

export type ProviderProps = {
  children: ReactNode;
}

const UserContext = createContext<CreateUserContext>({
  user: null,
  setUser: (tokens) => {},
  removeUser: () => {},
});

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider: FC<ProviderProps> = ({children}) => {
  const [user, setUser] = useState<UserAuth | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth()) {
      setUser(getAuthUser());
    } else {
      if (getRefreshToken()) {
        updateUserTokens();
      } else {
        setUser(null);
      }
    }
  }, []);

  const updateUserTokens = async () => {
    try {
      await updateTokens();
      setUser(getAuthUser());
    } catch {
      removeTokens();
      setUser(null);
      navigate(ApiRoutes.DEFAULT);
    }
  };

  const handleSetUser = useCallback((tokens: Tokens) => {
    saveTokens(tokens);
    setUser(getAuthUser());
  }, []);

  const handleRemoveUser = useCallback(() => {
    removeTokens();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser: handleSetUser,
      removeUser: handleRemoveUser,
    }),
    [user, handleSetUser, handleRemoveUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
