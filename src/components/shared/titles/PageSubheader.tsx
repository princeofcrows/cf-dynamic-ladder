import { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type PageSubheaderProps = { subTitle: string } & HTMLAttributes<HTMLHeadingElement>

export default function PageSubheader(props: PageSubheaderProps) {
  return <p className={twMerge('text-gray-400 text-sm mt-1', props.className)}>{props.subTitle}</p>
}
