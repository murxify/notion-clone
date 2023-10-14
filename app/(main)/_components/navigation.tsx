'use client';

import { useRef, ElementRef, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';
import { useMediaQuery } from 'usehooks-ts';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';

import { ChevronsLeft, MenuIcon } from 'lucide-react';

import UserItem from './user-item';

const Navigation = () => {
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const documents = useQuery(api.documents.get);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<'aside'>>(null);
  const navbarRef = useRef<ElementRef<'div'>>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  // Collapse sidebar when resizing from desktop to mobile
  useEffect(() => {
    if (isMobile) collapse();
    else resetWidth();
  }, [isMobile]); // resetWidth not necessary as a dependency because we are using refs

  // collapse sidebar when path is changed (clicking on a document to open)
  useEffect(() => {
    if (isMobile) collapse();
  }, [isMobile, pathname]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = e.clientX;

    // max and min width
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty('left', `${newWidth}px`);
      navbarRef.current.style.setProperty(
        'width',
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? '100%' : '240px';
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100% - 240px)'
      );
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px');
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = '0';
      navbarRef.current.style.setProperty('width', '100%');
      navbarRef.current.style.setProperty('left', '0');

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col z-[99999] w-60',
          isResetting && 'transtion-all ease-in-out duration-300',
          isMobile && 'w-0'
        )}
      >
        {/* Button used for collapsing sidebar */}
        <div
          role='button'
          onClick={collapse}
          className={cn(
            'h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition',
            isMobile && 'opacity-100'
          )}
        >
          <ChevronsLeft className='h-6 w-6' />
        </div>
        <div>
          <UserItem />
        </div>
        <div className='mt-4'>
          {documents?.map((doc) => (
            <p key={doc._id}>{doc.title}</p>
          ))}
        </div>
        {/* Vertical line used for resizing */}
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className='opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0'
        />
      </aside>
      {/* Menu button */}
      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
          isResetting && 'transtion-all ease-in-out duration-300',
          isMobile && 'left-0 w-full'
        )}
      >
        <nav className='bg-transparent px-3 py-2 w-full'>
          {isCollapsed && (
            <MenuIcon
              role='button'
              onClick={resetWidth}
              className='w-6 h-6 text-muted-foreground '
            />
          )}
        </nav>
      </div>
    </>
  );
};

export default Navigation;