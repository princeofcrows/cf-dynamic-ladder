import { Field, Input, Label } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, InputHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type TextInputProps = {
  id: string
  value?: string
  label?: string
  onTextChange?: (value: string) => void
  iconRight?: ReactNode
  iconLeft?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

export default function TextInput(props: TextInputProps) {
  const { id, value, label, onTextChange, iconRight, iconLeft, className, onChange, ...rest } = props
  const hasLeftIcon = !!iconLeft

  return (
    <Field className={twMerge('flex flex-col', className)}>
      <Label className="text-xs text-blue-900">{label}</Label>
      <Input as={Fragment}>
        {({ focus }) => (
          <div className="w-full relative">
            {!!iconRight && <div className="absolute right-3 top-1/2 -translate-y-1/2">{iconRight}</div>}
            <input
              id={id}
              className={classNames('rounded-full border-1 border-solid py-2 w-full', {
                'border-pink-700 outline-none': focus,
                'border-blue-900': !focus,
                'px-9': hasLeftIcon,
                'px-4': !hasLeftIcon,
              })}
              value={value}
              onChange={e => {
                onTextChange?.(e.target.value)
                onChange?.(e)
              }}
              {...rest}
            />
            {!!iconLeft && <div className="absolute left-3 top-1/2 -translate-y-1/2">{iconLeft}</div>}
          </div>
        )}
      </Input>
    </Field>
  )
}
