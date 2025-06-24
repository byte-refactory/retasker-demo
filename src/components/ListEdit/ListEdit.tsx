import { Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import ListEditItem from './ListEditItem';
import '../Modal/ModalShared.css';
import './ListEdit.css';

interface ListEditProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function ListEdit({ values, onChange, placeholder }: ListEditProps) {
  const { theme } = useTheme();

  const handleItemChange = (idx: number, newValue: string) => {
    const updated = values.map((v, i) => (i === idx ? newValue : v));
    onChange(updated);
  };

  const handleDelete = (idx: number) => {
    const updated = values.filter((_, i) => i !== idx);
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...values, '']);
  };

  return (
    <div className="list-edit">
      {values.map((value, idx) => (
        <ListEditItem
          key={idx}
          value={value}
          onChange={val => handleItemChange(idx, val)}
          onDelete={() => handleDelete(idx)}
          placeholder={placeholder}
        />
      ))}
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
  );
}
