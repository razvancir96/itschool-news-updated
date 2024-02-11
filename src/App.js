// Importam componentele ce tin de rutare.;
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Importam paginile.
import Page404 from "./pages/Page404";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import NewsCategory from "./pages/NewsCategory";
import NewsDetails from "./pages/NewsDetails";
import { useReducer } from "react";
import { FavoritesContext } from "./store/Favorites/context";
import { initialState, favoritesReducer } from "./store/Favorites/reducer";
// Importam hook-ul useLocalStorage.
import { useLocalStorage } from "./utils/hooks/useLocalStorage";

// Definim rutele, similar cu ce am facut la sedinta 32.
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Page404 />,
  },
  {
    path: "/favorites",
    element: <Favorites />,
  },
  {
    path: "/category/:categoryId",
    element: <NewsCategory />,
  },
  {
    path: "/news/:newsId",
    element: <NewsDetails />,
  },
]);

function App() {
  // Initializam state-ul, pornind de la localStorage.
  // Daca am state in localStorage, il prieau, daca nu pornesc de la initialState.
  const [initialLocalStorageState] = useLocalStorage("favorites", initialState);
  const [favoritesState, favoritesDispatch] = useReducer(
    favoritesReducer,
    initialLocalStorageState
  );
  const favoritesContextValue = {
    favoritesState,
    favoritesDispatch,
  };

  return (
    <div className="App">
      <FavoritesContext.Provider value={favoritesContextValue}>
        {/* Adaugam providerul de rutare, similara cu ce am facut la sedinta 32. */}
        <RouterProvider router={router} />
      </FavoritesContext.Provider>
    </div>
  );
}

export default App;
