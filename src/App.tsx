import { ThemeProvider } from './contexts/ThemeContext';
import { TaskListProvider } from './contexts/TaskListsContext';
import TaskBoardPage from './pages/TaskBoardPage';
import Attribution from './components/Attribution';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function AppContent() {
  
  return (
      <TaskListProvider>
        <ThemeToggle/>
        <TaskBoardPage />
        <ThemeToggle />
        <Attribution />
      </TaskListProvider>
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
