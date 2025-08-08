import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchPolicyById } from "../api/insuranceApi";
import { initWeb3, purchasePolicy, claimInsurance } from "../blockchain/contract";

const PolicyDetail = () => {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [txStatus, setTxStatus] = useState("");

  useEffect(() => {
    fetchPolicyById(id)
      .then(data => {
        setPolicy(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAction = async (type) => {
    try {
      await initWeb3();
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const from = accounts[0];

      setTxStatus("Processing...");

      if (type === "purchase") {
        await purchasePolicy(policy.token_id, from);
        setTxStatus("Purchase successful.");
      } else {
        await claimInsurance(policy.token_id, from);
        setTxStatus("Claim successful.");
      }
    } catch (err) {
      setTxStatus(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!policy) return <p>Policy not found</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">{policy.crop_type}</h2>
      <p>Coverage: {policy.coverage_amount}</p>
      <p>Premium: {policy.premium}</p>
      <p>Status: {policy.status}</p>
      <p>Token ID: {policy.token_id}</p>
      <p>Expires: {policy.expiration_date}</p>

      <div className="mt-4 space-x-2">
        <button onClick={() => handleAction("purchase")} className="bg-blue-500 text-white px-4 py-2 rounded">
          Purchase
        </button>
        <button onClick={() => handleAction("claim")} className="bg-green-500 text-white px-4 py-2 rounded">
          Claim
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600">{txStatus}</p>
    </div>
  );
};

export default PolicyDetail;
