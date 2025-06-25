import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../contexts/ThemeContext';
import './Modal.css';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large' | 'fullscreen';
    closeOnEscape?: boolean;
    closeOnOverlayClick?: boolean;
    className?: string;
}

export default function Modal({
    isOpen,
    onClose,
    children,
    size = 'medium',
    closeOnEscape = true,
    closeOnOverlayClick = true,
    className = ''
}: ModalProps) {
    const { theme } = useTheme();
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Handle escape key
    useEffect(() => {
        if (!isOpen || !closeOnEscape) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, onClose]);    // Handle focus management
    useEffect(() => {
        if (isOpen) {
            // Store currently focused element
            previousActiveElement.current = document.activeElement as HTMLElement;

            // Focus the modal
            if (modalRef.current) {
                modalRef.current.focus();
            }
        } else {
            // Restore focus
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        }
    }, [isOpen]);

    // Handle overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div
            className="modal-overlay"
            role="presentation"
            onClick={handleOverlayClick}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
        >
            <div
                ref={modalRef}
                className={`modal-container modal-${size} ${className}`}
                style={{
                    backgroundColor: theme.background.elevated,
                    borderColor: theme.border.medium,
                    color: theme.text.primary,
                }}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
            >
                {children}
            </div>
        </div>
    );

    // Render modal in portal to body
    return createPortal(modalContent, document.body);
}
