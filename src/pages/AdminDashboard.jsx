import { Link } from "react-router-dom";
import { useSaree } from "../context/SareeContext";

function AdminDashboard() {
    const {sarees} = useSaree();
    const TotalStock = sarees.reduce((total, saree) => total + saree.stock, 0);

    const LowStock = sarees.filter((saree) => saree.stock < 5).length;

    if(sarees.length === 0) {
        return <h2>No Sarees Added yet</h2>
    }
  return (
    <div>
      <p>Total Sarees: {sarees.length}</p>
      <p>Total Stock: {TotalStock}</p>
      <p>Low Stock: {LowStock}</p>
    </div>
  );
}

export default AdminDashboard;
