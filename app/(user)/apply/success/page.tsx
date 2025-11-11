"use client";

import Image from "next/image";

export default function page() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center  px-4'>
      <div className=' p-10 max-w-4xl w-full flex flex-col items-center text-center'>
        <Image src='/images/verified.png' alt='Success Illustration' width={180} height={180} className='mb-6' />
        <h1 className='text-2xl font-semibold text-neutral-900 mb-2'>🎉 Your application was sent!</h1>
        <p className='text-neutral-600 mb-8'>
          Congratulations! You've taken the first step towards a rewarding career at Rakamin. We look forward to learning more about you during the
          application process.
        </p>
      </div>
    </div>
  );
}
