import { create } from "zustand";

interface UserState {
  id: string;
  email: string;
  name: string;
  photo: string | null;
  setUserData: (data: {
    id: string;
    email: string;
    name: string;
    photo: string | null;
  }) => void;
  clearUserData: () => void;
}

const useUserStore = create<UserState>((set) => ({
  id: "",
  email: "",
  name: "",
  photo: null,
  setUserData: (data) =>
    set({
      id: data.id,
      email: data.email,
      name: data.name,
      photo: data.photo,
    }),
  clearUserData: () =>
    set({
      id: "",
      email: "",
      name: "",
      photo: null,
    }),
}));

export default useUserStore;
