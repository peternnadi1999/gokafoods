'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onBack?: () => void;
  className?: string;
  sticky?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  rightElement,
  onBack,
  className,
  sticky = true,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        'px-5 pt-14 pb-3 bg-gray-100',
        sticky && 'sticky top-0 z-10',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack || (() => router.back())}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-card flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-xs text-gray-500 font-roboto mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {rightElement && <div>{rightElement}</div>}
      </div>
    </div>
  );
}
