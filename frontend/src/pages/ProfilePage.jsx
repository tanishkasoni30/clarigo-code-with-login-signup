import { getUser } from '../utils/auth';
import AdminProfile from './AdminProfile';

export default function ProfilePage() {
  const user = getUser();
  if (user?.role === 'Admin') return <AdminProfile />;

  return (
    <div className="container mt-4" style={{ textAlign: 'left', maxWidth: 520 }}>
      <div className="card shadow-sm border-0 p-4">
        <h2 className="h4 mb-3">Profile</h2>
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Role:</strong> {user?.role}
        </p>
      </div>
    </div>
  );
}
