'use client'

import { useCallback, useState } from 'react'
import PageHeader from '@/src/components/shared/titles/PageHeader'
import { HiOutlineSearch, HiUsers } from 'react-icons/hi'
import AnalyzeTab from './AnalyzeTab'
import TraineesTab from './TraineesTab'
import PageSubheader from '../shared/titles/PageSubheader'
import { useCodeforcesInfo } from '@/src/hooks/stores/useCodeforcesInfo'

type Tab = 'trainees' | 'analyze'

export default function CoachDashboard() {
  const [tab, setTab] = useState<Tab>('trainees')
  const { setHandle } = useCodeforcesInfo()

  const switchToAnalyze = (handle: string) => {
    console.log(handle)
    setHandle(handle)
    setTab('analyze')
  }

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
        <PageSubheader subTitle="Powered by LLaMA 3.3 70B via Groq — free &amp; open-source" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id)
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === t.id ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'trainees' ? <TraineesTab onSelectTrainee={switchToAnalyze} /> : <AnalyzeTab />}
    </div>
  )
}
