'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useEdgeStore } from '@/lib/edgestore';
import { useCoverImage } from '@/hooks/use-cover-image';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { SingleImageDropzone } from '@/components/single-image-dropzone';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';

const CoverImageModal = () => {
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const update = useMutation(api.documents.update);
  const { isOpen, onClose: onCloseDialog, onOpen } = useCoverImage();
  const { edgestore } = useEdgeStore();
  const params = useParams();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    onCloseDialog();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
      });

      await update({
        id: params.documentId as Id<'documents'>,
        coverImage: res.url,
      });

      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <h2 className='text-center text-lg font-semibold'>Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          value={file}
          onChange={onChange}
          disabled={isSubmitting}
          className='w-full outline-none'
        />
      </DialogContent>
    </Dialog>
  );
};

export default CoverImageModal;
