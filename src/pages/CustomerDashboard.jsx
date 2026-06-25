import { useRequest } from "../context/RequestContext";
import { useTheme } from "../context/ThemeContext";

function CustomerDashboard() {
  const { requests } = useRequest();
  const { theme } = useTheme();

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

  const isDark = theme === "dark";

  // Empty State Screen
  if (requests.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] font-serif transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-slate-400" : "bg-gray-50 text-gray-500"
      }`}>
        <div className="text-4xl mb-3">🛍️</div>
        <h2 className={`text-xl font-semibold ${isDark ? "text-slate-200" : "text-gray-700"}`}>
          No Requests Found
        </h2>
        <p className={`text-sm mt-1 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
          You haven't submitted any custom design or restock requests yet.
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 md:px-12 py-10 transition-colors duration-300 ${
      isDark ? "bg-slate-950" : "bg-gray-50"
    }`}>
      
      {/* Title Header */}
      <div className={`mb-10 border-b pb-5 ${isDark ? "border-slate-800" : "border-gray-200"}`}>
        <h1 className={`text-2xl font-bold font-serif uppercase tracking-wide ${
          isDark ? "text-slate-100" : "text-gray-800"
        }`}>
          My Account Dashboard
        </h1>
        <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
          Track your custom weave orders, style updates, and restock tickets.
        </p>
      </div>

      {/* Analytics Summary Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        
        {/* Total Card */}
        <div className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between transition-colors ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
        }`}>
          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-gray-400"}`}>
            Total Made
          </span>
          <span className={`text-3xl font-extrabold mt-2 ${isDark ? "text-slate-100" : "text-gray-800"}`}>
            {totalRequests}
          </span>
        </div>

        {/* Pending Card */}
        <div className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between border-l-4 border-l-amber-500 transition-colors ${
          isDark ? "bg-slate-900 border-slate-800/80" : "bg-white border-amber-100"
        }`}>
          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-amber-500" : "text-amber-600"}`}>
            In Review
          </span>
          <span className={`text-3xl font-extrabold mt-2 ${isDark ? "text-amber-400" : "text-amber-700"}`}>
            {totalPendingRequests}
          </span>
        </div>

        {/* Approved Card */}
        <div className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between border-l-4 border-l-emerald-500 transition-colors ${
          isDark ? "bg-slate-900 border-slate-800/80" : "bg-white border-emerald-100"
        }`}>
          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-emerald-500" : "text-emerald-600"}`}>
            Approved
          </span>
          <span className={`text-3xl font-extrabold mt-2 ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
            {totalApprovedRequests}
          </span>
        </div>

        {/* Rejected Card */}
        <div className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between border-l-4 border-l-red-500 transition-colors ${
          isDark ? "bg-slate-900 border-slate-800/80" : "bg-white border-red-100"
        }`}>
          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-red-400" : "text-red-600"}`}>
            Declined
          </span>
          <span className={`text-3xl font-extrabold mt-2 ${isDark ? "text-red-400" : "text-red-700"}`}>
            {totalRejectedRequests}
          </span>
        </div>

      </div>

      {/* History Items Listing */}
      <div>
        <h2 className={`text-lg font-bold font-serif uppercase tracking-wider mb-6 ${
          isDark ? "text-slate-100" : "text-gray-800"
        }`}>
          Request History Tracking
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((request) => (
            <div 
              key={request.id} 
              className={`rounded-xl shadow-sm border p-5 flex flex-col sm:flex-row gap-5 items-start relative overflow-hidden hover:shadow-md transition-all ${
                isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
              }`}
            >
              
              {/* Image box if uploaded */}
              {request.image && (
                <div className={`w-full sm:w-28 h-36 rounded-lg overflow-hidden flex-shrink-0 border ${
                  isDark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-100"
                }`}>
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
                  <h3 className={`text-base font-bold font-serif ${isDark ? "text-slate-200" : "text-gray-800"}`}>
                    {request.designName}
                  </h3>
                  
                  {/* Inline Status pill */}
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    request.status === 'pending' && (isDark ? 'bg-amber-950/40 text-amber-400 border border-amber-900/50' : 'bg-amber-50 text-amber-700 border border-amber-200')
                  } ${
                    request.status === 'approved' && (isDark ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50' : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
                  } ${
                    request.status === 'rejected' && (isDark ? 'bg-red-950/40 text-red-400 border border-red-900/50' : 'bg-red-50 text-red-700 border border-red-200')
                  }`}>
                    {request.status}
                  </span>
                </div>

                {/* Sub-label attributes */}
                <div className={`text-xs flex flex-wrap gap-x-4 gap-y-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                  <span>Type: <strong className={`capitalize ${isDark ? "text-slate-200" : "text-gray-700"}`}>{request.requestType}</strong></span>
                  <span>Fabric: <strong className={`capitalize ${isDark ? "text-slate-200" : "text-gray-700"}`}>{request.fabric}</strong></span>
                  <span>Color: <strong className={`capitalize ${isDark ? "text-slate-200" : "text-gray-700"}`}>{request.color}</strong></span>
                </div>

                <p className={`text-xs line-clamp-2 p-2 rounded italic ${
                  isDark ? "bg-slate-800 text-slate-300" : "bg-gray-50 text-gray-600"
                }`}>
                  "{request.description || "No description provided."}"
                </p>

                {/* Summary Row */}
                <div className={`pt-2 border-t flex justify-between items-center text-xs ${
                  isDark ? "border-slate-800 text-slate-400" : "border-gray-100 text-gray-500"
                }`}>
                  <div>Qty: <span className={`font-bold ${isDark ? "text-slate-200" : "text-gray-800"}`}>{request.quantity}</span></div>
                  <div>Budget: <span className={`font-bold ${isDark ? "text-rose-400" : "text-rose-900"}`}>₹{request.budget}</span></div>
                  <div className="text-[11px]">Date: <span className={`font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}>{request.requiredByDate}</span></div>
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