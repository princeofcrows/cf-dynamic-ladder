import { AxiosClient } from "@/src/helpers/api-client";
import { useQuery } from "@tanstack/react-query";

export type UserInfoParams = {
  handles: string;
} | null;

export const useUserInfo = (params: UserInfoParams) =>
  useQuery({
    queryKey: ["user-info", params],
    async queryFn() {
      if (params == null) {
        return null;
      }

      const { data } = await AxiosClient.get("/user.info", {
        params: { ...params, lang: "en" },
      });
      return data;
    },
  });
