import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Users } from "lucide-react";

const MOCK_USERS = [
  { id: "u1", name: "Demo Admin", phone: "+880 1700 000001", role: "admin", createdAt: "2025-01-10" },
  { id: "u2", name: "Rahul Seller", phone: "+880 1800 000002", role: "seller", createdAt: "2025-02-14" },
  { id: "u3", name: "Fatima Buyer", phone: "+880 1900 000003", role: "buyer", createdAt: "2025-03-22" },
];

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-500/20 text-purple-400",
  seller: "bg-blue-500/20 text-blue-400",
  buyer: "bg-emerald-500/20 text-emerald-400",
};

export default function AdminUsersPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Users</h1>
          <p className="text-sm text-white/50 mt-1">
            All registered users on PaikarMart. Wire to <code className="text-white/70">GET /api/admin/users</code> when admin endpoints are added.
          </p>
        </div>

        <GlassCard className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-3 text-left text-white/50 font-medium">User</th>
                <th className="p-3 text-left text-white/50 font-medium">Phone</th>
                <th className="p-3 text-left text-white/50 font-medium">Role</th>
                <th className="p-3 text-left text-white/50 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_USERS.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 text-white">{u.name}</td>
                  <td className="p-3 text-white/70">{u.phone}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${ROLE_COLORS[u.role] ?? "bg-white/10 text-white/60"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-white/50 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3 border-dashed border-white/20">
          <Users className="w-5 h-5 text-white/40" />
          <p className="text-sm text-white/50">
            Real user data will appear here once <code className="text-white/70">GET /api/admin/users</code> is added to the OpenAPI spec and API server.
          </p>
        </GlassCard>
      </div>
    </Layout>
  );
}
