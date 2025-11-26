import React, {
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import lodash from 'lodash';

import api from '@/Apis';
import request from '@/Utils/Request';

export interface UserProfile {
  nickname?: string;
  avatar?: string;
  intro?: string;
}

export interface User {
  id: number;
  token: string;
  isAdmin: boolean;
  profile: UserProfile,
}

interface UserContext {
  user?: User;
  token?: string;
  login: (user: UserLoginProps) => void;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
}

interface UserLoginProps {
  user: User,
  token: string,
  keepAuthenticated?: boolean;
}

const userContext = React.createContext<UserContext>({
  login: () => undefined,
  logout: () => undefined,
  updateProfile: () => undefined,
});

export const UserProvider: React.FC<{
  children: React.ReactNode,
}> = (props: { children:React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(
    localStorage.getItem('user') || sessionStorage.getItem('user')
      ? JSON.parse(String(localStorage.getItem('user') || sessionStorage.getItem('user')))
      : undefined,
  );
  const [token, setToken] = useState<string | undefined>(
    localStorage.getItem('token') || sessionStorage.getItem('token') || undefined,
  );
  const userRef = useRef<User>();
  const { children } = props;

  const login = (loginProps: UserLoginProps) => {
    const { user: loginUser, keepAuthenticated, token: loginToken } = loginProps;
    setUser(loginUser);
    setToken(loginToken);
    sessionStorage.setItem('user', JSON.stringify(loginUser));
    sessionStorage.setItem('token', loginToken);
    if (keepAuthenticated) {
      localStorage.setItem('user', JSON.stringify(loginUser));
      localStorage.setItem('token', loginToken);
    }
    window.location.reload();
  };

  const logout = () => {
    setUser(undefined);
    setToken(undefined);
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
  };

  const updateProfile = (profile: UserProfile) => {
    const newUser = { ...userRef.current, profile };
    setUser(newUser as User);
    sessionStorage.setItem('user', JSON.stringify(newUser));
    if (localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userString) {
      setUser(JSON.parse(userString));
    }
    const userToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (userToken) {
      setToken(userToken);
    }
  }, []);

  useEffect(() => {
    userRef.current = user;
    if (user) {
      request.get(api.user.profile.get).then((res) => {
        if (res.status === 200) {
          const newProfile = res.data;
          if (!lodash.isEqual(user.profile, newProfile)) {
            updateProfile(newProfile);
          }
        }
      }).catch(() => {
        logout();
      });
    }
  }, [user]);

  return (
    <userContext.Provider value={{
      login,
      logout,
      updateProfile,
      user,
      token,
    }}
    >
      {children}
    </userContext.Provider>
  );
};

const useUser = (): UserContext => useContext(userContext);

export default useUser;
