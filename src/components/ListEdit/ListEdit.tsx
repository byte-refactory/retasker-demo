import { Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import ListEditItem, { type ItemReference } from './ListEditItem';
import '../Modal/ModalShared.css';
import './ListEdit.css';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  TouchSensor,
  MouseSensor,
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
  value: ItemReference;
}

interface ListEditProps {
  values: ItemReference[];
  onChange: (values: ItemReference[]) => void;
  placeholder?: string;
  getItemError?: (item: ItemReference) => boolean;
}

export default function ListEdit({ values, onChange, placeholder, getItemError }: ListEditProps) {
  const { theme } = useTheme();
  const [items, setItems] = useState<ListEditItem[]>(() => 
    values.map((value, index) => ({ id: `item-${index}`, value }))
  );
  const nextIdRef = useRef(values.length);
  
  // Update items when values prop changes (from external sources)
  useEffect(() => {
    setItems(values.map((value, index) => ({ id: `item-${index}`, value })));
  }, [values]);

  // Update nextIdRef when items change
  useEffect(() => {
    nextIdRef.current = items.length;
  }, [items]);

  const updateParent = (newItems: ListEditItem[]) => {
    onChange(newItems.map(item => item.value));
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleItemChange = (id: string, newValue: string) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, value: { ...item.value, name: newValue } } : item
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
    const newItem = { id: `item-${nextIdRef.current++}`, value: {id: crypto.randomUUID(), name: ''} };
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
              isError={getItemError ? getItemError(item.value) : false}
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
    </DndContext>
  );
}
