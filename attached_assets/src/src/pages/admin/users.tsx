import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/features/auth/AuthContext";

export default function AdminUsersPage() {
  const { user } = useAuth();
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold">Users</h1>
      <p className="text-sm text-muted-foreground">
        UI shell — wire to <code>GET /api/admin/users</code> when the admin endpoints are added to OpenAPI.
      </p>
      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left">
            <tr>
              <th className="p-3">User</th><th className="p-3">Phone</th><th className="p-3">Role</th><th className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {user ? (
              <tr className="border-t border-white/10">
                <td className="p-3">{user.fullName}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ) : (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Log in to see your account here.</td></tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
