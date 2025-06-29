import { Trash2 } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { useTheme } from '../../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import './TrashDropZone.css';

interface TrashDropZoneProps {
    isVisible: boolean;
    onHoverChange?: (isHovered: boolean) => void;
    resetHover?: boolean; // New prop to force reset hover state
}

function TrashDropZone({ isVisible, onHoverChange, resetHover }: TrashDropZoneProps) {
    const { theme } = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    
    // Reset hover state when resetHover prop changes
    useEffect(() => {
        if (resetHover) {
            setIsHovered(false);
            onHoverChange?.(false);
        }
    }, [resetHover, onHoverChange]);
    
    const { setNodeRef } = useDroppable({
        id: 'trash',
    });

    const handleMouseEnter = () => {
        setIsHovered(true);
        onHoverChange?.(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        onHoverChange?.(false);
    };

    if (!isVisible) return null;

    const isActive = isHovered;

    return (
        <div
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