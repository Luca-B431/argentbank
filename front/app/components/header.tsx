import { NavLink, href, useMatch } from "react-router";
import cookieStore from "../utils/cookies";
import { useEffect, useState } from "react";
import type { User } from "~/utils/user";

export default function Header() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<
    "loading" | true | false
  >("loading");
  const [user, setUser] = useState<{
    data: User | null;
    status: "loading" | "success" | "error";
  }>({ data: null, status: "loading" });

  //   On check si on est sur la route Sign-in
  const isRouteSignIn = useMatch(href("/sign-in"));

  //   Affichage conditionnel du lien Sign-In
  const displaySignin = isUserLoggedIn === false && !isRouteSignIn;

  useEffect(() => {
    cookieStore
      .get("userToken")
      .then((cookie) => setIsUserLoggedIn(Boolean(cookie?.value)));
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userToken = await cookieStore.get("userToken");
        console.log("User token:", userToken);

        // On lance la requête POST avec le token pour récupérer les données utilisateur
        const response = await fetch(
          "http://localhost:3001/api/v1/user/profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken?.value}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as {
          status: 200;
          message: "Successfully got user profile data";
          body: User;
        };
        setUser({ data: data.body, status: "success" });
        console.log("User data fetched successfully:", data.body);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setUser({ data: null, status: "error" });
      }
    };

    fetchUserData();
  }, []);

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
          {isUserLoggedIn === true && user.data && (
            <>
              <NavLink to={href("/user")} className="main-nav-item">
                <i className="fa fa-user-circle"></i>
                {user?.data?.firstName} {user?.data?.lastName}
              </NavLink>
              <NavLink
                className="main-nav-item"
                to={href("/")}
                onClick={async () => {
                  await cookieStore.delete("userToken");
                  setIsUserLoggedIn(false);
                  setUser({ data: null, status: "success" });
                }}
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
