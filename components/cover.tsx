'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useEdgeStore } from '@/lib/edgestore';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useCoverImage } from '@/hooks/use-cover-image';

import { ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface CoverProps {
  url?: string;
  preview?: boolean;
}

const Cover = ({ url, preview }: CoverProps) => {
  const params = useParams();
  const { edgestore } = useEdgeStore();
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const onRemove = async () => {
    removeCoverImage({ id: params.documentId as Id<'documents'> });

    if (url) {
      await edgestore.publicFiles.delete({
        url,
      });
    }
  };

  return (
    <div
      className={cn(
        'relative w-full h-[35vh] group',
        !url && 'h-[12vh]',
        url && 'bg-muted'
      )}
    >
      {!!url && <Image src={url} fill alt='Cover' className='object-cover' />}
      {url && !preview && (
        <div className='opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => coverImage.onReplace(url)}
            className='text-muted-foreground text-xs'
          >
            <ImageIcon className='w-4 h-4 mr-2' />
            Change cover
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={onRemove}
            className='text-muted-foreground text-xs'
          >
            <X className='w-4 h-4 mr-2' />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cover;

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className='w-full h-[12vh]' />;
};
