import { Link } from "react-router-dom";

const PolicyCard = ({ policy }) => (
  <div className="p-4 border rounded-lg shadow hover:shadow-lg">
    <h3 className="text-lg font-bold">{policy.crop_type}</h3>
    <p>Coverage: {policy.coverage_amount}</p>
    <p>Status: {policy.status}</p>
    <p>Token ID: {policy.token_id}</p>
    <Link to={`/policy/${policy._id}`} className="text-blue-500 underline">View</Link>
  </div>
);

export default PolicyCard;
