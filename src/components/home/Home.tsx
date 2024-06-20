"use client";

import { useUserInfo } from "@/src/hooks/users/useUserInfo";
import PageHeader from "@/src/components/shared/titles/PageHeader";
import TextInput from "../shared/inputs/TextInput";
import { useCodeforcesInfo } from "@/src/hooks/stores/useCodeforcesInfo";

const Home = () => {
  const { handle, setHandle, params, setParams } = useCodeforcesInfo();
  const { isLoading, data: clientList } = useUserInfo(params);

  return (
    <div className="bg-sky-300/10 mx-auto w-full h-screen p-10">
      <PageHeader
        className=" bg-gradient-to-r  from-black from-10% via-blue-500 to-blue-700 inline-block text-transparent bg-clip-text"
        title="Codeforces Analytics"
      />
      <form>
        <TextInput
          id="cf-handle"
          className="mt-2 w-1/3"
          label="Codeforces Handle"
          value={handle}
          onTextChange={(value) => setHandle(value)}
        />
      </form>
    </div>
  );
};

export default Home;
