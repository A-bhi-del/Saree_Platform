import { useRequest } from "../context/RequestContext";

function CustomerDashboard() {
  const { requests } = useRequest();

  const totalRequests = requests.length;

  const totalApprovedRequests = requests.filter(
    (request) => request.status === "approved",
  ).length;

  const totalRejectedRequests = requests.filter(
    (request) => request.status === "rejected",
  ).length;

  const totalPendingRequests = requests.filter(
    (request) => request.status === "pending",
  ).length;

  if (requests.length === 0) {
    return <h2>No Requests Yet</h2>;
  }

  return (
    <div>
      <h3>Total Requests: {totalRequests}</h3>

      <h3>
        Approved Requests:
        {totalApprovedRequests}
      </h3>

      <h3>
        Rejected Requests:
        {totalRejectedRequests}
      </h3>

      <h3>
        Pending Requests:
        {totalPendingRequests}
      </h3>

      <div>
        {requests.map((request) => (
          <div key={request.id}>
            <h3>{request.requestType}</h3>
            <p>{request.requiredByDate}</p>
            <p>{request.quantity}</p>
            <p>{request.designName}</p>
            <p>{request.fabric}</p>
            <p>{request.color}</p>
            <p>{request.description}</p>
            <p>{request.budget}</p>
            <p>{request.status}</p>
            {request.image && (
              <img src={request.image} alt={request.designName} width="200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerDashboard;
