'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useTraineesInfo } from '@/src/hooks/users/useTraineesInfo'
import TextInput from '@/src/components/shared/inputs/TextInput'
import ContainerCard from '@/src/components/shared/cards/ContainerCard'
import RatingInfo from '@/src/components/home/RatingInfo'
import { FaUserPlus, FaTrash } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { useHandleHistory } from '@/src/hooks/stores/useHandleHistory'

export default function TraineesTab({ onSelectTrainee }: { onSelectTrainee: (handle: string) => void }) {
  const { handles, append, remove } = useHandleHistory()
  const [mounted, setMounted] = useState(false)
  const [newHandle, setNewHandle] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Seed demo handles only if history is empty (first run)
    // if (!handles || handles.length === 0) {
    //   ;['tourist', 'Benq', 'ecnerwala'].forEach(h => append(h))
    // }
  }, [append, handles])

  const handlesMemo = useMemo(() => Array.from(new Set(handles)), [handles])
  const { data: trainees, isLoading, isError } = useTraineesInfo(handlesMemo)

  const highestTrainee = trainees?.length ? [...trainees].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0] : null
  const lowestTrainee = trainees?.length ? [...trainees].sort((a, b) => (a.rating || 0) - (b.rating || 0))[0] : null
  const avgRating = trainees?.length
    ? Math.round(trainees.reduce((s, t) => s + (t.rating || 0), 0) / trainees.length)
    : 0

  if (!mounted)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900" />
      </div>
    )

  return (
    <div>
      {/* Top bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <p className="text-gray-500 text-sm">
          Click a trainee card to generate their AI coaching report (includes a 10-problem Codeforces practice pack)
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Trainees', value: handlesMemo.length, color: 'blue' },
          { label: 'Avg Rating', value: avgRating || '—', color: 'teal' },
        ].map(({ label, value, color }) => (
          <ContainerCard
            key={label}
            className={`mt-0 w-full flex-col justify-center p-5 bg-gradient-to-br from-${color}-50 to-white border border-${color}-100 shadow-sm rounded-xl`}
          >
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
            <span className={`text-3xl font-extrabold text-${color}-950 mt-1`}>{value}</span>
          </ContainerCard>
        ))}
        <ContainerCard className="mt-0 w-full flex-col justify-center p-5 bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-sm rounded-xl">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Highest</span>
          {highestTrainee?.rating ? (
            <span className="font-bold mt-1 truncate text-sm flex items-center gap-1">
              <RatingInfo label={highestTrainee.handle} rating={highestTrainee.rating} />
              <span className="text-gray-400 font-normal text-xs">({highestTrainee.rating})</span>
            </span>
          ) : (
            <span className="text-2xl font-extrabold text-purple-950 mt-1">—</span>
          )}
        </ContainerCard>
        <ContainerCard className="mt-0 w-full flex-col justify-center p-5 bg-gradient-to-br from-orange-50 to-white border border-orange-100 shadow-sm rounded-xl">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lowest</span>
          {lowestTrainee?.rating ? (
            <span className="font-bold mt-1 truncate text-sm flex items-center gap-1">
              <RatingInfo label={lowestTrainee.handle} rating={lowestTrainee.rating} />
              <span className="text-gray-400 font-normal text-xs">({lowestTrainee.rating})</span>
            </span>
          ) : (
            <span className="text-2xl font-extrabold text-orange-950 mt-1">—</span>
          )}
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
                onClick={e => {
                  e.stopPropagation()
                  remove(trainee.handle)
                }}
                className="absolute top-3 right-3 text-gray-200 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                title="Remove"
              >
                <FaTrash className="h-3 w-3" />
              </button>

              <div className="flex items-center gap-4 pr-4 mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={trainee.titlePhoto}
                  alt={trainee.handle}
                  className="w-14 h-14 rounded-full border-2 border-gray-100 object-cover flex-shrink-0 shadow-sm"
                  onError={e => {
                    ;(e.target as HTMLImageElement).src = 'https://userpic.codeforces.org/no-title.jpg'
                  }}
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
                {[
                  ['Rating', trainee.rating ?? 'Unrated'],
                  ['Max', trainee.maxRating ?? 'Unrated'],
                ].map(([label, val]) => (
                  <div key={label}>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                      {label}
                    </span>
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
