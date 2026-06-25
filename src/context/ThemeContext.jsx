import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

function ThemeProvider({children}){
    const [theme, setTheme] = useState(JSON.parse(localStorage.getItem("theme")) || "light");

    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(theme));
    }, [theme]);

    function toggleTheme(){
        setTheme((prev) => prev === "light" ? "dark" : "light");
    }

    return(
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

function useTheme(){
    return useContext(ThemeContext);
}

export {ThemeProvider, useTheme};