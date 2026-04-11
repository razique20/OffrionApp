'use client';

import { useUser } from '@/hooks/useUser';

export default function DebugUserPage() {
  const { user, loading } = useUser();

  if (loading) return <div className="p-20 text-center">Loading user state...</div>;

  return (
    <div className="p-20 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">User Debug Info</h1>
      
      <div className="bg-secondary/20 border border-border p-6 rounded-2xl overflow-auto">
        <pre className="text-sm">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="space-y-2">
        <p><strong>Roles (array):</strong> {JSON.stringify(user?.roles)}</p>
        <p><strong>Primary Role (singular):</strong> {user?.role}</p>
      </div>

      <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
        <p className="text-sm">
          If <code>roles</code> is missing or only contains one item, the Navbar switcher will be hidden.
        </p>
      </div>
    </div>
  );
}
