import { useRef, useState } from 'react';

export interface DragItem {
  id: string;
  type: string;
  data?: any;
}

export interface DragState {
  isDragging: boolean;
  dragItem: DragItem | null;
  dragOffset: { x: number; y: number };
  dragPosition: { x: number; y: number };
}

export interface UseDraggableOptions {
  item: DragItem;
  onDragStart?: (item: DragItem) => void;
  onDragEnd?: (item: DragItem) => void;
}

export interface UseDroppableOptions {
  accept: string | string[];
  onDrop?: (item: DragItem, dropTarget: any) => void;
  onDragOver?: (item: DragItem) => void;
  onDragLeave?: () => void;
}

export function useDraggable({ item, onDragStart, onDragEnd }: UseDraggableOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const initialMousePos = useRef({ x: 0, y: 0 });
  const initialElementPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragRef.current) return;

    const rect = dragRef.current.getBoundingClientRect();
    initialMousePos.current = { x: e.clientX, y: e.clientY };
    initialElementPos.current = { x: rect.left, y: rect.top };

    setIsDragging(true);
    onDragStart?.(item);

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;

      const deltaX = e.clientX - initialMousePos.current.x;
      const deltaY = e.clientY - initialMousePos.current.y;

      dragRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      dragRef.current.style.zIndex = '9999';
      dragRef.current.style.pointerEvents = 'none';
    };

    const handleMouseUp = () => {
      if (dragRef.current) {
        dragRef.current.style.transform = '';
        dragRef.current.style.zIndex = '';
        dragRef.current.style.pointerEvents = '';
      }

      setIsDragging(false);
      onDragEnd?.(item);

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return {
    dragRef,
    isDragging,
    dragProps: {
      onMouseDown: handleMouseDown,
      style: {
        cursor: 'grab',
        userSelect: 'none' as const,
        transition: isDragging ? 'none' : 'transform 0.2s ease',
      },
    },
  };
}

export function useDroppable({ accept, onDrop, onDragLeave }: UseDroppableOptions) {
  const [isOver, setIsOver] = useState(false);
  const dropRef = useRef<HTMLElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!dropRef.current?.contains(e.relatedTarget as Node)) {
      setIsOver(false);
      onDragLeave?.();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    
    try {
      const dragData = e.dataTransfer.getData('application/json');
      if (dragData) {
        const item: DragItem = JSON.parse(dragData);
        const acceptTypes = Array.isArray(accept) ? accept : [accept];
        
        if (acceptTypes.includes(item.type)) {
          onDrop?.(item, dropRef.current);
        }
      }
    } catch (error) {
      console.warn('Failed to parse drag data:', error);
    }
  };

  return {
    dropRef,
    isOver,
    dropProps: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
  };
}

// Global drag state management
let globalDragState: DragState = {
  isDragging: false,
  dragItem: null,
  dragOffset: { x: 0, y: 0 },
  dragPosition: { x: 0, y: 0 },
};

const dragStateListeners = new Set<(state: DragState) => void>();

export function useDragState() {
  const [state] = useState(globalDragState);

  const subscribe = (listener: (state: DragState) => void) => {
    dragStateListeners.add(listener);
    return () => dragStateListeners.delete(listener);
  };

  const updateDragState = (newState: Partial<DragState>) => {
    globalDragState = { ...globalDragState, ...newState };
    dragStateListeners.forEach(listener => listener(globalDragState));
  };

  return {
    state,
    updateDragState,
    subscribe,
  };
}
