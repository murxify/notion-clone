'use client';

import Link from 'next/link';
import { useConvexAuth } from 'convex/react';
import { ArrowRight } from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';

const Heading = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();

  return (
    <div className='max-w-3xl space-y-4'>
      <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold'>
        Your <span className='inline-block'>🧠Ideas</span>,
        <span className='inline-block'>📕Docs</span> &{' '}
        <span className='inline-block'>🎯Plans</span>. Together.
      </h1>
      <h3 className='text-base sm:text-xl md:text-2xl font-medium'>
        Notion is the connected workspace where <br /> better, faster work
        happens.✨
      </h3>
      {isLoading && (
        <div className='w-full flex justify-center items-center'>
          <Spinner size='lg' />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href='/documents'>
            Enter Notion <ArrowRight className='h-4 w-4 ml-2' />
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode='modal'>
          <Button size='sm'>
            Get Notion Free <ArrowRight className='h-4 w-4 ml-2' />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};

export default Heading;
