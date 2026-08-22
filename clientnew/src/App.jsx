import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import ToastContainer from './components/common/ToastContainer';
import ThemeColorPickerModal from './components/common/ThemeColorPickerModal';
import { fetchCurrentUser } from './redux/slices/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text transition-colors duration-200">
      <AppRoutes />
      <ToastContainer />
      <ThemeColorPickerModal />
    </div>
  );
}

export default App;
