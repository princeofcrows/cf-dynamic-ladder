import React from "react";
import withStateIndicator from "../shared/higher-order/withStateIndicator";
import { UserInfoType } from "@/src/types/users";
import Image from "next/image";
import classNames from "classnames";
import { colorSelectorBasedOnRating } from "@/src/helpers/logical-selectors";

type UserInfoProps = {
  user?: UserInfoType | null;
};

function UserInfo(props: UserInfoProps) {
  if (props.user == null) {
    return null;
  }

  const colorBasedOnRating = colorSelectorBasedOnRating(props.user.rating);
  const maxcolorBasedOnRating = colorSelectorBasedOnRating(
    props.user.maxRating
  );

  return (
    <div className="flex gap-2 mt-4 bg-white shadow-sm p-6 w-fit rounded-lg">
      <Image
        width={300}
        height={300}
        src={props.user.titlePhoto}
        alt={"User Photo"}
        className="rounded-xl shadow-sm border-1 border-dotted"
      />
      <div className="flex flex-col justify-center m-2">
        <p
          className={classNames("text-base font-bold", {
            ...colorBasedOnRating,
          })}
        >
          {props.user.handle}
        </p>
        <p
          className={classNames("text-sm font-semibold", {
            ...colorBasedOnRating,
          })}
        >
          {props.user.rank}
        </p>
        <p className="mt-1">
          <span className={"text-sm font-semibold text-blue-900"}>
            {"Rating:  "}
          </span>
          <span
            className={classNames("text-sm font-semibold", {
              ...colorBasedOnRating,
            })}
          >
            {props.user.rating ?? "Unrated"}
          </span>
        </p>
        <p>
          <span className={"text-sm font-semibold text-blue-900"}>
            {"Max:  "}
          </span>
          <span
            className={classNames("text-sm font-semibold", {
              ...maxcolorBasedOnRating,
            })}
          >
            {props.user.maxRating ?? "Unrated"}
          </span>
          <span
            className={classNames("text-sm italic font-semibold", {
              ...maxcolorBasedOnRating,
            })}
          >
            {` (${props.user.maxRank})`}
          </span>
        </p>
      </div>
    </div>
  );
}

export default withStateIndicator<UserInfoProps>(UserInfo);
