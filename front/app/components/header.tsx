import { NavLink, href, useMatch } from "react-router";
import useUser from "~/hooks/use-user";

export default function Header() {
  const { isUserLoggedIn, user, logout } = useUser();

  //   On check si on est sur la route Sign-in
  const isRouteSignIn = useMatch(href("/sign-in"));

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
          {isUserLoggedIn === true && user && (
            <>
              <NavLink to={href("/user")} className="main-nav-item">
                <i className="fa fa-user-circle"></i>
                {user?.firstName} {user?.lastName}
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
