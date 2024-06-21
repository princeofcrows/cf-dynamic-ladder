import { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type PageHeaderProps = { title: string } & HTMLAttributes<HTMLHeadingElement>

export default function PageHeader(props: PageHeaderProps) {
  return <h1 className={twMerge('text-2xl font-bold text-gray-900', props.className)}>{props.title}</h1>
}
