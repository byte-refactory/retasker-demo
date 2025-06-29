import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import TaskBoardPage from './pages/TaskBoardPage';
import Attribution from './components/Attribution';
import ThemeToggle from './components/ThemeToggle';
import Logo from './components/Logo';
import './App.css';

function AppContent() {
  const { themeName, theme } = useTheme();
  
  return (
    <div data-theme={themeName}
      className="app"
      style={{
        backgroundColor: theme.background.primary,
        color: theme.text.primary,
      }}
    >
      <header 
        className="app-header"
        style={{
          backgroundColor: theme.header.background,
          borderBottom: `1px solid ${theme.header.borderBottom}`,
        }}
      >
        <Logo />
        <ThemeToggle />
      </header>
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
