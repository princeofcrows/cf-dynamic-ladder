import React from 'react'
import { FaSpinner } from 'react-icons/fa'

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-[80vh]">
      <FaSpinner className="animate-spin text-blue-600" size={48} />
      <p className="text-blue-900 text-center text-lg font-semibold m-1">Loading...</p>
      <p className="text-blue-900 text-center text-sm font-normal m-1">Fetching Result. Please wait...</p>
    </div>
  )
}
