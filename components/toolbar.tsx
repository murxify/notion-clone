'use client';

import { ElementRef, useRef, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import TextareaAutosize from 'react-textarea-autosize';
import { ImageIcon, Smile, X } from 'lucide-react';
import IconPicker from './icon-picker';
import { Button } from '@/components/ui/button';

interface ToolbarProps {
  initialData: Doc<'documents'>;
  preview?: boolean;
}

const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<'textarea'>>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setValue(value);
    update({ id: initialData._id, title: value || 'Untitled' });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      disableInput();
    }
  };

  const onSelectIcon = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    });
  };

  const onRemoveIcon = () => removeIcon({ id: initialData._id });

  return (
    <div className='pl-[54px] group relative'>
      {/* Renders for author */}
      {!!initialData.icon && !preview && (
        <div className='flex items-center gap-x-2 group/icon pt-6'>
          <IconPicker onChange={onSelectIcon}>
            <p className='text-6xl hover:opacity-75 transition'>
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            variant='outline'
            size='icon'
            className='rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs'
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
      )}
      {/* Renders for guest */}
      {!!initialData.icon && preview && (
        <p>
          <p className='text-6xl pt-6'>{initialData.icon}</p>
        </p>
      )}
      <div className='opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4'>
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onSelectIcon}>
            <Button
              variant='outline'
              size='sm'
              className='text-muted-foreground text-xs'
            >
              <Smile className='h-4 w-4 mr-2' />
              Add Icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => {}}
            className='text-muted-foreground text-xs'
          >
            <ImageIcon className='h-4 w-4 mr-2' />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className='text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none'
        />
      ) : (
        <div
          onClick={enableInput}
          className='pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]'
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
};

export default Toolbar;
