import { Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import '../Modal/ModalShared.css';
import './ListEdit.css';

interface ListEditItemProps {
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
  placeholder?: string;
}

export default function ListEditItem({ value, onChange, onDelete, placeholder }: ListEditItemProps) {
  const { theme } = useTheme();
  return (
    <div className="list-edit-item">
      <input
        className="list-edit-item-input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: theme.background.secondary,
          color: theme.text.primary,
          border: `1px solid ${theme.border.medium}`,
        }}
      />
      <button
        className="modal-x-btn"
        type="button"
        aria-label="Delete"
        onClick={onDelete}
        style={{ color: theme.interactive.danger }}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
