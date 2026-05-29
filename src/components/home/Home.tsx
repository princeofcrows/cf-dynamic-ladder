'use client'

import { useUserInfo } from '@/src/hooks/users/useUserInfo'
import { useUserStatus } from '@/src/hooks/users/useUserStatus'
import { useUserRating } from '@/src/hooks/users/useUserRating'
import PageHeader from '@/src/components/shared/titles/PageHeader'
import TextInput from '@/src/components/shared/inputs/TextInput'
import { useCodeforcesInfo } from '@/src/hooks/stores/useCodeforcesInfo'
import { FaUser, FaSearch } from 'react-icons/fa'
import IconButton from '@/src/components/shared/buttons/IconButton'
import UserInfo from './UserInfo'
import ProblemDifficultyBarChart from './ProblemDifficultyBarChart'
import ProblemTagsPieChart from './ProblemTagsPieChart'
import ContestHistoryChart from './ContestHistoryChart'
import PageSubheader from '../shared/titles/PageSubheader'
import { getAxiosError } from '@/src/helpers/get-error'
import { useHandleHistory } from '@/src/hooks/stores/useHandleHistory'

const Home = () => {
  const { append } = useHandleHistory()
  const { handle, setHandle, statusParams, infoParams, setParams } = useCodeforcesInfo()
  const {
    isLoading: isUserFetchLoading,
    data: user,
    isError: isUserFetchError,
    error: userFetchError,
  } = useUserInfo(infoParams)
  const {
    isLoading: isUserStatusLoading,
    isError: isUserStatusError,
    error: userStatusError,
  } = useUserStatus(statusParams)
  const {
    isLoading: isUserRatingLoading,
    isError: isUserRatingError,
    error: userRatingError,
  } = useUserRating(statusParams)

  return (
    <div className="bg-slate-300/32 mx-auto w-full min-h-screen px-4 py-6 sm:px-6 lg:p-10">
      <PageHeader
        className="bg-gradient-to-r from-black from-10% via-blue-500 to-blue-700 inline-block text-transparent bg-clip-text"
        title="Codeforces Analytics"
      />
      <PageSubheader subTitle="Powered by LLaMA 3.3 70B via Groq — free &amp; open-source" />

      <p className="mt-2 text-sm text-gray-500">Type in a Codeforces handle to get started.</p>
      <p className="mt-1 text-xs text-gray-400">
        Example: <span className="font-semibold text-gray-500">tourist</span>,{' '}
        <span className="font-semibold text-gray-500">Benq</span>
      </p>

      <form
        onSubmit={e => {
          e.preventDefault()
          setParams()
          append(handle)
        }}
      >
        <TextInput
          id="cf-handle"
          className="mt-4 w-full sm:w-2/3 lg:w-1/3"
          label="Codeforces Handle"
          value={handle}
          onTextChange={value => setHandle(value)}
          iconLeft={<FaUser />}
          iconRight={
            <IconButton
              onClick={() => {
                setParams()
                append(handle)
              }}
              icon={<FaSearch className="text-blue-900 hover:text-blue-800" />}
            />
          }
        />
      </form>

      {isUserFetchLoading && (
        <div className="mt-6 flex justify-center">
          <UserInfo isLoading={true} />
        </div>
      )}

      {isUserFetchError && (
        <div className="mt-6">
          <UserInfo isError={true} errorMessage={getAxiosError(userFetchError, isUserFetchError)} />
        </div>
      )}

      {user != null && !isUserFetchLoading && (
        <div className="flex flex-col gap-6 mt-6">
          {/* Row 1: User Profile and Problem Tags Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <UserInfo user={user} />
            <div className="h-full flex items-center justify-center">
              <ProblemTagsPieChart
                isLoading={isUserStatusLoading}
                isError={isUserStatusError}
                errorMessage={getAxiosError(userStatusError, isUserStatusError)}
              />
            </div>
          </div>

          {/* Row 2: Difficulty Bar Chart */}
          <div className="min-h-10">
            <ProblemDifficultyBarChart
              isLoading={isUserStatusLoading}
              isError={isUserStatusError}
              errorMessage={getAxiosError(userStatusError, isUserStatusError)}
            />
          </div>

          {/* Row 3: Contest History Line Chart */}
          <div className="min-h-10">
            <ContestHistoryChart
              isLoading={isUserRatingLoading}
              isError={isUserRatingError}
              errorMessage={getAxiosError(userStatusError, isUserStatusError)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
