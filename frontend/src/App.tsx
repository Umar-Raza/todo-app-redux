import { RouterProvider } from "react-router-dom";
import "./App.css";
import appRouter from "./routes";
import Loader from "./components/Loader";
import { useAppSlector } from "./store/hooks";
import { selectApiCallInProgress } from "./store/contactsSlice";

function App() {
  const isLoading = useAppSlector(selectApiCallInProgress);

  return (
    <>
      {isLoading && (
        <div className="z-20 bg-black/75 fixed w-screen h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}
      <RouterProvider router={appRouter} />;
    </>
  );
}

export default App;
