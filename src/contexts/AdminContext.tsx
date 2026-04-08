import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const ADMIN_KEY = "palexpress_admin";
const ADMIN_CODE = "ADMIN_08";

interface AdminContextType {
  isAdmin: boolean;
  login: (code: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem(ADMIN_KEY) === "true";
  });

  useEffect(() => {
    if (isAdmin) {
      sessionStorage.setItem(ADMIN_KEY, "true");
    } else {
      sessionStorage.removeItem(ADMIN_KEY);
    }
  }, [isAdmin]);

  const login = (code: string): boolean => {
    if (code === ADMIN_CODE) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAdmin(false);

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
