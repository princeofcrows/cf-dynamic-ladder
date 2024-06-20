import { Field, Input, Label } from "@headlessui/react";
import classNames from "classnames";
import { Fragment, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type TextInputProps = {
  id: string;
  value?: string;
  label?: string;
} & HTMLAttributes<HTMLInputElement>;

export default function TextInput(props: TextInputProps) {
  return (
    <Field className={twMerge("flex flex-col", props.className)}>
      <Label className="text-xs text-blue-900">{props.label}</Label>
      <Input as={Fragment}>
        {({ focus, hover }) => (
          <input
            id={props.id}
            className={classNames(
              "rounded-full border-1 border-solid px-4 py-1",
              {
                "border-pink-700 outline-none": focus,
                "border-blue-900": !focus,
              }
            )}
          />
        )}
      </Input>
    </Field>
  );
}