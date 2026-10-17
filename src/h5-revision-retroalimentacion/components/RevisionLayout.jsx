import { Outlet } from 'react-router-dom';
import { RevisionProvider } from '../context/RevisionContext.jsx';

export default function RevisionLayout() {
  return (
    <RevisionProvider>
      <Outlet />
    </RevisionProvider>
  );
}