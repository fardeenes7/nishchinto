"use client";

import { useEffect, useState } from "react";
// Assumes ui/button is standard, we'll just mock the design blocks for now.
// In reality, you'd fetch this using React Query from `GET /api/v1/admin/waitlist/`

type WaitlistEntry = {
  id: number;
  email: string;
  phone_number: string;
  survey_data: any;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
}

export default function AdminWaitlistDashboard() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Example placeholder fetch map
  useEffect(() => {
    // const res = await fetch('/api/v1/admin/waitlist/', { headers: { Authorization: `Bearer ${token}` }})
    // setEntries(await res.json());
    setLoading(false);
  }, []);

  async function handleApprove(id: number) {
    // API logic to hit POST /api/v1/admin/waitlist/<id>/approve/
    // Update local state optimistic UI
  }

  if (loading) return <div className="p-10 font-bold">Loading CRM...</div>;

  return (
    <main className="min-h-screen bg-background p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Marketing Waitlist</h1>
          <p className="text-muted-foreground">Review inbound pipeline and approve merchant SaaS tenants.</p>
        </div>

        <div className="rounded-md border border-border bg-card">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground sticky top-0">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone Number</th>
                <th className="px-4 py-3 font-medium">Expected Orders</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entries.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No entries found.</td></tr>
              ) : (
                entries.map(entry => (
                  <tr key={entry.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{entry.email}</td>
                    <td className="px-4 py-3">{entry.phone_number}</td>
                    <td className="px-4 py-3">{entry.survey_data?.estimated_monthly_orders || "N/A"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${entry.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-green-500/10 text-green-600'}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {entry.status === 'PENDING' && (
                         <button 
                            onClick={() => handleApprove(entry.id)}
                            className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-md hover:bg-primary/90 font-medium transition-colors">
                           Approve
                         </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
