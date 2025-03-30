import { useLocalStorage } from "@campus/runtime/local-storage";

export const useAuthToken = () => useLocalStorage("token");
