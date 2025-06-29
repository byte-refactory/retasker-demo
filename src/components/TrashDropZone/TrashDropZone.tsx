import { Trash2 } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { useTheme } from '../../contexts/ThemeContext';
import { useDragDrop } from '../../contexts/DragDropContext';
import { useState, useEffect } from 'react';
import './TrashDropZone.css';

interface TrashDropZoneProps {
    isVisible: boolean;
}

function TrashDropZone({ isVisible }: TrashDropZoneProps) {
    const { theme } = useTheme();
    const { onTaskDeletion, onDragEnd } = useDragDrop();
    const [isHovered, setIsHovered] = useState(false);
    
    // Reset hover state when any task is deleted or drag ends
    useEffect(() => {
        const unsubscribeTaskDeletion = onTaskDeletion(() => {
            setIsHovered(false);
        });
        
        const unsubscribeDragEnd = onDragEnd(() => {
            setIsHovered(false);
        });
        
        return () => {
            unsubscribeTaskDeletion();
            unsubscribeDragEnd();
        };
    }, [onTaskDeletion, onDragEnd]);
    
    const { setNodeRef } = useDroppable({
        id: 'trash',
    });

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    if (!isVisible) return null;

    const isActive = isHovered;

    return (
        <div
            id="trash"
            ref={setNodeRef}
            className={`trash-drop-zone ${isActive ? 'trash-drop-zone-over' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                backgroundColor: isActive ? '#ff4444' : theme.background.secondary,
                borderColor: isActive ? '#ff6666' : theme.border.medium,
                color: isActive ? '#ffffff' : theme.text.secondary,
            }}
        >
            <Trash2
                size={28}
                className={`trash-icon ${isActive ? 'trash-icon-active' : ''}`}
            />
            <span className="trash-text">
                Drop to Delete
            </span>
        </div>
    );
}

export default TrashDropZone;