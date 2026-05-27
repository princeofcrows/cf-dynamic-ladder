'use client'

import { useEffect, type FormEvent } from 'react'
import { useTraineeReport } from '@/src/hooks/users/useTraineeReport'
import TextInput from '@/src/components/shared/inputs/TextInput'
import ContainerCard from '@/src/components/shared/cards/ContainerCard'
import { FaSearch } from 'react-icons/fa'
import { HiExclamationCircle, HiSparkles } from 'react-icons/hi'
import TraineeReport from './TraineeReport'
import IconButton from '../shared/buttons/IconButton'
import { useCodeforcesInfo } from '@/src/hooks/stores/useCodeforcesInfo'
import { useHandleHistory } from '@/src/hooks/stores/useHandleHistory'
import { isAxiosError } from 'axios'
import Loading from '../shared/misc/Loading'

export default function AnalyzeTab() {
  const { handle, setHandle, setParams, statusParams } = useCodeforcesInfo()
  const { append } = useHandleHistory()
  const { data: report, isLoading, isError, error } = useTraineeReport(statusParams?.handle ?? '')

  useEffect(() => {
    if (handle != '') setParams()
  }, [])

  const handleAnalyze = (e: FormEvent) => {
    e.preventDefault()
    setParams()
    append(handle)
  }

  const getErrorMessage = () => {
    if (!isError) return null
    if (isAxiosError(error)) {
      return error.response?.data?.error
    }

    return 'Failed to generate report.'
  }

  return (
    <div>
      {/* Search form — always visible */}
      <ContainerCard className="mt-0 w-full p-6 flex-col md:flex-row md:items-end gap-4 bg-stone-50 border border-gray-100 shadow-sm rounded-xl mb-6">
        <div className="flex items-center gap-2 text-indigo-500 mr-2">
          <HiSparkles className="h-6 w-6 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-gray-800">AI Analysis</p>
            <p className="text-xs text-gray-400">LLaMA 3.3 70B · Groq</p>
          </div>
        </div>
        <form onSubmit={handleAnalyze} className="flex items-end gap-3 flex-1">
          <TextInput
            id="analyze-handle"
            className="flex-1 max-w-xs"
            label="Codeforces Handle"
            value={handle}
            onTextChange={value => setHandle(value)}
            placeholder="e.g. tourist"
            iconRight={
              <IconButton onClick={handleAnalyze} icon={<FaSearch className="text-blue-900 hover:text-blue-800" />} />
            }
          />
        </form>
      </ContainerCard>

      {/* Loading */}
      {isLoading && statusParams?.handle && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loading />
          <div className="text-center">
            <p className="text-gray-700 font-semibold">Analyzing {handle}&apos;s performance…</p>
            <p className="text-gray-400 text-xs mt-1">
              Fetching contests + submissions · Consulting LLaMA 3.3 70B via Groq
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!statusParams?.handle && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <HiSparkles className="h-12 w-12 text-indigo-200 mb-4" />
          <p className="text-gray-500 font-semibold">Enter a handle above to generate an AI coaching report</p>
          <p className="text-gray-400 text-sm mt-1">Or click a trainee card in the My Trainees tab</p>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-red-500 text-sm md:ml-auto">
          <HiExclamationCircle className="h-4 w-4 flex-shrink-0" />
          <span>{getErrorMessage()}</span>
        </div>
      )}

      {/* Report */}
      {report && !isLoading && statusParams != null && <TraineeReport report={report} />}
    </div>
  )
}
