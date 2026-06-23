import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FavouriteContext = createContext();

function FavouriteProvider({children}){
    const [favourites, setFavourites] = useState(JSON.parse(localStorage.getItem("favourites")) || []);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("favourites", JSON.stringify(favourites));
    }, [favourites]);

    function addFavourites(saree){
        const exist = favourites.find((item) => item.id === saree.id);
        if(exist) return;
        setFavourites([...favourites, saree]);
        navigate("/favourites-page");
    }

    function removeFavourites(id){
        setFavourites((favourite) => favourite.filter((item) => item.id !== id));
    }

    return(
        <FavouriteContext.Provider value={{favourites, addFavourites, removeFavourites}}>
            {children}
        </FavouriteContext.Provider>
    )
};

function useFavourites(){
    return useContext(FavouriteContext);
}

export {FavouriteProvider, useFavourites};