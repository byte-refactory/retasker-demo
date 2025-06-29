import { Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import ListEditItem from './ListEditItem';
import '../Modal/ModalShared.css';
import './ListEdit.css';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState, useRef, useEffect } from 'react';

interface ListEditItem {
  id: string;
  value: string;
}

interface ListEditProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function ListEdit({ values, onChange, placeholder }: ListEditProps) {
  const { theme } = useTheme();
  const [items, setItems] = useState<ListEditItem[]>(() => 
    values.map((value, index) => ({ id: `item-${Date.now()}-${index}`, value }))
  );
  const nextIdRef = useRef(values.length);

  // Update items when values prop changes (from external sources)
  useEffect(() => {
    // Only update if the array lengths don't match or values differ
    if (items.length !== values.length || items.some((item, idx) => item.value !== values[idx])) {
      setItems(prev => {
        // Preserve existing IDs where possible
        const newItems: ListEditItem[] = [];
        values.forEach((value, index) => {
          const existingItem = prev[index];
          if (existingItem && existingItem.value === value) {
            newItems.push(existingItem);
          } else {
            newItems.push({ id: `item-${Date.now()}-${nextIdRef.current++}`, value });
          }
        });
        return newItems;
      });
    }
  }, [values, items]);

  const updateParent = (newItems: ListEditItem[]) => {
    onChange(newItems.map(item => item.value));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleItemChange = (id: string, newValue: string) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, value: newValue } : item
    );
    setItems(newItems);
    updateParent(newItems);
  };

  const handleDelete = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    updateParent(newItems);
  };

  const handleAdd = () => {
    const newItem = { id: `item-${Date.now()}-${nextIdRef.current++}`, value: '' };
    const newItems = [...items, newItem];
    setItems(newItems);
    updateParent(newItems);
  };


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        setItems(newItems);
        updateParent(newItems);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="list-edit">
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <ListEditItem
              key={item.id}
              id={item.id}
              value={item.value}
              onChange={val => handleItemChange(item.id, val)}
              onDelete={() => handleDelete(item.id)}
              placeholder={placeholder}
            />
          ))}
        </SortableContext>
        <button
          className="modal-x-btn list-edit-add-btn"
          type="button"
          aria-label="Add item"
          onClick={handleAdd}
          style={{ color: theme.interactive.primary }}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Drag Overlay for smooth animations
      <DragOverlay>
        {activeItem !== null && activeIndex !== -1 ? (
          <ListEditItem
            id={getItemId(activeItem, activeIndex)}
            value={activeItem}
            onChange={() => {}} // No-op during drag
            onDelete={() => {}} // No-op during drag
            placeholder={placeholder}
          />
        ) : null}
      </DragOverlay> */}
    </DndContext>
  );
}
