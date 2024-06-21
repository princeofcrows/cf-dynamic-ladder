import { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type ContainerCardPropType = { children: React.ReactNode } & HTMLAttributes<HTMLDivElement>

export default function ContainerCard(props: ContainerCardPropType) {
  return (
    <div className={twMerge('flex gap-2 mt-4 bg-white shadow-sm p-6 w-fit rounded-lg', props.className)}>
      {props.children}
    </div>
  )
}
