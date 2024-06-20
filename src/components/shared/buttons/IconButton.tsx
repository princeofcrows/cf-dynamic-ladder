import { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type IconButtonProps = { icon: ReactNode } & HTMLAttributes<HTMLDivElement>;

export default function IconButton(props: IconButtonProps) {
  return (
    <div
      onClick={props?.onClick}
      className={twMerge(
        "flex justify-center items-center rounded-full hover:bg-slate-100 cursor-pointer h-8 w-8",
        props.className
      )}
    >
      {props.icon}
    </div>
  );
}
