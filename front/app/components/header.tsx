import { NavLink, href, useMatch } from "react-router";
import type { RootState } from "~/store/store";
import { store } from "~/store/store";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setIsUserLoggedIn } from "~/store/store";
import cookieStore from "~/utils/cookies";

export default function Header() {
  const duspatch = useDispatch();

  //   On check si on est sur la route Sign-in
  const isRouteSignIn = useMatch(href("/sign-in"));

  const isUserLoggedIn = useSelector(
    (state: RootState) => state.user.isUserLoggedIn
  );
  const user = useSelector((state: RootState) => state.user.data);

  function logout() {
    cookieStore.delete("userToken");
    store.dispatch(setIsUserLoggedIn(false));
    store.dispatch(
      setUser({
        firstName: "Tony",
        lastName: "Stark",
        email: "tony@stark.com",
        id: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  }

  //   Affichage conditionnel du lien Sign-In
  const displaySignin = isUserLoggedIn === false && !isRouteSignIn;

  return (
    <>
      <nav className="main-nav">
        <NavLink to={href("/")} className="main-nav-logo">
          <img
            className="main-nav-logo-image"
            src="/img/argentBankLogo.png"
            alt="Argent Bank Logo"
          />
          <h1 className="sr-only">Argent Bank</h1>
        </NavLink>
        <div>
          {displaySignin && (
            <NavLink to={href("/sign-in")} className="main-nav-item">
              <i className="fa fa-user-circle"></i>
              Sign In
            </NavLink>
          )}
          {isUserLoggedIn && user && (
            <>
              <NavLink to={href("/user")} className="main-nav-item">
                <i className="fa fa-user-circle"></i>
                {user.firstName} {user.lastName}
              </NavLink>
              <NavLink
                className="main-nav-item"
                to={href("/")}
                onClick={logout}
              >
                <i className="fa fa-sign-out"></i>
                Sign Out
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
