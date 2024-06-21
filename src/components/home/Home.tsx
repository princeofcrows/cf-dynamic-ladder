'use client'

import { useUserInfo } from '@/src/hooks/users/useUserInfo'
import { useUserStatus } from '@/src/hooks/users/useUserStatus'
import PageHeader from '@/src/components/shared/titles/PageHeader'
import TextInput from '@/src/components//shared/inputs/TextInput'
import { useCodeforcesInfo } from '@/src/hooks/stores/useCodeforcesInfo'
import { FaUser, FaSearch } from 'react-icons/fa'
import IconButton from '@/src/components//shared/buttons/IconButton'
import UserInfo from './UserInfo'
import ChartsComposed from './ChartsComposed'

const Home = () => {
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

  return (
    <div className="bg-slate-300/32 mx-auto w-full min-h-screen p-10">
      <PageHeader
        className="bg-gradient-to-r  from-black from-10% via-blue-500 to-blue-700 inline-block text-transparent bg-clip-text"
        title="Codeforces Analytics"
      />
      <form
        onSubmit={e => {
          e.preventDefault()
          setParams()
        }}
      >
        <TextInput
          id="cf-handle"
          className="mt-2 w-1/3"
          label="Codeforces Handle"
          value={handle}
          onTextChange={value => setHandle(value)}
          iconLeft={<FaUser />}
          iconRight={
            <IconButton onClick={() => setParams()} icon={<FaSearch className="text-blue-900 hover:text-blue-800" />} />
          }
        />
      </form>
      <UserInfo
        isLoading={isUserFetchLoading}
        isError={isUserFetchError}
        user={user}
        errorMessage={userFetchError?.message}
      />
      {user != null && (
        <ChartsComposed
          isLoading={isUserStatusLoading}
          isError={isUserStatusError}
          errorMessage={userStatusError?.message}
        />
      )}
    </div>
  )
}

export default Home
