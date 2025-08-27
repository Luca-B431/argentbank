import type { Route } from "./+types/sign-in";
import { store } from "../store/store";
import { setIsUserLoggedIn } from "../store/store";
import { useNavigate } from "react-router";
import cookieStore from "../utils/cookies";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "New React Router App" },
//     { name: "description", content: "Welcome to React Router!" },
//   ];
// }

export default function SignIn() {
  const navigate = useNavigate();

  const isUserLoggedIn = (value: boolean) => {
    store.dispatch(setIsUserLoggedIn(value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    const email = values.email;
    const password = values.password;

    try {
      // POST API user/login
      const response = await fetch("http://localhost:3001/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // On redirige vers la page user si le login est réussi
      if (response.ok) {
        navigate("/user");
        isUserLoggedIn(true);
      }

      // Si le login échoue, on affiche une erreur en console
      if (!response.ok) {
        throw new Error("Login échoué");
      }

      const data = await response.json();

      //On stocke le token dans un cookie
      await cookieStore.set("userToken", data.body.token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <main className="main bg-dark">
        <section className="sign-in-content">
          <i className="fa fa-user-circle sign-in-icon"></i>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="email"
                defaultValue="tony@stark.com"
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                defaultValue="password123"
              />
            </div>
            <div className="input-remember">
              <input type="checkbox" id="remember-me" name="remember" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <button type="submit" className="sign-in-button">
              Sign In
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
