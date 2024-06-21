import { PiEmptyBold } from 'react-icons/pi'

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <PiEmptyBold size={72} className="text-pink-800" />
      <p className="text-[#362B73] text-center text-lg font-semibold m-1">Not Found!</p>
      <p className="text-[#362B73] text-center text-sm font-normal m-1">
        No results found for that keyword. Try a different one.
      </p>
    </div>
  )
}
