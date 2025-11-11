"use client";

import {Button} from "@/components/ui/button";
import Image from "next/image";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  iconClassName?: string;
}

export default function EmptyState({
  imageSrc = "/images/search-person.svg",
  imageAlt = "Empty State Illustration",
  imageWidth = 200,
  imageHeight = 200,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-16 px-4'>
      <div className='mb-6'>
        <Image src={imageSrc} alt={imageAlt} width={imageWidth} height={imageHeight} priority />
      </div>

      <h3 className='text-xl font-semibold text-gray-900 mb-2'>{title}</h3>
      <p className='text-gray-500 text-center max-w-md mb-6'>{description}</p>

      {actionLabel && onAction && (
        <Button onClick={onAction} className='bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium'>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
