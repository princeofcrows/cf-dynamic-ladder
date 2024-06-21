'use client'

import withStateIndicator from '../shared/higher-order/withStateIndicator'
import { UserInfoType } from '@/src/types/users'
import Image from 'next/image'
import RatingInfo from './RatingInfo'

type UserInfoProps = {
  user?: UserInfoType | null
}

function UserInfo(props: UserInfoProps) {
  if (props.user == null) {
    return null
  }

  return (
    <div className="flex gap-2 mt-4 bg-white shadow-sm p-6 w-fit rounded-lg">
      <Image
        width={300}
        height={300}
        src={props.user.titlePhoto}
        alt={'User Photo'}
        className="rounded-xl shadow-sm border-1 border-dotted"
      />
      <div className="flex flex-col justify-center m-2">
        <RatingInfo className="text-base font-bold" label={props.user.handle} rating={props.user.rating} />
        <RatingInfo label={props.user.rank} rating={props.user.rating} className={'text-sm font-semibold'} />
        <p className="mt-1">
          <span className={'text-sm font-semibold text-blue-900'}>{'Rating:  '}</span>
          <RatingInfo
            label={props.user.rating ?? 'Unrated'}
            rating={props.user.rating}
            className={'text-sm font-semibold'}
          />
        </p>
        <p>
          <span className={'text-sm font-semibold text-blue-900'}>{'Max:  '}</span>
          <RatingInfo
            label={props.user.maxRating ?? 'Unrated'}
            className={'text-sm font-semibold'}
            rating={props.user.maxRating}
          />
          <RatingInfo
            label={` (${props.user.maxRank ?? 'Unrated'})`}
            className={'text-sm italic font-semibold'}
            rating={props.user.maxRating}
          />
        </p>
      </div>
    </div>
  )
}

export default withStateIndicator<UserInfoProps>(UserInfo)
