import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Admin() {
  const {
    user,
    adminUsers,
    adminLoading,
    adminError,
    fetchAdminUsers,
    updateUserRole,
    logout,
  } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/home");
      return;
    }

    fetchAdminUsers();
  }, [user, navigate, fetchAdminUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
    } catch (err) {
      console.error("Role update failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300 pb-10">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-rose-500 font-black">
              Admin Console
            </p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 mt-3">
              User Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
              Review registered users and update account roles directly from the
              admin panel.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={() => navigate("/home")}
              className="px-5 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-5 py-3 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-rose-600 transition"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-6">
          {adminLoading ? (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400">
              Loading users…
            </div>
          ) : adminError ? (
            <div className="bg-rose-50 dark:bg-rose-950/20 border-l-4 border-rose-500 p-4 rounded-xl text-rose-700 dark:text-rose-300 text-sm">
              {adminError}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-black border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="md:col-span-2">Name</span>
                <span className="hidden md:inline-block">Email</span>
                <span>Phone</span>
                <span>Role</span>
              </div>

              {adminUsers.length === 0 ? (
                <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                  No users found yet.
                </div>
              ) : (
                adminUsers.map((userItem) => (
                  <div
                    key={userItem._id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center py-4 border-b border-slate-200 dark:border-slate-800"
                  >
                    <div className="md:col-span-2 space-y-1">
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {userItem.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Joined{" "}
                        {new Date(userItem.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="hidden md:block text-sm text-slate-600 dark:text-slate-300 truncate">
                      {userItem.email}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      {userItem.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                        value={userItem.role}
                        onChange={(e) =>
                          handleRoleChange(userItem._id, e.target.value)
                        }
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
