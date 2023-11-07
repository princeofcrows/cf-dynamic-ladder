"use client";

import { useUserInfo } from "@/src/hooks/users/useUserInfo";

const Home = () => {
  const {
    isLoading,
    isSuccess,
    data: clientList,
    refetch,
  } = useUserInfo({ handles: "prince_of_crows" });

  return <p>Hello World!!!</p>;
};

export default Home;
