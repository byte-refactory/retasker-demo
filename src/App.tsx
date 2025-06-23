import { ThemeProvider } from './contexts/ThemeContext';
import TaskBoardPage from './pages/TaskBoardPage';
import Attribution from './components/Attribution';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './contexts/ThemeContext';
import './App.css';

function AppContent() {
  const { theme } = useTheme();
    return (
    <div className="app" style={{ backgroundColor: theme.background.primary }}>
      <ThemeToggle/>
      <TaskBoardPage />
      <Attribution />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
