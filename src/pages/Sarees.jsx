import { useAuth } from "../context/AuthContext";
import { useFavourites } from "../context/FavouriteContext";
import { useSaree } from "../context/SareeContext";

function Sarees() {
  const { addFavourites } = useFavourites();
  const { sarees, deleteSaree } = useSaree();

  const { role } = useAuth();
  if (sarees.length === 0) {
    return <h2>No Sarees Available</h2>;
  }
  return (
    <div>
      {sarees.map((saree) => (
        <div key={saree.id}>
          <h3>{saree.name}</h3>
          <p>{saree.fabric}</p>
          <p>{saree.price}</p>
          <p>
            {saree.stock} {saree.stock < 5 && "Low Stock"}
          </p>
          <p>{saree.color}</p>
          <p>{saree.description}</p>
          <img src={saree.image} alt={saree.name} width="200" />
          {role === "admin" && (
            <button onClick={() => deleteSaree(saree.id)}>Delete</button>
          )}
          {role === "customer" && (
            <button onClick={() => addFavourites(saree)}>
              ❤️ favourites
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Sarees;
