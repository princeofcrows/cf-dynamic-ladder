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
    <ContainerCard>
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
    </ContainerCard>
  )
}

export default withStateIndicator<UserInfoProps>(UserInfo)
