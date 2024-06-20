import { create } from "zustand";
import { UserInfoParams } from "@/src/hooks/users/useUserInfo";

interface CodeforcesInfo {
  handle: string;
  params: UserInfoParams;
  setHandle: (value: string) => void;
  setParams: () => void;
}

export const useCodeforcesInfo = create<CodeforcesInfo>()((set) => ({
  handle: "",
  params: null,
  setHandle: (value) => {
    set({ handle: value });
  },
  setParams: () => {
    set((state) => {
      return { params: { handles: state.handle } };
    });
  },
}));
