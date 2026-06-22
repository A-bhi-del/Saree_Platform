import { useRequest } from "../context/RequestContext";

function Requests() {
  const { requests, approveRequest, rejectRequest } = useRequest();

  if (requests.length === 0) {
    return <h2>No Requests Available</h2>;
  }

  return (
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
          <img src={request.image} alt={request.designName} width="200" />
          {request.status === "pending" && (
            <button onClick={() => approveRequest(request.id)}>Approve</button>
          )}
          {request.status === "pending" && (
            <button onClick={() => rejectRequest(request.id)}>Reject</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Requests;
