import { useRequest } from "../context/RequestContext";

function Requests() {
  const { requests, approveRequest, rejectRequest } = useRequest();

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 font-serif">
        <div className="text-4xl mb-2">📋</div>
        <h2 className="text-xl font-semibold text-gray-700">No Customer Requests Available</h2>
        <p className="text-sm text-gray-400 mt-1">Whenever a customer requests a design, it will show up here.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 md:px-12 py-10">
      
      {/* Title Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-serif uppercase tracking-wide">
            Customer Requests Panel
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage and respond to custom fabric designs and restock submissions.</p>
        </div>
        <div className="mt-3 md:mt-0 bg-rose-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
          Total Requests: {requests.length}
        </div>
      </div>

      {/* Requests Grid Container */}
      <div className="grid grid-cols-1 gap-6">
        {requests.map((request) => (
          <div 
            key={request.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 flex flex-col md:flex-row gap-6 items-start justify-between hover:shadow-md transition-shadow"
          >
            
            {/* Left: Product Image Reference */}
            <div className="w-full md:w-44 h-56 md:h-44 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
              {request.image ? (
                <img 
                  src={request.image} 
                  alt={request.designName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-3 bg-gray-50 text-gray-400 text-xs">
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
                    ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {request.requestType === 'custom' ? '✨ Custom Design' : '🔄 Restock Request'}
                </span>
                
                <h3 className="text-lg font-bold text-gray-800 font-serif">{request.designName}</h3>

                {/* Status Badges */}
                <span className={`ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                  request.status === 'pending' && 'bg-amber-100 text-amber-800'
                } ${
                  request.status === 'approved' && 'bg-emerald-100 text-emerald-800'
                } ${
                  request.status === 'rejected' && 'bg-red-100 text-red-800'
                }`}>
                  • {request.status}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-3.5 rounded-lg border border-gray-100 text-sm">
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Fabric</span>
                  <span className="font-medium text-gray-700 capitalize">{request.fabric}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Color Tone</span>
                  <span className="font-medium text-gray-700 capitalize">{request.color}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Quantity</span>
                  <span className="font-bold text-gray-800">{request.quantity} Pcs</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Max Budget</span>
                  <span className="font-bold text-rose-900">₹{request.budget}</span>
                </div>
              </div>

              {/* Description & Deadline */}
              <div className="space-y-1.5">
                <p className="text-xs text-gray-500 italic bg-gray-50/50 p-2.5 rounded border border-dotted border-gray-200">
                  <span className="font-semibold not-italic text-gray-600 block mb-0.5">Notes:</span> 
                  "{request.description || "No specific instructions added by the user."}"
                </p>
                <div className="text-xs text-gray-500 flex items-center gap-1 pt-1">
                  <span>📅 Required Before:</span>
                  <span className="font-semibold text-gray-700">{request.requiredByDate}</span>
                </div>
              </div>

            </div>

            {/* Right: Dynamic Action Controls */}
            <div className="w-full md:w-auto flex flex-row md:flex-col gap-3 justify-end md:justify-center self-stretch pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6">
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
                    className="w-full md:w-28 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs uppercase tracking-wider py-2.5 px-4 rounded-md transition-colors cursor-pointer text-center"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <div className="text-xs font-medium text-gray-400 text-center italic py-2 px-4 bg-gray-100 rounded md:w-28">
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