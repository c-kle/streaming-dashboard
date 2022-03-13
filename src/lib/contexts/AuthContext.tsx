import * as React from 'react';

interface AuthContextType {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const storedToken = localStorage.getItem('session_token');
  const [token, setToken] = React.useState<string>(storedToken || '');

  React.useEffect(() => {
    localStorage.setItem('session_token', token);
  }, [token]);

  const value = { token, setToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
