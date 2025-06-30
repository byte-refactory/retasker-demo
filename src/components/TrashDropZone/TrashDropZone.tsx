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

    return (
        <div
            id="trash"
            ref={setNodeRef}
            className={`trash-drop-zone ${isHovered ? 'trash-drop-zone-over' : ''}`}
            data-is-hovered={isHovered}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                backgroundColor: isHovered ? '#ff4444' : theme.background.secondary,
                borderColor: isHovered ? '#ff6666' : theme.border.medium,
                color: isHovered ? '#ffffff' : theme.text.secondary,
            }}
        >
            <Trash2
                size={28}
                className={`trash-icon ${isHovered ? 'trash-icon-active' : ''}`}
            />
            <span className="trash-text">
                Drop to Delete
            </span>
        </div>
    );
}

export default TrashDropZone;