export type UserInfoType = {
  lastName?: string
  country?: string
  lastOnlineTimeSeconds: number
  city?: string
  rating: number
  friendOfCount: number
  titlePhoto: string
  handle: string
  avatar: string
  firstName?: string
  contribution: 0
  organization?: string
  rank: string
  maxRating: number
  registrationTimeSeconds: number
  email?: string
  maxRank: string
}

export type UserInfoResponse = {
  status: 'OK'
  result: UserInfoType[]
}
