import { createContext, useContext, useEffect, useState } from "react";
import { useNotification } from "./NotificationContext";

const RequestContext = createContext();

function RequestProvider({ children }) {
  const { addNotification } = useNotification();

  const [requests, setRequests] = useState(
    JSON.parse(localStorage.getItem("requests")) || [],
  );

  useEffect(() => {
    localStorage.setItem("requests", JSON.stringify(requests));
  }, [requests]);

  function addRequest(newRequest) {
    setRequests((prev) => [...prev, newRequest]);

    addNotification({
      id: Date.now(),

      type: "request",

      data: {
        id: newRequest.id,
        designName: newRequest.designName,
        budget: newRequest.budget,
      },

      senderRole: "customer",
      receiverRole: "admin",

      title: "New Request",
      message: `${newRequest.designName} request submitted`,

      route: "/request",

      read: false,

      createdAt: new Date().toISOString(),
    });
  }

  function approveRequest(ID) {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === ID ? { ...request, status: "approved" } : request,
      ),
    );

    const request = requests.find((request) => request.id === ID);
    if (!request) return;
    addNotification({
      id: Date.now(),

      type: "request-approved",

      data: {
        id: request.id,
        designName: request.designName,
        budget: request.budget,
        status: "approved",
      },

      route: "/customer",

      senderRole: "admin",
      receiverRole: "customer",

      title: "Request Approved",

      message: `${request.designName} request approved`,

      read: false,

      createdAt: new Date().toISOString(),
    });
  }

  function rejectRequest(ID) {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === ID ? { ...request, status: "rejected" } : request,
      ),
    );

    const request = requests.find((request) => request.id === ID);

    if (!request) return;

    addNotification({
      id: Date.now(),

      type: "request-rejected",

      data: {
        id: request.id,
        designName: request.designName,
        budget: request.budget,
        status: "rejected",
      },

      route: "/customer",

      senderRole: "admin",
      receiverRole: "customer",

      title: "Request Rejected",

      message: `${request.designName} request rejected`,

      read: false,

      createdAt: new Date().toISOString(),
    });
  }

  return (
    <RequestContext.Provider
      value={{ requests, addRequest, approveRequest, rejectRequest }}
    >
      {children}
    </RequestContext.Provider>
  );
}

function useRequest() {
  return useContext(RequestContext);
}

export { RequestProvider, useRequest };
