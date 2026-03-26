import { Outlet } from 'react-router-dom';
import ContactButton from './ContactButton';

export default function AppLayout() {
  return (
    <>
      <ContactButton />
      <Outlet />
    </>
  );
}
