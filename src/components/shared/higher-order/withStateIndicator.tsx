import React from "react";
import Loading from "../misc/Loading";
import ErrorPage from "../misc/ErrorPage";

type IndicatorType = {
  isLoading?: boolean | null;
  isError?: boolean | null;
  errorMessage?: string;
};

export default function withStateIndicator<T>(Component: React.FC<T>) {
  const WithLoadingAndError = (props: T & IndicatorType) => {
    if (props.isLoading) return <Loading />;
    if (props.isError) return <ErrorPage errorMessage={props.errorMessage} />;

    return <Component {...props} />;
  };

  return WithLoadingAndError;
}
