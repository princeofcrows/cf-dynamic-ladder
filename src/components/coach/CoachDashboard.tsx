'use client'

import { useState, useEffect } from 'react'
import { useTraineesInfo } from '@/src/hooks/users/useTraineesInfo'
import { useTraineeReport } from '@/src/hooks/users/useTraineeReport'
import TextInput from '@/src/components/shared/inputs/TextInput'
import ContainerCard from '@/src/components/shared/cards/ContainerCard'
import PageHeader from '@/src/components/shared/titles/PageHeader'
import RatingInfo from '@/src/components/home/RatingInfo'
import { FaUserPlus, FaTrash, FaArrowLeft, FaChartLine, FaAward } from 'react-icons/fa'

export default function CoachDashboard() {
  const [handles, setHandles] = useState<string[]>(['tourist', 'Benq', 'ecnerwala'])
  const [mounted, setMounted] = useState(false)
  const [newHandle, setNewHandle] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [selectedTrainee, setSelectedTrainee] = useState<string | null>(null)

  // Load handles from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('coach-trainees')
    if (stored) {
      try {
        setHandles(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse coach-trainees from localStorage', e)
      }
    }
  }, [])

  const saveHandles = (newHandles: string[]) => {
    setHandles(newHandles)
    localStorage.setItem('coach-trainees', JSON.stringify(newHandles))
  }

  const { data: trainees, isLoading, isError } = useTraineesInfo(handles)
  const { data: report, isLoading: isReportLoading, isError: isReportError } = useTraineeReport(selectedTrainee)

  const handleAddTrainee = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newHandle.trim()
    if (!trimmed) return

    if (handles.some(h => h.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg('Trainee is already being tracked.')
      return
    }

    setIsAdding(true)
    setErrorMsg('')

    try {
      // Validate handle with Codeforces API
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${trimmed}`)
      const data = await response.json()
      if (data.status === 'OK' && data.result && data.result.length > 0) {
        const validatedHandle = data.result[0].handle // Retrieve official handle casing
        const updated = [...handles, validatedHandle]
        saveHandles(updated)
        setNewHandle('')
      } else {
        setErrorMsg(`User "${trimmed}" not found on Codeforces.`)
      }
    } catch (err) {
      setErrorMsg('Failed to validate handle. Please check your connection.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveTrainee = (handleToRemove: string) => {
    const updated = handles.filter(h => h !== handleToRemove)
    saveHandles(updated)
    if (selectedTrainee === handleToRemove) {
      setSelectedTrainee(null)
    }
  }

  if (!mounted) {
    return (
      <div className="bg-slate-300/32 mx-auto w-full min-h-screen p-10 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  // Render individual Trainee Report view
  if (selectedTrainee) {
    return (
      <div className="bg-slate-300/32 mx-auto w-full min-h-screen p-10">
        <button
          onClick={() => setSelectedTrainee(null)}
          className="flex items-center gap-2 text-blue-900 hover:text-blue-700 font-semibold mb-6 transition-colors"
        >
          <FaArrowLeft className="h-4 w-4" />
          <span>Back to Trainees</span>
        </button>

        {isReportLoading ? (
          <div className="flex justify-center items-center py-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        ) : isReportError || !report ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">
            Failed to load analysis report for {selectedTrainee}. Please try again later.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Trainee Profile Header Card */}
            <ContainerCard className="mt-0 w-full p-6 flex-col md:flex-row items-center gap-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={report.avatar}
                alt={report.handle}
                className="w-20 h-20 rounded-full border border-gray-200 object-cover flex-shrink-0"
                onError={e => {
                  ;(e.target as HTMLImageElement).src = 'https://userpic.codeforces.org/no-title.jpg'
                }}
              />
              <div className="flex-1 min-w-0 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 justify-center md:justify-start">
                  <h2 className="text-2xl font-extrabold">
                    <RatingInfo label={report.handle} rating={report.rating} />
                  </h2>
                  <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                    <RatingInfo label={report.rank || 'Unrated'} rating={report.rating} />
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start text-sm mt-3 text-gray-500">
                  <div>
                    <span className="font-semibold text-gray-700">Current Rating:</span> {report.rating}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Max Rating:</span> {report.maxRating}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Total Solved:</span> {report.totalSolved}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Peak solve rating:</span> {report.maxSolvedRating || 'N/A'}
                  </div>
                </div>
              </div>
            </ContainerCard>

            {/* Trajectory & Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ContainerCard className="mt-0 w-full flex-col p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm rounded-xl md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <FaChartLine className="text-blue-900 h-5 w-5" />
                  <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider">Performance Trajectory</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-gray-400">Status:</span>
                  <span className={`text-lg font-bold ${
                    report.trajectory.momentum === 'Upward' || report.trajectory.momentum === 'Improving'
                      ? 'text-green-600'
                      : report.trajectory.momentum === 'Downward'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {report.trajectory.momentum}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{report.trajectory.description}</p>
              </ContainerCard>

              <ContainerCard className="mt-0 w-full flex-col p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <FaAward className="text-yellow-600 h-5 w-5" />
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Peak Stats</h3>
                </div>
                <div className="space-y-3 mt-1 text-sm">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Max Difficulty Solved:</span>
                    <span className="font-bold text-gray-800">{report.maxSolvedRating || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Total Attempts:</span>
                    <span className="font-bold text-gray-800">{report.totalAttempts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Success Ratio:</span>
                    <span className="font-bold text-gray-800">
                      {report.totalAttempts > 0 ? Math.round((report.totalSolved / report.totalAttempts) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </ContainerCard>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <ContainerCard className="mt-0 w-full flex-col p-6 bg-white border border-green-100 shadow-sm rounded-xl">
                <h3 className="text-sm font-bold text-green-900 uppercase tracking-wider mb-4">Core Strengths</h3>
                {report.strengths.length === 0 ? (
                  <p className="text-sm text-gray-500">Not enough data to determine core strengths.</p>
                ) : (
                  <div className="space-y-4 w-full">
                    {report.strengths.map(s => (
                      <div key={s.topic} className="flex flex-col gap-1 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-800">{s.topic}</span>
                          <span className="text-xs bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full">
                            {s.successRate}% Success
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Solved: {s.solvedCount}</span>
                          <span>Avg Solve Rating: {s.avgRating || 'N/A'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ContainerCard>

              {/* Weaknesses */}
              <ContainerCard className="mt-0 w-full flex-col p-6 bg-white border border-red-100 shadow-sm rounded-xl">
                <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider mb-4">Core Weaknesses / Gaps</h3>
                {report.weaknesses.length === 0 ? (
                  <p className="text-sm text-gray-500">Not enough data to determine core weaknesses.</p>
                ) : (
                  <div className="space-y-4 w-full">
                    {report.weaknesses.map(w => (
                      <div key={w.topic} className="flex flex-col gap-1 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-800">{w.topic}</span>
                          <span className="text-xs bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full">
                            {w.struggleRate}% Struggle Rate
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Solved: {w.solvedCount}</span>
                          <span>Avg Solve Rating: {w.avgRating || 'N/A'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ContainerCard>
            </div>

            {/* Improvement Path */}
            <ContainerCard className="mt-0 w-full flex-col p-6 bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-md rounded-xl">
              <div className="flex items-center justify-between border-b border-indigo-800 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold tracking-wider">PERSONALIZED IMPROVEMENT PATH</h3>
                  <p className="text-xs text-indigo-200 mt-0.5">Custom action steps tailored for rating growth</p>
                </div>
                <div className="bg-indigo-800/80 border border-indigo-700 rounded-lg px-3 py-1.5 text-right">
                  <span className="block text-[10px] uppercase font-bold text-indigo-300">Target Rating Range</span>
                  <span className="font-extrabold text-sm">{report.improvementPath.targetRange}</span>
                </div>
              </div>
              <div className="space-y-3">
                {report.improvementPath.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/5 rounded-lg p-3 border border-white/5">
                    <span className="flex-shrink-0 flex items-center justify-center bg-indigo-500/20 text-indigo-300 font-black rounded-full h-6 w-6 text-sm">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-indigo-100 mt-0.5 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </ContainerCard>

            {/* Detailed Categories Breakdown Table */}
            <ContainerCard className="mt-0 w-full flex-col p-6 bg-white border border-gray-100 shadow-sm rounded-xl overflow-x-auto">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Topic Performance Analysis</h3>
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead>
                  <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Topic Category</th>
                    <th className="pb-3 px-4 text-center">Solved</th>
                    <th className="pb-3 px-4 text-center">Failed Attempts</th>
                    <th className="pb-3 px-4 text-center">Success Rate</th>
                    <th className="pb-3 px-4 text-center">Avg Solved Rating</th>
                    <th className="pb-3 pl-4 text-right">Peak Solve Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {report.categories.map(c => (
                    <tr key={c.name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 pr-4 font-semibold text-gray-900">{c.name}</td>
                      <td className="py-3 px-4 text-center font-medium">{c.solved}</td>
                      <td className="py-3 px-4 text-center text-gray-400">{c.failed}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block font-bold text-xs px-2 py-0.5 rounded-full ${
                          c.successRate > 0.75 
                            ? 'bg-green-50 text-green-700' 
                            : c.successRate < 0.4 
                            ? 'bg-red-50 text-red-700' 
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {Math.round(c.successRate * 100)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-gray-600">{c.avgRating || 'N/A'}</td>
                      <td className="py-3 pl-4 text-right font-bold text-gray-900">{c.maxRating || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ContainerCard>
          </div>
        )}
      </div>
    )
  }

  // Calculate stats from loaded trainees
  const highestTrainee = trainees && trainees.length > 0 
    ? [...trainees].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0] 
    : null
  const lowestTrainee = trainees && trainees.length > 0 
    ? [...trainees].sort((a, b) => (a.rating || 0) - (b.rating || 0))[0] 
    : null

  return (
    <div className="bg-slate-300/32 mx-auto w-full min-h-screen p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <PageHeader
            className="bg-gradient-to-r from-black from-10% via-blue-500 to-blue-700 inline-block text-transparent bg-clip-text"
            title="Coach Dashboard"
          />
          <p className="text-gray-500 text-sm mt-1">Track and monitor your trainees&apos; Codeforces ratings</p>
        </div>

        <form onSubmit={handleAddTrainee} className="flex items-end gap-2">
          <div className="relative">
            <TextInput
              id="trainee-handle"
              className="w-64"
              label="Track Trainee"
              value={newHandle}
              onTextChange={value => setNewHandle(value)}
              placeholder="Codeforces Handle"
              disabled={isAdding}
            />
            {errorMsg && (
              <p className="text-red-500 text-xs absolute top-full left-0 mt-1 whitespace-nowrap">{errorMsg}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isAdding || !newHandle.trim()}
            className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white text-sm font-medium px-4 py-2 rounded-full h-[40px] transition-colors"
          >
            {isAdding ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FaUserPlus className="h-4 w-4" />
            )}
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 mt-12 md:mt-6">
        <ContainerCard className="mt-0 w-full flex-col justify-center p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm rounded-xl">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Trainees</span>
          <span className="text-3xl font-extrabold text-blue-950 mt-1">{handles.length}</span>
        </ContainerCard>
        <ContainerCard className="mt-0 w-full flex-col justify-center p-6 bg-gradient-to-br from-teal-50 to-white border border-teal-100 shadow-sm rounded-xl">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Average Rating</span>
          <span className="text-3xl font-extrabold text-teal-950 mt-1">
            {trainees && trainees.length > 0
              ? Math.round(trainees.reduce((acc, t) => acc + (t.rating || 0), 0) / trainees.length)
              : 0}
          </span>
        </ContainerCard>
        <ContainerCard className="mt-0 w-full flex-col justify-center p-6 bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-sm rounded-xl">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Highest Rating</span>
          <span className="text-lg font-bold text-purple-950 mt-1 truncate">
            {highestTrainee && highestTrainee.rating ? (
              <span className="flex items-center gap-1">
                <RatingInfo label={highestTrainee.handle} rating={highestTrainee.rating} />
                <span className="text-gray-400 font-normal">({highestTrainee.rating})</span>
              </span>
            ) : (
              'N/A'
            )}
          </span>
        </ContainerCard>
        <ContainerCard className="mt-0 w-full flex-col justify-center p-6 bg-gradient-to-br from-orange-50 to-white border border-orange-100 shadow-sm rounded-xl">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lowest Rating</span>
          <span className="text-lg font-bold text-orange-950 mt-1 truncate">
            {lowestTrainee && lowestTrainee.rating ? (
              <span className="flex items-center gap-1">
                <RatingInfo label={lowestTrainee.handle} rating={lowestTrainee.rating} />
                <span className="text-gray-400 font-normal">({lowestTrainee.rating})</span>
              </span>
            ) : (
              'N/A'
            )}
          </span>
        </ContainerCard>
      </div>

      {/* Trainees List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">
          Failed to fetch trainees info. Please refresh the page.
        </div>
      ) : trainees && trainees.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center text-gray-500 shadow-sm">
          No trainees are currently tracked. Add trainee handles above to monitor them.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainees?.map(trainee => (
            <ContainerCard
              key={trainee.handle}
              onClick={() => setSelectedTrainee(trainee.handle)}
              className="mt-0 w-full flex-col p-6 hover:shadow-md transition-all duration-200 relative border border-gray-100 bg-white rounded-xl shadow-sm cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveTrainee(trainee.handle)
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                title="Remove Trainee"
              >
                <FaTrash className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-4 pr-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={trainee.titlePhoto}
                  alt={trainee.handle}
                  className="w-14 h-14 rounded-full border border-gray-200 object-cover flex-shrink-0"
                  onError={e => {
                    // Fallback avatar if titlePhoto fails to load
                    ;(e.target as HTMLImageElement).src =
                      'https://userpic.codeforces.org/no-title.jpg'
                  }}
                />
                <div className="min-w-0">
                  <h3 className="text-base font-bold truncate">
                    <RatingInfo label={trainee.handle} rating={trainee.rating || 0} />
                  </h3>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide truncate">
                    <RatingInfo label={trainee.rank || 'Unrated'} rating={trainee.rating || 0} />
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 block text-xs font-medium uppercase tracking-wider">Rating</span>
                  <span className="font-bold text-gray-800 text-lg">
                    {trainee.rating !== undefined ? trainee.rating : 'Unrated'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs font-medium uppercase tracking-wider">Max Rating</span>
                  <span className="font-bold text-gray-800 text-lg">
                    {trainee.maxRating !== undefined ? trainee.maxRating : 'Unrated'}
                  </span>
                </div>
              </div>
            </ContainerCard>
          ))}
        </div>
      )}
    </div>
  )
}
