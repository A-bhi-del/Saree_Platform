import { useFavourites } from "../context/FavouriteContext";

function FavouritePage() {
  const { favourites, removeFavourites } = useFavourites();

  if (favourites.length === 0) {
    return <h1>No Favourites yet</h1>;
  }

  return (
    <div>
      {favourites.map((favourite) => (
        <div key={favourite.id}>
          <h3>{favourite.name}</h3>
          <p>{favourite.fabric}</p>
          <p>{favourite.price}</p>
          <p>
            {favourite.stock} {favourite.stock < 5 && "Low Stock"}
          </p>
          <p>{favourite.color}</p>
          <p>{favourite.description}</p>
          {favourite.image && (
            <img src={favourite.image} alt={favourite.name} width="200" />
          )}
          <button onClick={() => removeFavourites(favourite.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

export default FavouritePage;
