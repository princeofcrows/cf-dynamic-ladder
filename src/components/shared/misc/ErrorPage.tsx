import React from "react";

import { BiError } from "react-icons/bi";

type ErrorPageProps = { errorMessage?: string };

export default function ErrorPage(props: ErrorPageProps) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-[80vh]">
      <BiError size={72} className="text-red-700" />
      <p className="text-text-red-700 text-center text-lg font-semibold m-1">
        Error!
      </p>
      <p className="text-[#362B73] text-center text-sm font-normal m-1">
        {props.errorMessage ?? "Something went wrong!"}
      </p>
    </div>
  );
}
