import { useRequest } from "../context/RequestContext";
import { useTheme } from "../context/ThemeContext";

function Requests() {
  const { requests, approveRequest, rejectRequest } = useRequest();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  // Empty State Layout
  if (requests.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] font-serif transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-slate-400" : "bg-gray-50 text-gray-500"
      }`}>
        <div className="text-4xl mb-2">📋</div>
        <h2 className={`text-xl font-semibold ${isDark ? "text-slate-200" : "text-gray-700"}`}>
          No Customer Requests Available
        </h2>
        <p className={`text-sm mt-1 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
          Whenever a customer requests a design, it will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 md:px-12 py-10 transition-colors duration-300 ${
      isDark ? "bg-slate-950" : "bg-gray-50"
    }`}>
      
      {/* Title Header */}
      <div className={`mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-5 ${
        isDark ? "border-slate-800" : "border-gray-200"
      }`}>
        <div>
          <h1 className={`text-2xl font-bold font-serif uppercase tracking-wide ${
            isDark ? "text-slate-100" : "text-gray-800"
          }`}>
            Customer Requests Panel
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            Manage and respond to custom fabric designs and restock submissions.
          </p>
        </div>
        <div className={`mt-3 md:mt-0 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm ${
          isDark ? "bg-rose-950 border border-rose-900/60 text-rose-300" : "bg-rose-900 text-white"
        }`}>
          Total Requests: {requests.length}
        </div>
      </div>

      {/* Requests Grid Container */}
      <div className="grid grid-cols-1 gap-6">
        {requests.map((request) => (
          <div 
            key={request.id} 
            className={`rounded-xl shadow-sm border p-5 md:p-6 flex flex-col md:flex-row gap-6 items-start justify-between hover:shadow-md transition-all duration-300 ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
            }`}
          >
            
            {/* Left: Product Image Reference */}
            <div className={`w-full md:w-44 h-56 md:h-44 rounded-lg overflow-hidden flex-shrink-0 border ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-gray-100 border-gray-200"
            }`}>
              {request.image ? (
                <img 
                  src={request.image} 
                  alt={request.designName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full flex flex-col items-center justify-center text-center p-3 text-xs ${
                  isDark ? "bg-slate-800 text-slate-500" : "bg-gray-50 text-gray-400"
                }`}>
                  <span>No Reference Image Provided</span>
                </div>
              )}
            </div>

            {/* Middle: Core Request Details */}
            <div className="flex-grow space-y-4 w-full">
              
              {/* Type Badge & Name Row */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                  request.requestType === 'custom' 
                    ? (isDark ? 'bg-purple-950/40 text-purple-400 border border-purple-900/40' : 'bg-purple-50 text-purple-700 border border-purple-200') 
                    : (isDark ? 'bg-blue-950/40 text-blue-400 border border-blue-900/40' : 'bg-blue-50 text-blue-700 border border-blue-200')
                }`}>
                  {request.requestType === 'custom' ? '✨ Custom Design' : '🔄 Restock Request'}
                </span>
                
                <h3 className={`text-lg font-bold font-serif ${isDark ? "text-slate-200" : "text-gray-800"}`}>
                  {request.designName}
                </h3>

                {/* Status Badges */}
                <span className={`ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                  request.status === 'pending' && (isDark ? 'bg-amber-950/50 text-amber-400' : 'bg-amber-100 text-amber-800')
                } ${
                  request.status === 'approved' && (isDark ? 'bg-emerald-950/50 text-emerald-400' : 'bg-emerald-100 text-emerald-800')
                } ${
                  request.status === 'rejected' && (isDark ? 'bg-red-950/50 text-red-400' : 'bg-red-100 text-red-800')
                }`}>
                  • {request.status}
                </span>
              </div>

              {/* Specs Grid */}
              <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-3.5 rounded-lg border text-sm ${
                isDark ? "bg-slate-800/60 border-slate-700/60" : "bg-gray-50 border-gray-100"
              }`}>
                <div>
                  <span className={`block text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-gray-400"}`}>Fabric</span>
                  <span className={`font-medium capitalize ${isDark ? "text-slate-300" : "text-gray-700"}`}>{request.fabric}</span>
                </div>
                <div>
                  <span className={`block text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-gray-400"}`}>Color Tone</span>
                  <span className={`font-medium capitalize ${isDark ? "text-slate-300" : "text-gray-700"}`}>{request.color}</span>
                </div>
                <div>
                  <span className={`block text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-gray-400"}`}>Quantity</span>
                  <span className={`font-bold ${isDark ? "text-slate-200" : "text-gray-800"}`}>{request.quantity} Pcs</span>
                </div>
                <div>
                  <span className={`block text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-gray-400"}`}>Max Budget</span>
                  <span className={`font-bold ${isDark ? "text-rose-400" : "text-rose-900"}`}>₹{request.budget}</span>
                </div>
              </div>

              {/* Description & Deadline */}
              <div className="space-y-1.5">
                <p className={`text-xs italic p-2.5 rounded border border-dotted ${
                  isDark ? "bg-slate-800/30 border-slate-700 text-slate-400" : "bg-gray-50/50 border-gray-200 text-gray-500"
                }`}>
                  <span className={`font-semibold not-italic block mb-0.5 ${isDark ? "text-slate-300" : "text-gray-600"}`}>Notes:</span> 
                  "{request.description || "No specific instructions added by the user."}"
                </p>
                <div className={`text-xs flex items-center gap-1 pt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                  <span>📅 Required Before:</span>
                  <span className={`font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}>{request.requiredByDate}</span>
                </div>
              </div>

            </div>

            {/* Right: Dynamic Action Controls */}
            <div className={`w-full md:w-auto flex flex-row md:flex-col gap-3 justify-end md:justify-center self-stretch pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:pl-6 ${
              isDark ? "border-slate-800" : "border-gray-100"
            }`}>
              {request.status === "pending" ? (
                <>
                  <button 
                    onClick={() => approveRequest(request.id)}
                    className="w-full md:w-28 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider py-2.5 px-4 rounded-md shadow-sm transition-colors cursor-pointer text-center"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => rejectRequest(request.id)}
                    className={`w-full md:w-28 font-semibold text-xs uppercase tracking-wider py-2.5 px-4 rounded-md transition-colors cursor-pointer text-center border ${
                      isDark 
                        ? "bg-transparent border-red-900/60 text-red-400 hover:bg-red-950/40" 
                        : "bg-white border-red-200 text-red-600 hover:bg-red-50"
                    }`}
                  >
                    Reject
                  </button>
                </>
              ) : (
                <div className={`text-xs font-medium text-center italic py-2 px-4 rounded md:w-28 ${
                  isDark ? "bg-slate-800 text-slate-500" : "bg-gray-100 text-gray-400"
                }`}>
                  Action Taken
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Requests;