import { useRef, useState, useEffect } from 'react';

// Constants
const SCROLL_THRESHOLD = 80;
const MAX_SCROLL_SPEED = 12;
const SCROLL_TOLERANCE = 1;

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
  insertionPreview?: {
    columnId: string;
    index: number;
  };
}

export interface UseDraggableOptions {
  item: DragItem;
  onDragStart?: (item: DragItem) => void;
  onDragEnd?: (item: DragItem) => void;
}

export interface UseDroppableOptions {
  accept: string | string[];
  onDrop?: (item: DragItem, dropTarget: any, mousePosition?: { x: number; y: number }) => void;
  onDragOver?: (item: DragItem) => void;
  onDragLeave?: () => void;
}

export function useDraggable({ item, onDragStart, onDragEnd }: UseDraggableOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const initialMousePos = useRef({ x: 0, y: 0 });
  const initialScrollPos = useRef({ x: 0, y: 0 });
  const autoScrollRef = useRef<number | null>(null);
  const currentMousePos = useRef({ x: 0, y: 0 });
  const initialDocumentHeight = useRef<number>(0);

  const startDrag = (clientX: number, clientY: number) => {
    if (!dragRef.current) return;

    const rect = dragRef.current.getBoundingClientRect();
    initialMousePos.current = { x: clientX, y: clientY };
    initialScrollPos.current = { x: window.scrollX, y: window.scrollY };
    
    // Capture initial document height to prevent infinite scroll
    initialDocumentHeight.current = document.documentElement.scrollHeight;

    setIsDragging(true);
    onDragStart?.(item);

    // Store drag data globally for drop detection
    globalDragState = {
      ...globalDragState,
      isDragging: true,
      dragItem: item,
      dragOffset: { x: clientX - rect.left, y: clientY - rect.top },
      dragPosition: { x: clientX, y: clientY },
    };

    // Notify listeners
    dragStateListeners.forEach(listener => listener(globalDragState));

    // Auto-scroll animation function
    const autoScroll = () => {
      const { y: clientY } = currentMousePos.current;
      const viewportHeight = window.innerHeight;
      
      let scrollAmount = 0;
      
      // Get current scroll info
      const currentScrollY = window.scrollY;
      const documentHeight = initialDocumentHeight.current;
      const maxScrollY = Math.max(0, documentHeight - viewportHeight);
      
      // Calculate scroll direction and speed based on mouse position
      if (clientY > viewportHeight - SCROLL_THRESHOLD) {
        // Near bottom - scroll down
        const remainingScroll = maxScrollY - currentScrollY;
        if (remainingScroll > SCROLL_TOLERANCE) {
          const intensity = (clientY - (viewportHeight - SCROLL_THRESHOLD)) / SCROLL_THRESHOLD;
          scrollAmount = Math.min(MAX_SCROLL_SPEED, intensity * MAX_SCROLL_SPEED);
          
          // Ensure we don't scroll past the bottom
          scrollAmount = Math.min(scrollAmount, remainingScroll);
        }
      } else if (clientY < SCROLL_THRESHOLD) {
        // Near top - scroll up
        if (currentScrollY > SCROLL_TOLERANCE) {
          const intensity = (SCROLL_THRESHOLD - clientY) / SCROLL_THRESHOLD;
          scrollAmount = -Math.min(MAX_SCROLL_SPEED, intensity * MAX_SCROLL_SPEED);
          
          // Ensure we don't scroll past the top
          scrollAmount = Math.max(scrollAmount, -currentScrollY);
        }
      }
      
      if (scrollAmount !== 0) {
        window.scrollBy(0, scrollAmount);
        autoScrollRef.current = requestAnimationFrame(autoScroll);
      } else {
        autoScrollRef.current = null;
      }
    };

    const handleMove = (clientX: number, clientY: number) => {
      if (!dragRef.current) return;

      // Update current mouse position for auto-scroll
      currentMousePos.current = { x: clientX, y: clientY };

      const deltaX = clientX - initialMousePos.current.x;
      const deltaY = clientY - initialMousePos.current.y;
      
      // Account for scroll offset changes during drag
      const currentScrollX = window.scrollX;
      const currentScrollY = window.scrollY;
      const scrollDeltaX = currentScrollX - initialScrollPos.current.x;
      const scrollDeltaY = currentScrollY - initialScrollPos.current.y;

      dragRef.current.style.transform = `translate(${deltaX + scrollDeltaX}px, ${deltaY + scrollDeltaY}px)`;
      dragRef.current.style.zIndex = '9999';
      dragRef.current.style.pointerEvents = 'none';

      // Start auto-scroll if not already running
      if (!autoScrollRef.current) {
        const viewportHeight = window.innerHeight;
        
        if (clientY > viewportHeight - SCROLL_THRESHOLD || clientY < SCROLL_THRESHOLD) {
          autoScrollRef.current = requestAnimationFrame(autoScroll);
        }
      }

      // Update global position and insertion preview
      const elementBelow = document.elementFromPoint(clientX, clientY);
      const columnElement = elementBelow?.closest('[data-task-column]');
      
      let insertionPreview = undefined;
      if (columnElement) {
        const columnId = columnElement.getAttribute('data-column-id');
        if (columnId) {
          const insertionIndex = calculateInsertionIndex(clientY, columnId);
          insertionPreview = { columnId, index: insertionIndex };
        }
      }

      globalDragState = {
        ...globalDragState,
        dragPosition: { x: clientX, y: clientY },
        insertionPreview,
      };
      dragStateListeners.forEach(listener => listener(globalDragState));
    };

    const endDrag = (clientX: number, clientY: number) => {
      // Stop auto-scroll
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }

      if (dragRef.current) {
        dragRef.current.style.transform = '';
        dragRef.current.style.zIndex = '';
        dragRef.current.style.pointerEvents = '';
      }

      // Check if we're over a drop zone
      const elementBelow = document.elementFromPoint(clientX, clientY);
      const dropZone = elementBelow?.closest('[data-drop-zone]');
      
      if (dropZone && globalDragState.dragItem) {
        const onDropHandler = (dropZone as any)._onDrop;
        if (onDropHandler) {
          onDropHandler(globalDragState.dragItem, { x: clientX, y: clientY });
        }
      }

      setIsDragging(false);
      onDragEnd?.(item);

      // Reset global state
      globalDragState = {
        isDragging: false,
        dragItem: null,
        dragOffset: { x: 0, y: 0 },
        dragPosition: { x: 0, y: 0 },
        insertionPreview: undefined,
      };
      dragStateListeners.forEach(listener => listener(globalDragState));

      cleanup();
    };

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      endDrag(e.clientX, e.clientY);
    };

    // Touch event handlers
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        handleMove(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      if (touch) {
        endDrag(touch.clientX, touch.clientY);
      }
    };

    const cleanup = () => {
      // Stop auto-scroll if running
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      startDrag(touch.clientX, touch.clientY);
    }
  };
  return {
    dragRef,
    isDragging,
    dragProps: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
      style: {
        cursor: 'grab',
        userSelect: 'none' as const,
        transition: isDragging ? 'none' : 'transform 0.2s ease',
        touchAction: 'none', // Prevent default touch behaviors
      },
    },
  };
}

