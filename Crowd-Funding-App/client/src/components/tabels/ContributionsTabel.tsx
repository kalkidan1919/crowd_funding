import { useState, useEffect } from "react";
import type { ApiContribution } from "../../types/fundedProjectsData";
import api from "../../api";
import { useAuth } from "../../contexts/AuthContext";

export default function ContributionsTable() {
  const { user } = useAuth();
  const [contributions, setContributions] = useState<ApiContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyContributions = async () => {
      try {
        const response = await api.get("/contributions");
        // The API returns paginated data, data is in response.data.data
        // Filter by current user if backend doesn't already do it (index usually shows all for admin,
        // but let's assume we filter for now if it's "My" contributions)
        // Actually, a good API would have a specific endpoint or filter.
        // Looking at ContributionController, index() shows ALL.
        // Let's filter here for the user.
        const allContributions = response.data.data || [];
        const myContributions = allContributions.filter(
          (c: any) => c.backer_id === user?.user_id
        );
        setContributions(myContributions);
      } catch (err: any) {
        setError("Failed to load your contributions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyContributions();
    }
  }, [user]);

  const getStatusStyles = (status: ApiContribution["payment_status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return <div className="text-center py-10">Loading contributions...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contributions.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  You haven't backed any projects yet.
                </td>
              </tr>
            ) : (
              contributions.map((c) => (
                <tr
                  key={c.contribution_id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {c.campaign?.title || "Unknown Campaign"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${c.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(
                        c.payment_status
                      )}`}
                    >
                      {c.payment_status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
