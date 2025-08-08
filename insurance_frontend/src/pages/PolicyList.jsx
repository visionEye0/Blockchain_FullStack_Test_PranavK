import { useEffect, useState } from "react";
import { fetchPolicies } from "../api/insuranceApi";
import PolicyCard from "../components/PolicyCard";

const PolicyList = () => {
  const [policies, setPolicies] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicies()
      .then(data => {
        setPolicies(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = policies.filter(p => 
    statusFilter === "all" || p.status === statusFilter
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Crop Insurance Policies</h1>

      <div className="mb-4">
        <label className="mr-2">Filter:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="claimed">Claimed</option>
        </select>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(policy => (
            <PolicyCard key={policy._id} policy={policy} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PolicyList;
