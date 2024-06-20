"use client";

import { useUserInfo } from "@/src/hooks/users/useUserInfo";
import PageHeader from "@/src/components/shared/titles/PageHeader";

const Home = () => {
  const {
    isLoading,
    isSuccess,
    data: clientList,
    refetch,
  } = useUserInfo({ handles: "prince_of_crows" });

  return (
    <div className="bg-white-700 mx-auto w-full h-full p-10">
      <PageHeader
        className=" bg-gradient-to-r from-black from-10% via-blue-500 to-blue-700 inline-block text-transparent bg-clip-text"
        title="CODEFORCES Analytics"
      />
    </div>
  );
};

export default Home;
