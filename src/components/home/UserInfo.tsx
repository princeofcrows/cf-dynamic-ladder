'use client'

import withStateIndicator from '../shared/higher-order/withStateIndicator'
import { UserInfoType } from '@/src/types/users'
import Image from 'next/image'
import RatingInfo from './RatingInfo'
import ContainerCard from '../shared/cards/ContainerCard'

type UserInfoProps = {
  user?: UserInfoType | null
}

function UserInfo(props: UserInfoProps) {
  if (props.user == null) {
    return null
  }

  return (
    <ContainerCard className="h-full mt-4 w-full flex-row items-center gap-6 p-6">
      <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
        <Image
          fill
          src={props.user.titlePhoto}
          alt={'User Photo'}
          className="rounded-xl shadow-md border border-gray-200 object-cover"
        />
      </div>
      <div className="flex flex-col justify-center gap-1.5 py-2">
        <h2 className="text-2xl font-bold text-gray-800 leading-tight">
          <RatingInfo label={props.user.handle} rating={props.user.rating} />
        </h2>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          <RatingInfo label={props.user.rank} rating={props.user.rating} />
        </p>
        <div className="mt-3 space-y-1">
          <p className="flex items-center text-sm">
            <span className="w-20 font-medium text-gray-500">Rating</span>
            <RatingInfo
              label={props.user.rating ?? 'Unrated'}
              rating={props.user.rating}
              className="font-bold text-base"
            />
          </p>
          <p className="flex items-center text-sm">
            <span className="w-20 font-medium text-gray-500">Max Rating</span>
            <span className="inline-flex gap-1.5 items-baseline">
              <RatingInfo
                label={props.user.maxRating ?? 'Unrated'}
                className="font-bold text-base"
                rating={props.user.maxRating}
              />
              <RatingInfo
                label={`(${props.user.maxRank ?? 'Unrated'})`}
                className="text-xs font-semibold text-gray-400 italic"
                rating={props.user.maxRating}
              />
            </span>
          </p>
        </div>
      </div>
    </ContainerCard>
  )
}

export default withStateIndicator<UserInfoProps>(UserInfo)
