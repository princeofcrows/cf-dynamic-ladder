import { Field, Input, Label } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, HTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type TextInputProps = {
  id: string
  value?: string
  label?: string
  onTextChange?: (value: string) => void
  iconRight?: ReactNode
  iconLeft?: ReactNode
} & HTMLAttributes<HTMLInputElement>

export default function TextInput(props: TextInputProps) {
  const hasLeftIcon = !!props.iconLeft

  return (
    <Field className={twMerge('flex flex-col', props.className)}>
      <Label className="text-xs text-blue-900">{props.label}</Label>
      <Input as={Fragment}>
        {({ focus }) => (
          <div className="w-full relative">
            {!!props.iconRight && <div className="absolute right-3 top-1/2 -translate-y-1/2">{props.iconRight}</div>}
            <input
              id={props.id}
              className={classNames('rounded-full border-1 border-solid py-2 w-full', {
                'border-pink-700 outline-none': focus,
                'border-blue-900': !focus,
                'px-9': hasLeftIcon,
                'px-4': !hasLeftIcon,
              })}
              value={props.value}
              onChange={e => {
                props.onTextChange?.(e.target.value)
                props.onChange?.(e)
              }}
            />
            {!!props.iconLeft && <div className="absolute left-3 top-1/2 -translate-y-1/2">{props.iconLeft}</div>}
          </div>
        )}
      </Input>
    </Field>
  )
}
