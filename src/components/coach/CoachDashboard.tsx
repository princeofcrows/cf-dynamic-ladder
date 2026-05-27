'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTraineesInfo } from '@/src/hooks/users/useTraineesInfo'
import { useTraineeReport, TraineeReportType } from '@/src/hooks/users/useTraineeReport'
import TextInput from '@/src/components/shared/inputs/TextInput'
import ContainerCard from '@/src/components/shared/cards/ContainerCard'
import PageHeader from '@/src/components/shared/titles/PageHeader'
import RatingInfo from '@/src/components/home/RatingInfo'
import {
  FaUserPlus, FaTrash, FaArrowLeft, FaChartLine,
  FaAward, FaBrain, FaLightbulb, FaSearch,
} from 'react-icons/fa'
import { HiSparkles, HiExclamationCircle, HiUsers, HiOutlineSearch } from 'react-icons/hi'

type Tab = 'trainees' | 'analyze'

// ─── AI Report renderer (shared between both tabs) ───────────────────────────
function TraineeReport({
  report,
  onBack,
}: {
  report: TraineeReportType
  onBack: () => void
}) {
  const solveRate = report.totalAttempts > 0
    ? Math.round((report.totalSolved / report.totalAttempts) * 100)
    : 0

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-900 hover:text-blue-700 font-semibold transition-colors w-fit"
      >
        <FaArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      {/* Profile Header */}
      <ContainerCard className="mt-0 w-full p-6 flex-col md:flex-row items-center gap-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={report.avatar} alt={report.handle}
          className="w-20 h-20 rounded-full border-2 border-gray-100 object-cover flex-shrink-0 shadow-sm"
          onError={e => { (e.target as HTMLImageElement).src = 'https://userpic.codeforces.org/no-title.jpg' }}
        />
        <div className="flex-1 min-w-0 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 justify-center md:justify-start">
            <h2 className="text-2xl font-extrabold">
              <RatingInfo label={report.handle} rating={report.rating} />
            </h2>
            <RatingInfo
              label={report.rank || 'Unrated'}
              rating={report.rating}
              className="text-sm font-semibold uppercase tracking-wider"
            />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center md:justify-start text-sm mt-3 text-gray-500">
            {[
              ['Rating', report.rating],
              ['Max', report.maxRating],
              ['Solved', report.totalSolved],
              ['Peak Difficulty', report.maxSolvedRating || 'N/A'],
              ['Success Rate', `${solveRate}%`],
            ].map(([l, v]) => (
              <span key={l}>
                <span className="font-semibold text-gray-700">{l}:</span> {v}
              </span>
            ))}
          </div>
        </div>
      </ContainerCard>

      {/* AI Summary */}
      <ContainerCard className="mt-0 w-full flex-col p-6 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-sm rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <HiSparkles className="h-5 w-5 text-indigo-500" />
          <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">AI Coach Summary</h3>
          <span className="ml-auto text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
            Powered by LLaMA 3.3
          </span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{report.ai.summary}</p>
        {report.ai.mindsetTip && (
          <div className="mt-4 flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
            <FaLightbulb className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-indigo-800 italic leading-relaxed">{report.ai.mindsetTip}</p>
          </div>
        )}
      </ContainerCard>

      {/* Trajectory + Peak Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ContainerCard className="mt-0 w-full flex-col p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm rounded-xl md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <FaChartLine className="text-blue-700 h-4 w-4" />
            <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider">Performance Trajectory</h3>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase">Status:</span>
            <span className={`text-base font-extrabold ${
              ['Upward', 'Improving'].includes(report.trajectory.momentum)
                ? 'text-green-600'
                : report.trajectory.momentum === 'Downward'
                ? 'text-red-600'
                : 'text-gray-500'
            }`}>
              {report.trajectory.momentum}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{report.ai.trajectoryAnalysis}</p>
        </ContainerCard>

        <ContainerCard className="mt-0 w-full flex-col p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <FaAward className="text-amber-500 h-4 w-4" />
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Peak Stats</h3>
          </div>
          <div className="space-y-3 text-sm">
            {[
              ['Hardest Solved', report.maxSolvedRating || 'N/A'],
              ['Total Submissions', report.totalAttempts],
              ['Success Rate', `${solveRate}%`],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <span className="text-gray-400">{label}</span>
                <span className="font-bold text-gray-800">{val}</span>
              </div>
            ))}
          </div>
        </ContainerCard>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContainerCard className="mt-0 w-full flex-col p-6 bg-white border border-emerald-100 shadow-sm rounded-xl">
          <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-4">✦ Core Strengths</h3>
          <div className="space-y-4 w-full">
            {report.ai.strengths.length === 0
              ? <p className="text-sm text-gray-400">Not enough data.</p>
              : report.ai.strengths.map(s => (
                <div key={s.topic} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <span className="font-bold text-gray-800 block mb-1">{s.topic}</span>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.insight}</p>
                </div>
              ))
            }
          </div>
        </ContainerCard>

        <ContainerCard className="mt-0 w-full flex-col p-6 bg-white border border-rose-100 shadow-sm rounded-xl">
          <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider mb-4">✦ Weaknesses & Gaps</h3>
          <div className="space-y-4 w-full">
            {report.ai.weaknesses.length === 0
              ? <p className="text-sm text-gray-400">Not enough data.</p>
              : report.ai.weaknesses.map(w => (
                <div key={w.topic} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-800">{w.topic}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      w.priority === 'High' ? 'bg-red-100 text-red-700'
                      : w.priority === 'Medium' ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-500'
                    }`}>{w.priority}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{w.insight}</p>
                </div>
              ))
            }
          </div>
        </ContainerCard>
      </div>

      {/* AI Improvement Path */}
      <ContainerCard className="mt-0 w-full flex-col p-6 bg-gradient-to-br from-blue-950 to-indigo-900 text-white shadow-lg rounded-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-indigo-800/60 pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FaBrain className="h-5 w-5 text-indigo-300" />
              <h3 className="text-base font-black tracking-widest uppercase">Improvement Roadmap</h3>
            </div>
            <p className="text-xs text-indigo-400">AI-generated multi-phase training plan · LLaMA 3.3 70B</p>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-xl px-5 py-3 text-center flex-shrink-0">
            <span className="block text-[10px] uppercase font-bold text-indigo-300 tracking-widest">Target Rating</span>
            <span className="font-black text-2xl">{report.ai.improvementPath.targetRating}</span>
            <span className="block text-[10px] text-indigo-400 mt-0.5">~{report.ai.improvementPath.estimatedContests} contests</span>
          </div>
        </div>

        <div className="space-y-4">
          {report.ai.improvementPath.phases.map((phase, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="flex items-center justify-center bg-indigo-500/30 text-indigo-100 font-black rounded-full h-6 w-6 text-xs flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="font-bold text-white">{phase.phase}</span>
                <span className="text-indigo-300 text-xs border border-indigo-700/60 rounded-md px-2 py-0.5">{phase.duration}</span>
                <span className="text-indigo-400 text-xs ml-auto italic">Focus: {phase.focus}</span>
              </div>
              <ul className="space-y-2">
                {phase.actions.map((action, ai) => (
                  <li key={ai} className="flex items-start gap-2.5 text-sm text-indigo-100/90">
                    <span className="text-indigo-400 mt-0.5 flex-shrink-0">▸</span>
                    <span className="leading-relaxed">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ContainerCard>

      {/* Practice Recommendations */}
      <ContainerCard className="mt-0 w-full flex-col p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Practice Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.ai.practiceRecommendations.map((rec, idx) => (
            <div key={idx} className={`rounded-xl p-4 border ${
              rec.priority === 'High'
                ? 'bg-blue-50 border-blue-100'
                : rec.priority === 'Medium'
                ? 'bg-slate-50 border-slate-100'
                : 'bg-gray-50 border-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{rec.type}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                  rec.priority === 'High' ? 'bg-blue-200 text-blue-800'
                  : rec.priority === 'Medium' ? 'bg-slate-200 text-slate-600'
                  : 'bg-gray-200 text-gray-500'
                }`}>{rec.priority}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{rec.description}</p>
            </div>
          ))}
        </div>
      </ContainerCard>

      {/* Topic Breakdown Table */}
      <ContainerCard className="mt-0 w-full flex-col p-6 bg-white border border-gray-100 shadow-sm rounded-xl overflow-x-auto">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Topic Performance Breakdown</h3>
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead>
            <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <th className="pb-3 pr-4">Category</th>
              <th className="pb-3 px-4 text-center">Solved</th>
              <th className="pb-3 px-4 text-center">Failed</th>
              <th className="pb-3 px-4 text-center">Success</th>
              <th className="pb-3 px-4 text-center">Avg Difficulty</th>
              <th className="pb-3 pl-4 text-right">Peak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {report.categories.map(c => (
              <tr key={c.name} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 pr-4 font-semibold text-gray-900">{c.name}</td>
                <td className="py-3 px-4 text-center font-medium text-gray-700">{c.solved}</td>
                <td className="py-3 px-4 text-center text-gray-400">{c.failed}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    c.successRate > 0.75 ? 'bg-emerald-50 text-emerald-700'
                    : c.successRate < 0.4 ? 'bg-red-50 text-red-700'
                    : 'bg-amber-50 text-amber-700'
                  }`}>
                    {Math.round(c.successRate * 100)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-gray-600 font-semibold">{c.avgRating || '—'}</td>
                <td className="py-3 pl-4 text-right font-bold text-gray-900">{c.maxRating || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ContainerCard>
    </div>
  )
}

// ─── Analyze Tab ─────────────────────────────────────────────────────────────
function AnalyzeTab() {
  const [input, setInput] = useState('')
  const [activeHandle, setActiveHandle] = useState<string | null>(null)
  const { data: report, isLoading, isError, error } = useTraineeReport(activeHandle)

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed) setActiveHandle(trimmed)
  }

  const errorMessage = isError
    ? ((error as any)?.response?.data?.error ?? 'Failed to generate report.')
    : null

  return (
    <div>
      {/* Search form */}
      {(!activeHandle || isError) && (
        <div className="mb-8">
          <ContainerCard className="mt-0 w-full p-8 flex-col items-center text-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 shadow-sm rounded-2xl">
            <HiSparkles className="h-10 w-10 text-indigo-400 mb-3" />
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">AI Coaching Analysis</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md">
              Enter any Codeforces handle to get a full AI-powered breakdown of strengths, weaknesses, and a personalized training roadmap.
            </p>
            <form onSubmit={handleAnalyze} className="flex items-end gap-3 w-full max-w-sm">
              <TextInput
                id="analyze-handle"
                className="flex-1"
                label="Codeforces Handle"
                value={input}
                onTextChange={setInput}
                placeholder="e.g. tourist"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white font-semibold px-5 py-2 rounded-full h-[40px] transition-colors text-sm"
              >
                <FaSearch className="h-3.5 w-3.5" />
                Analyze
              </button>
            </form>
            {isError && (
              <div className="mt-4 flex items-center gap-2 text-red-500 text-sm">
                <HiExclamationCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </ContainerCard>
        </div>
      )}

      {/* Loading state */}
      {isLoading && activeHandle && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-900" />
            <HiSparkles className="absolute inset-0 m-auto h-5 w-5 text-indigo-400" />
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-semibold">Analyzing {activeHandle}&apos;s performance…</p>
            <p className="text-gray-400 text-xs mt-1">Fetching contests + submissions · Consulting LLaMA 3.3</p>
          </div>
        </div>
      )}

      {/* Report */}
      {report && !isLoading && (
        <TraineeReport
          report={report}
          onBack={() => { setActiveHandle(null); setInput('') }}
        />
      )}
    </div>
  )
}

// ─── Trainees Tab ─────────────────────────────────────────────────────────────
function TraineesTab({ onSelectTrainee }: { onSelectTrainee: (handle: string) => void }) {
  const [handles, setHandles] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const [newHandle, setNewHandle] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('coach-trainees')
    if (stored) {
      try { setHandles(JSON.parse(stored)) } catch { /* ignore */ }
    } else {
      // Default demo trainees
      setHandles(['tourist', 'Benq', 'ecnerwala'])
    }
  }, [])

  const saveHandles = (next: string[]) => {
    setHandles(next)
    localStorage.setItem('coach-trainees', JSON.stringify(next))
  }

  const { data: trainees, isLoading, isError } = useTraineesInfo(handles)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newHandle.trim()
    if (!trimmed) return
    if (handles.some(h => h.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg('Already tracked.')
      return
    }
    setIsAdding(true)
    setErrorMsg('')
    try {
      const res = await fetch(`https://codeforces.com/api/user.info?handles=${trimmed}`)
      const data = await res.json()
      if (data.status === 'OK' && data.result?.length > 0) {
        saveHandles([...handles, data.result[0].handle])
        setNewHandle('')
      } else {
        setErrorMsg(`"${trimmed}" not found on Codeforces.`)
      }
    } catch {
      setErrorMsg('Failed to validate. Check your connection.')
    } finally {
      setIsAdding(false)
    }
  }

  const highestTrainee = trainees?.length
    ? [...trainees].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0] : null
  const lowestTrainee = trainees?.length
    ? [...trainees].sort((a, b) => (a.rating || 0) - (b.rating || 0))[0] : null
  const avgRating = trainees?.length
    ? Math.round(trainees.reduce((s, t) => s + (t.rating || 0), 0) / trainees.length) : 0

  if (!mounted) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900" />
    </div>
  )

  return (
    <div>
      {/* Top bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <p className="text-gray-500 text-sm">Click a trainee card to generate their AI coaching report</p>
        <form onSubmit={handleAdd} className="flex items-end gap-2">
          <div className="relative">
            <TextInput
              id="trainee-handle"
              className="w-60"
              label="Add Trainee"
              value={newHandle}
              onTextChange={setNewHandle}
              placeholder="CF Handle"
              disabled={isAdding}
            />
            {errorMsg && (
              <p className="text-red-500 text-xs absolute top-full left-0 mt-1 whitespace-nowrap">{errorMsg}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isAdding || !newHandle.trim()}
            className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white text-sm font-semibold px-4 py-2 rounded-full h-[40px] transition-colors"
          >
            {isAdding
              ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              : <FaUserPlus className="h-4 w-4" />}
            Add
          </button>
        </form>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Trainees', value: handles.length, color: 'blue' },
          { label: 'Avg Rating', value: avgRating || '—', color: 'teal' },
        ].map(({ label, value, color }) => (
          <ContainerCard key={label} className={`mt-0 w-full flex-col justify-center p-5 bg-gradient-to-br from-${color}-50 to-white border border-${color}-100 shadow-sm rounded-xl`}>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
            <span className={`text-3xl font-extrabold text-${color}-950 mt-1`}>{value}</span>
          </ContainerCard>
        ))}
        <ContainerCard className="mt-0 w-full flex-col justify-center p-5 bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-sm rounded-xl">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Highest</span>
          {highestTrainee?.rating
            ? <span className="font-bold mt-1 truncate text-sm flex items-center gap-1">
                <RatingInfo label={highestTrainee.handle} rating={highestTrainee.rating} />
                <span className="text-gray-400 font-normal text-xs">({highestTrainee.rating})</span>
              </span>
            : <span className="text-2xl font-extrabold text-purple-950 mt-1">—</span>
          }
        </ContainerCard>
        <ContainerCard className="mt-0 w-full flex-col justify-center p-5 bg-gradient-to-br from-orange-50 to-white border border-orange-100 shadow-sm rounded-xl">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lowest</span>
          {lowestTrainee?.rating
            ? <span className="font-bold mt-1 truncate text-sm flex items-center gap-1">
                <RatingInfo label={lowestTrainee.handle} rating={lowestTrainee.rating} />
                <span className="text-gray-400 font-normal text-xs">({lowestTrainee.rating})</span>
              </span>
            : <span className="text-2xl font-extrabold text-orange-950 mt-1">—</span>
          }
        </ContainerCard>
      </div>

      {/* Trainee grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600 text-sm">
          Failed to fetch trainee data.
        </div>
      ) : trainees?.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-14 text-center text-gray-400 shadow-sm">
          No trainees yet. Add a handle above to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trainees?.map(trainee => (
            <ContainerCard
              key={trainee.handle}
              onClick={() => onSelectTrainee(trainee.handle)}
              className="mt-0 w-full flex-col p-6 border border-gray-100 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative group"
            >
              {/* AI badge on hover */}
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-indigo-50 text-indigo-500 text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <HiSparkles className="h-2.5 w-2.5" />
                AI Report
              </div>

              <button
                onClick={e => { e.stopPropagation(); saveHandles(handles.filter(h => h !== trainee.handle)) }}
                className="absolute top-3 right-3 text-gray-200 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                title="Remove"
              >
                <FaTrash className="h-3 w-3" />
              </button>

              <div className="flex items-center gap-4 pr-4 mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={trainee.titlePhoto} alt={trainee.handle}
                  className="w-14 h-14 rounded-full border-2 border-gray-100 object-cover flex-shrink-0 shadow-sm"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://userpic.codeforces.org/no-title.jpg' }}
                />
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold truncate">
                    <RatingInfo label={trainee.handle} rating={trainee.rating || 0} />
                  </h3>
                  <RatingInfo
                    label={trainee.rank || 'Unrated'}
                    rating={trainee.rating || 0}
                    className="text-xs font-semibold uppercase tracking-wide text-gray-400 truncate"
                  />
                </div>
              </div>

              <div className="mt-4 border-t border-gray-50 pt-4 grid grid-cols-2 gap-3 text-sm">
                {[['Rating', trainee.rating ?? 'Unrated'], ['Max', trainee.maxRating ?? 'Unrated']].map(([label, val]) => (
                  <div key={label}>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">{label}</span>
                    <span className="font-extrabold text-gray-800 text-lg">{val}</span>
                  </div>
                ))}
              </div>
            </ContainerCard>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Coach Dashboard ─────────────────────────────────────────────────────
export default function CoachDashboard() {
  const [tab, setTab] = useState<Tab>('trainees')
  const [analyzeHandle, setAnalyzeHandle] = useState<string | null>(null)

  const switchToAnalyze = useCallback((handle: string) => {
    setAnalyzeHandle(handle)
    setTab('analyze')
  }, [])

  const tabs = [
    { id: 'trainees' as Tab, label: 'My Trainees', icon: HiUsers },
    { id: 'analyze' as Tab, label: 'Analyze Player', icon: HiOutlineSearch },
  ]

  return (
    <div className="bg-slate-300/32 mx-auto w-full min-h-screen p-10">
      {/* Page header */}
      <div className="mb-8">
        <PageHeader
          className="bg-gradient-to-r from-black from-10% via-blue-500 to-blue-700 inline-block text-transparent bg-clip-text"
          title="Coach Dashboard"
        />
        <p className="text-gray-400 text-sm mt-1">Powered by LLaMA 3.3 70B via Groq — free &amp; open-source</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id)
              if (t.id === 'analyze') setAnalyzeHandle(null)
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === t.id
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'trainees'
        ? <TraineesTab onSelectTrainee={switchToAnalyze} />
        : <AnalyzeTabWithHandle initialHandle={analyzeHandle} />
      }
    </div>
  )
}

// Wrapper to inject handle from trainee click into AnalyzeTab
function AnalyzeTabWithHandle({ initialHandle }: { initialHandle: string | null }) {
  const [input, setInput] = useState(initialHandle ?? '')
  const [activeHandle, setActiveHandle] = useState<string | null>(initialHandle)
  const { data: report, isLoading, isError, error } = useTraineeReport(activeHandle)

  useEffect(() => {
    if (initialHandle) {
      setInput(initialHandle)
      setActiveHandle(initialHandle)
    }
  }, [initialHandle])

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed) setActiveHandle(trimmed)
  }

  const errorMessage = isError
    ? ((error as any)?.response?.data?.error ?? 'Failed to generate report.')
    : null

  return (
    <div>
      {/* Search form — always visible */}
      <ContainerCard className="mt-0 w-full p-6 flex-col md:flex-row md:items-end gap-4 bg-white border border-gray-100 shadow-sm rounded-xl mb-6">
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
            value={input}
            onTextChange={setInput}
            placeholder="e.g. tourist"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white font-semibold px-5 py-2 rounded-full h-[40px] transition-colors text-sm"
          >
            {isLoading
              ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              : <FaSearch className="h-3.5 w-3.5" />
            }
            {isLoading ? 'Analyzing…' : 'Analyze'}
          </button>
        </form>
        {isError && (
          <div className="flex items-center gap-2 text-red-500 text-sm md:ml-auto">
            <HiExclamationCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </ContainerCard>

      {/* Loading */}
      {isLoading && activeHandle && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-900" />
            <HiSparkles className="absolute inset-0 m-auto h-5 w-5 text-indigo-400" />
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-semibold">Analyzing {activeHandle}&apos;s performance…</p>
            <p className="text-gray-400 text-xs mt-1">Fetching contests + submissions · Consulting LLaMA 3.3 70B via Groq</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!activeHandle && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <HiSparkles className="h-12 w-12 text-indigo-200 mb-4" />
          <p className="text-gray-500 font-semibold">Enter a handle above to generate an AI coaching report</p>
          <p className="text-gray-400 text-sm mt-1">Or click a trainee card in the My Trainees tab</p>
        </div>
      )}

      {/* Report */}
      {report && !isLoading && (
        <TraineeReport
          report={report}
          onBack={() => { setActiveHandle(null); setInput('') }}
        />
      )}
    </div>
  )
}
