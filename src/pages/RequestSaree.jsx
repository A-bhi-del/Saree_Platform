import { useState } from "react";
import { useRequest } from "../context/RequestContext";

function RequestSaree() {
  const { addRequest } = useRequest();

  const [requestType, setRequestType] = useState("");
  const [requiredByDate, setRequiredByDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [designName, setDesignName] = useState("");
  const [fabric, setFabric] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [image, setImage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !requestType ||
      !designName ||
      !fabric ||
      !quantity ||
      !color ||
      !budget ||
      !requiredByDate
    ) {
      alert("Please fill all required fields");
      return;
    }

    addRequest({
      id: Date.now(),
      requestType,
      designName,
      fabric,
      color,
      description,
      quantity: Number(quantity),
      budget: Number(budget),
      image,
      requiredByDate,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    setRequestType("");
    setRequiredByDate("");
    setQuantity("");
    setDesignName("");
    setFabric("");
    setColor("");
    setDescription("");
    setBudget("");
    setImage("");
  }

  return (
    <div className="request-container">
      <h2>Request a Saree</h2>

      <form onSubmit={handleSubmit}>
        <select
          value={requestType}
          onChange={(e) => setRequestType(e.target.value)}
        >
          <option value="">Select Request Type</option>
          <option value="custom">Custom Design</option>
          <option value="restock">Restock Request</option>
        </select>

        <input
          type="text"
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
          placeholder="Design Name"
        />

        <input
          type="date"
          value={requiredByDate}
          onChange={(e) => setRequiredByDate(e.target.value)}
        />

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
        />

        <input
          type="text"
          value={fabric}
          onChange={(e) => setFabric(e.target.value)}
          placeholder="Fabric"
        />

        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Color"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the saree design"
        />

        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Maximum Budget"
        />

        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Reference Image URL"
        />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}

export default RequestSaree;