export function useDroppable({ accept, onDrop, onDragLeave }: UseDroppableOptions) {
  const [isOver, setIsOver] = useState(false);
  const dropRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = dropRef.current;
    if (!element) return;

    // Mark as drop zone
    element.setAttribute('data-drop-zone', 'true');
    (element as any)._onDrop = (dragItem: DragItem, mousePosition?: { x: number; y: number }) => {
      const acceptTypes = Array.isArray(accept) ? accept : [accept];
      if (acceptTypes.includes(dragItem.type)) {
        onDrop?.(dragItem, element, mousePosition);
      }
    };

    const handleMouseEnter = () => {
      if (globalDragState.isDragging) {
        setIsOver(true);
      }
    };

    const handleMouseLeave = () => {
      if (globalDragState.isDragging) {
        setIsOver(false);
        onDragLeave?.();
      }
    };

    // Touch events - we'll use the global drag position to detect when we're over this element
    const handleTouchMove = (e: TouchEvent) => {
      if (!globalDragState.isDragging) return;
      
      const touch = e.touches[0];
      if (touch) {
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const isOverThisElement = element.contains(elementBelow);
        
        if (isOverThisElement && !isOver) {
          setIsOver(true);
        } else if (!isOverThisElement && isOver) {
          setIsOver(false);
          onDragLeave?.();
        }
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('touchmove', handleTouchMove);
      element.removeAttribute('data-drop-zone');
      delete (element as any)._onDrop;
    };
  }, [accept, onDrop, onDragLeave]);

  // Listen for global drag state changes to reset isOver when drag ends
  useEffect(() => {
    const handleDragStateChange = (state: DragState) => {
      if (!state.isDragging) {
        setIsOver(false);
      }
    };

    dragStateListeners.add(handleDragStateChange);
    
    return () => {
      dragStateListeners.delete(handleDragStateChange);
    };
  }, []);

  return {
    dropRef: dropRef as React.RefObject<any>,
    isOver,
    dropProps: {},
  };
}

// Hook to access global drag state for insertion preview
export function useDragState() {
  const [dragState, setDragState] = useState<DragState>(globalDragState);

  useEffect(() => {
    const handleDragStateChange = (state: DragState) => {
      setDragState(state);
    };

    dragStateListeners.add(handleDragStateChange);
    
    return () => {
      dragStateListeners.delete(handleDragStateChange);
    };
  }, []);

  return dragState;
}

// Global drag state management
let globalDragState: DragState = {
  isDragging: false,
  dragItem: null,
  dragOffset: { x: 0, y: 0 },
  dragPosition: { x: 0, y: 0 },
  insertionPreview: undefined,
};

const dragStateListeners = new Set<(state: DragState) => void>();

// Utility to calculate where to insert a task based on mouse Y position
export function calculateInsertionIndex(mouseY: number, columnId: string): number {
  const columnElement = document.querySelector(`[data-task-column][data-column-id="${columnId}"]`);
  if (!columnElement) return 0;
  
  const taskElements = Array.from(
    columnElement.querySelectorAll('[data-task-card]')
  ) as HTMLElement[];
  
  // Filter out the currently dragged task (it has task-card-dragging class)
  const visibleTaskElements = taskElements.filter(el => 
    !el.classList.contains('task-card-dragging')
  );
  
  if (visibleTaskElements.length === 0) return 0;
  
  // Find the insertion point by comparing mouse Y with task positions
  for (let i = 0; i < visibleTaskElements.length; i++) {
    const rect = visibleTaskElements[i].getBoundingClientRect();
    const taskCenterY = rect.top + rect.height / 2;
    
    // If mouse is above the center of this task, insert before it
    if (mouseY < taskCenterY) {
      return i;
    }
  }
  
  // If we got here, insert at the end
  return visibleTaskElements.length;
}




