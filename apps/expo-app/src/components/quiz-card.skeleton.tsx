import { Skeleton } from './ui/skeleton'

export default function QuizCardSkeleton () {
  return (
    <div className='flex flex-col items-center justify-between p-6 rounded-2xl border border-gray-100 bg-white shadow-sm w-full max-w-xs gap-6'>
      {/* Icon Placeholder (Top) */}
      <div className='flex items-center justify-center pt-2'>
        <Skeleton className='h-12 w-12 rounded-xl' />
      </div>

      {/* Text Placeholders (Bottom) */}
      <div className='w-full space-y-2'>
        {/* Main Title Line */}
        <Skeleton className='h-5 w-5/6 mx-auto rounded-md' />
        {/* Subtitle/Description Line */}
        <Skeleton className='h-4 w-2/3 mx-auto rounded-md' />
      </div>
    </div>
  )
}
