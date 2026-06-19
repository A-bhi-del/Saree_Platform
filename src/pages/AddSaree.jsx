import { useState } from "react";
import { useSaree } from "../context/SareeContext";
import { useNavigate } from "react-router-dom";

function AddSaree() {
  const { addSaree } = useSaree();
  const [name, setName] = useState("");
  const [fabric, setFabric] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !fabric || !price || !stock || !color) {
      return;
    }

    addSaree({
      id: Date.now(),
      name,
      fabric,
      price: Number(price),
      stock: Number(stock),
      color,
      description,
      image,
    });
    setName("");
    setFabric("");
    setPrice("");
    setStock("");
    setColor("");
    setDescription("");
    setImage("");

    navigate("/sarees");
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          type="text"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <input
          value={fabric}
          type="text"
          onChange={(e) => setFabric(e.target.value)}
          placeholder="Enter your fabric"
        />
        <input
          value={price}
          type="number"
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter your price"
        />
        <input
          value={stock}
          type="number"
          onChange={(e) => setStock(e.target.value)}
          placeholder="Enter your stock"
        />
        <input
          value={color}
          type="text"
          onChange={(e) => setColor(e.target.value)}
          placeholder="Enter your color"
        />
        <textarea
          value={description}
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter your description"
        />
        <input
          value={image}
          type="text"
          onChange={(e) => setImage(e.target.value)}
          placeholder="Enter your image"
        />
        <button type="submit">Add</button>
      </form>
    </>
  );
}

export default AddSaree;
