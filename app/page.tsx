// src/app/page.tsx
"use client";

import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-900'>
      <main className='flex flex-col items-center justify-center gap-6 bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl text-center w-full max-w-xl'>
        <h1 className='text-3xl font-bold text-neutral-900 dark:text-zinc-50'>
          Welcome to the <span className='text-primary-main'>Company</span> Job Portal
        </h1>
        <p className='text-neutral-600 dark:text-zinc-400'>Choose your role to continue.</p>

        <div className='flex flex-col sm:flex-row justify-center gap-4 w-full'>
          <Button
            onClick={() => router.push("/admin/job-list")}
            className='w-full sm:w-auto bg-primary-main hover:bg-primary-dark text-white font-medium py-2 px-4'>
            See job list as admin
          </Button>
          <Button
            onClick={() => router.push("/job-list")}
            className='w-full sm:w-auto bg-secondary-main hover:bg-secondary-dark text-neutral-900 font-medium py-2 px-4'>
            See job list as user
          </Button>
        </div>
      </main>
    </div>
  );
}
