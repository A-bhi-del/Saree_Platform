import { createContext, useContext, useEffect, useState } from "react";

const RequestContext = createContext();

function RequestProvider({ children }) {
  const [requests, setRequests] = useState(
    JSON.parse(localStorage.getItem("requests")) || [],
  );

  useEffect(() => {
    localStorage.setItem("requests", JSON.stringify(requests));
  }, [requests]);

  function addRequest(newRequest){
    setRequests((prev) => [...prev, newRequest]);
  }

  function approveRequest(ID){
    setRequests((prev) => prev.map((request) => request.id === ID ? {...request, status: "approved"} : request));
  }

  function rejectRequest(ID){
    setRequests((prev) => prev.map((request) => request.id === ID ? {...request, status: "rejected"} : request));
  }

  return (
    <RequestContext.Provider
      value={{ requests, addRequest, approveRequest, rejectRequest}}
    >
      {children}
    </RequestContext.Provider>
  );
}

function useRequest() {
  return useContext(RequestContext);
}

export { RequestProvider, useRequest };
