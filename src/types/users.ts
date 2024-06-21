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

export type UsersInfoParams = {
  handles: string
} | null

export type UserStatusParams = {
  handle: string
} | null

export type ProblemType = {
  contestId: number
  index: string
  name: string
  rating: number
  tags: string[]
  type: string
}

export type UserStatusType = {
  contestId: number
  creationTimeSeconds: number
  id: number
  memoryConsumedBytes: number
  passedTestCount: number
  problem: ProblemType
  programmingLanguage: string
  relativeTimeSeconds: number
  testset: string
  timeConsumedMillis: number
  verdict: string
}

export type UserStatusResponse = {
  status: 'OK'
  result: UserStatusType[]
}
