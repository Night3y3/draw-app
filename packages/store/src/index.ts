import { create } from "zustand";

interface AuthState {
  accessToken: string;
  addAccessToken: (token: string) => void;
  removeAccessToken: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: "", // Initial state
  addAccessToken: (token: string) => set({ accessToken: token }), // Function to set the access token
  removeAccessToken: () => set({ accessToken: "" }), // Function to remove the access token
}));

export default useAuthStore;
