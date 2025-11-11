"use client";

export default function UserHeader() {
  return (
    <div className='bg-white border-b border-neutral-200 sticky top-0 z-10'>
      <div className='flex items-center justify-between px-6 py-4'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-primary-main rounded flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>R</span>
          </div>
          <h1 className='text-lg font-bold text-neutral-900'>Rakamin</h1>
        </div>

        <div className='flex items-center gap-3'>
          <button className='p-2 hover:bg-neutral-50 rounded-lg transition-colors'>
            <div className='w-10 h-10 bg-primary-main rounded-full flex items-center justify-center'>
              <span className='text-sm font-medium text-white'>JP</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
