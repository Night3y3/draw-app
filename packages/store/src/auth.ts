import { create } from "zustand";

interface AuthState {
  accessToken: string;
  addAccessToken: (token: string) => void;
  removeAccessToken: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: "",
  addAccessToken: (token: string) => set({ accessToken: token }),
  removeAccessToken: () => set({ accessToken: "" }),
}));

export default useAuthStore;
