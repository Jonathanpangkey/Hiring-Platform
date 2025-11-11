"use client";

import {ReactNode} from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({children}: AdminLayoutProps) {
  return (
    <div className='h-screen flex flex-col'>
      <div className='bg-white border-b border-neutral-200 sticky top-0 z-10'>
        <div className='flex items-center justify-between px-6 py-4'>
          {/* header breadcrump will display here  */}
          <div id='header-content' className='flex-1'></div>

          <button className='p-2 hover:bg-neutral-50 rounded-lg transition-colors'>
            <div className='w-9 h-9 bg-primary-main rounded-full flex items-center justify-center'>
              <span className='text-sm font-medium text-white'>A</span>
            </div>
          </button>
        </div>
      </div>

      <div className='flex-1 overflow-auto'>{children}</div>
    </div>
  );
}
