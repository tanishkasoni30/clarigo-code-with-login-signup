import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import { getInitials } from '../../utils/userHelpers';
import ConfirmDialog from './ConfirmDialog';
import { IconEdit, IconPlus, IconSearch, IconTrash } from './DashboardIcons';

const PAGE_SIZE = 8;

function isSameUser(sessionUser, rowUser) {
  if (!sessionUser?.id || !rowUser?._id) return false;
  return String(sessionUser.id) === String(rowUser._id);
}

export default function UserManagementSection({ users, loading, error, onDeleteUser }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const currentUser = getUser();

  const filtersActive = search.trim() !== '' || roleFilter !== 'all';

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function clearFilters() {
    setSearch('');
    setRoleFilter('all');
    setPage(1);
  }

  function openDeleteDialog(user) {
    setDeleteError('');
    if (isSameUser(currentUser, user)) {
      setDeleteError('You cannot delete your own account while logged in.');
      return;
    }
    setDeleteTarget(user);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await onDeleteUser(deleteTarget._id);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="admin-panel" id="user-management">
      <div className="admin-panel-head">
        <div>
          <h2>User Management</h2>
          <p>View and manage all registered users.</p>
        </div>
        <Link to="/create" className="admin-btn admin-btn--primary">
          <IconPlus />
          Add User
        </Link>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <IconSearch />
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            aria-label="Search users"
          />
        </div>
        <select
          className="admin-select"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by role"
        >
          <option value="all">All roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
        {filtersActive && (
          <button type="button" className="admin-btn admin-btn--ghost" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {deleteError && <div className="admin-alert admin-alert--error">{deleteError}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-state admin-state--loading">
            <div className="admin-spinner" aria-hidden="true" />
            <p>Loading users…</p>
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="admin-state">
            <p>{filtersActive ? 'No users match your search or filters.' : 'No users found yet.'}</p>
            {filtersActive ? (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={clearFilters}>
                Clear filters
              </button>
            ) : (
              <Link to="/create" className="admin-btn admin-btn--primary">
                Add your first user
              </Link>
            )}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th aria-label="Actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="admin-user-cell">
                      <span className="admin-user-avatar" aria-hidden="true">
                        {getInitials(u.name)}
                      </span>
                      <div>
                        <span className="admin-user-name">{u.name}</span>
                        <span className="admin-user-email">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-role-pill admin-role-pill--${(u.role || 'User').toLowerCase()}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--soft"
                        aria-label={`Edit ${u.name}`}
                        onClick={() => navigate(`/update/${u._id}`)}
                      >
                        <IconEdit />
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--danger"
                        aria-label={`Delete ${u.name}`}
                        onClick={() => openDeleteDialog(u)}
                        disabled={isSameUser(currentUser, u)}
                        title={isSameUser(currentUser, u) ? 'You cannot delete your own account' : 'Delete user'}
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && filteredUsers.length > PAGE_SIZE && (
        <div className="admin-pagination">
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span>
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete user?"
        message={
          deleteTarget
            ? `This will permanently remove ${deleteTarget.name} (${deleteTarget.email}). This action cannot be undone.`
            : ''
        }
        confirmLabel={deleting ? 'Deleting…' : 'Delete user'}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </section>
  );
}
