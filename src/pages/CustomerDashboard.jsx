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
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 font-serif">
        <div className="text-4xl mb-3">🛍️</div>
        <h2 className="text-xl font-semibold text-gray-700">No Requests Found</h2>
        <p className="text-sm text-gray-400 mt-1">You haven't submitted any custom design or restock requests yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 md:px-12 py-10">
      
      {/* Title Header */}
      <div className="mb-10 border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-800 font-serif uppercase tracking-wide">
          My Account Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">Track your custom weave orders, style updates, and restock tickets.</p>
      </div>

      {/* Analytics Summary Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        
        {/* Total Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Made</span>
          <span className="text-3xl font-extrabold text-gray-800 mt-2">{totalRequests}</span>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm flex flex-col justify-between border-l-4 border-l-amber-500">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">In Review</span>
          <span className="text-3xl font-extrabold text-amber-700 mt-2">{totalPendingRequests}</span>
        </div>

        {/* Approved Card */}
        <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm flex flex-col justify-between border-l-4 border-l-emerald-500">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Approved</span>
          <span className="text-3xl font-extrabold text-emerald-700 mt-2">{totalApprovedRequests}</span>
        </div>

        {/* Rejected Card */}
        <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex flex-col justify-between border-l-4 border-l-red-500">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Declined</span>
          <span className="text-3xl font-extrabold text-red-700 mt-2">{totalRejectedRequests}</span>
        </div>

      </div>

      {/* History Items Listing */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 font-serif uppercase tracking-wider mb-6">
          Request History Tracking
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((request) => (
            <div 
              key={request.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row gap-5 items-start relative overflow-hidden hover:shadow-md transition-shadow"
            >
              
              {/* Image box if uploaded */}
              {request.image && (
                <div className="w-full sm:w-28 h-36 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                  <img 
                    src={request.image} 
                    alt={request.designName} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Specification Details Context */}
              <div className="flex-grow space-y-2 w-full">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-gray-800 font-serif">{request.designName}</h3>
                  
                  {/* Inline Status pill */}
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    request.status === 'pending' && 'bg-amber-50 text-amber-700 border border-amber-200'
                  } ${
                    request.status === 'approved' && 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  } ${
                    request.status === 'rejected' && 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {request.status}
                  </span>
                </div>

                {/* Sub-label attributes */}
                <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Type: <strong className="text-gray-700 capitalize">{request.requestType}</strong></span>
                  <span>Fabric: <strong className="text-gray-700 capitalize">{request.fabric}</strong></span>
                  <span>Color: <strong className="text-gray-700 capitalize">{request.color}</strong></span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded italic">
                  "{request.description || "No description provided."}"
                </p>

                {/* Summary Row */}
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                  <div>Qty: <span className="font-bold text-gray-800">{request.quantity}</span></div>
                  <div>Budget: <span className="font-bold text-rose-900">₹{request.budget}</span></div>
                  <div className="text-[11px]">Date: <span className="font-medium text-gray-700">{request.requiredByDate}</span></div>
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default CustomerDashboard;