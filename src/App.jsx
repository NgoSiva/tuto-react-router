import {
  createBrowserRouter,
  defer,
  NavLink,
  Outlet,
  RouterProvider,
  useNavigation,
  useRouteError,
} from "react-router-dom";
import { Single } from "./pages/Single.jsx";
import { Blog } from "./pages/Blog.jsx";
import { Spinner } from "./components/Spinner.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <PageError />,
    children: [
      {
        path: "blog",
        element: (
          <div className="row">
            <aside className="col-3">
              <h2>Sidebar</h2>
            </aside>
            <main className="col-9">
              <Outlet />
            </main>
          </div>
        ),
        children: [
          {
            path: "",
            element: <Blog />,
            loader: () => {
              const posts = fetch(
                "https://jsonplaceholder.typicode.com/posts?_limit=10",
              ).then((r) => r.json());
              return defer({
                posts,
              });
            },
          },
          {
            path: ":id",
            element: <Single />,
          },
        ],
      },
      {
        path: "contact",
        element: <div>Contact</div>,
      },
    ],
  },
]);

function PageError() {
  const error = useRouteError();
  return (
    <>
      <h1>Une erreur est survervenue</h1>
      <p>{error?.error?.toString() ?? error?.toString()}</p>
    </>
  );
}

function Root() {
  const { state } = useNavigation();
  return (
    <>
      <header>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>
      <div className="container my-4">
        {state === "loading" && <Spinner />}
        <Outlet />
      </div>
    </>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
