import classNames from 'classnames'
import { HTMLAttributes } from 'react'

type RatingInfoProps = {
  label: string | number
  rating: number
} & HTMLAttributes<HTMLParagraphElement>

export default function RatingInfo(props: RatingInfoProps) {
  const { rating } = props
  return (
    <span
      className={classNames(props.className, {
        'text-gray-600': rating < 1199,
        'text-green-600': rating > 1199 && rating < 1399,
        'text-cyan-600': rating > 1399 && rating < 1599,
        'text-blue-600': rating > 1599 && rating < 1899,
        'text-purple-600': rating > 1899 && rating < 2199,
        'text-orange-600': rating > 2199 && rating < 2399,
        'text-red-600': rating > 2399,
      })}
    >
      {props.label}
    </span>
  )
}
