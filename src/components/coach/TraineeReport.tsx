'use client'

import ContainerCard from '@/src/components/shared/cards/ContainerCard'
import RatingInfo from '@/src/components/home/RatingInfo'
import { TraineeReportType } from '@/src/hooks/users/useTraineeReport'
import { FaArrowLeft, FaChartLine, FaAward, FaBrain, FaLightbulb, FaExternalLinkAlt, FaDumbbell } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'

type PracticeProblem = {
  name: string
  contestId: number
  index: string
  rating: number | null
  tags: string[]
  url: string
  reason: string
}

export default function TraineeReport({ report }: { report: TraineeReportType }) {
  const solveRate = report.totalAttempts > 0 ? Math.round((report.totalSolved / report.totalAttempts) * 100) : 0

  const practiceProblems = ((report.ai as any)?.practiceProblems ?? []) as PracticeProblem[]

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header */}
      <ContainerCard className="mt-0 w-full p-6 flex-col md:flex-row items-center gap-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={report.avatar}
          alt={report.handle}
          className="w-20 h-20 rounded-full border-2 border-gray-100 object-cover flex-shrink-0 shadow-sm"
          onError={e => {
            ;(e.target as HTMLImageElement).src = 'https://userpic.codeforces.org/no-title.jpg'
          }}
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
            <span
              className={`text-base font-extrabold ${
                ['Upward', 'Improving'].includes(report.trajectory.momentum)
                  ? 'text-green-600'
                  : report.trajectory.momentum === 'Downward'
                    ? 'text-red-600'
                    : 'text-gray-500'
              }`}
            >
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
              <div
                key={label}
                className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0"
              >
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
            {report.ai.strengths.length === 0 ? (
              <p className="text-sm text-gray-400">Not enough data.</p>
            ) : (
              report.ai.strengths.map(s => (
                <div key={s.topic} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <span className="font-bold text-gray-800 block mb-1">{s.topic}</span>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.insight}</p>
                </div>
              ))
            )}
          </div>
        </ContainerCard>

        <ContainerCard className="mt-0 w-full flex-col p-6 bg-white border border-rose-100 shadow-sm rounded-xl">
          <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider mb-4">✦ Weaknesses & Gaps</h3>
          <div className="space-y-4 w-full">
            {report.ai.weaknesses.length === 0 ? (
              <p className="text-sm text-gray-400">Not enough data.</p>
            ) : (
              report.ai.weaknesses.map(w => (
                <div key={w.topic} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-800">{w.topic}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        w.priority === 'High'
                          ? 'bg-red-100 text-red-700'
                          : w.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {w.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{w.insight}</p>
                </div>
              ))
            )}
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
            <span className="block text-[10px] text-indigo-400 mt-0.5">
              ~{report.ai.improvementPath.estimatedContests} contests
            </span>
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
                <span className="text-indigo-300 text-xs border border-indigo-700/60 rounded-md px-2 py-0.5">
                  {phase.duration}
                </span>
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
            <div
              key={idx}
              className={`rounded-xl p-4 border ${
                rec.priority === 'High'
                  ? 'bg-blue-50 border-blue-100'
                  : rec.priority === 'Medium'
                    ? 'bg-slate-50 border-slate-100'
                    : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{rec.type}</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                    rec.priority === 'High'
                      ? 'bg-blue-200 text-blue-800'
                      : rec.priority === 'Medium'
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{rec.description}</p>
            </div>
          ))}
        </div>
      </ContainerCard>

      {/* Personalized Practice Pack */}
      <ContainerCard className="mt-0 w-full flex-col p-6 bg-gradient-to-br from-amber-50 to-white border border-amber-100 shadow-sm rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <FaDumbbell className="h-4 w-4 text-amber-600" />
          <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">10-Problem Practice Pack</h3>
          <span className="ml-auto text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            Codeforces
          </span>
        </div>

        {practiceProblems.length === 0 ? (
          <p className="text-sm text-gray-500">
            No practice pack available right now. Re-run the analysis (or try again later) to fetch a fresh set.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {practiceProblems.map(p => (
              <a
                key={`${p.contestId}-${p.index}`}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl border border-amber-100 bg-white p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-gray-900 truncate">{p.name}</span>
                      <FaExternalLinkAlt className="h-3 w-3 text-gray-300 group-hover:text-amber-600 transition-colors flex-shrink-0" />
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span className="bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">
                        {p.contestId}
                        {p.index}
                      </span>
                      <span className="bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">
                        {p.rating ? `~${p.rating}` : 'Unrated'}
                      </span>
                      {p.tags?.slice(0, 3).map(t => (
                        <span
                          key={t}
                          className="bg-amber-50 border border-amber-100 text-amber-700 rounded-full px-2 py-0.5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    {p.reason && <p className="mt-2 text-sm text-gray-600 leading-relaxed">{p.reason}</p>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
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
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      c.successRate > 0.75
                        ? 'bg-emerald-50 text-emerald-700'
                        : c.successRate < 0.4
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                    }`}
                  >
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
