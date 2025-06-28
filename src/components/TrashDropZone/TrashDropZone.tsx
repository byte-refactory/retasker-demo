import { Trash2 } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';
import './TrashDropZone.css';

interface TrashDropZoneProps {
    isVisible: boolean;
}

function TrashDropZone({ isVisible }: TrashDropZoneProps) {
    const { theme } = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    
    const { setNodeRef, isOver } = useDroppable({
        id: 'trash',
    });

    if (!isVisible) return null;

    const isActive = isOver || isHovered;

    return (
        <div
            ref={setNodeRef}
            className={`trash-drop-zone ${isActive ? 'trash-drop-zone-over' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
                {isOver ? 'Release to Delete' : isHovered ? 'Drop Task Here' : 'Drop to Delete'}
            </span>
        </div>
    );
}

export default TrashDropZone;