import { HiSparkles } from 'react-icons/hi'

export default function Loading() {
  return (
    <div className="relative">
      <div className="flex flex-col justify-center items-center w-full p-4">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-900" />
        <HiSparkles className="absolute inset-0 m-auto h-5 w-5 text-indigo-400" />
      </div>
    </div>
  )
}
