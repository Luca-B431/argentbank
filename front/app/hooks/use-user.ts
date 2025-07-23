import { useState, useEffect } from "react";
import cookieStore from "../utils/cookies";
import type { User } from "~/utils/user";

function useUser() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<
    "loading" | true | false
  >("loading");
  const [user, setUser] = useState<{
    data: User | null;
    status: "loading" | "success" | "error";
  }>({ data: null, status: "loading" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userToken = await cookieStore.get("userToken");
        setIsUserLoggedIn(Boolean(userToken?.value));

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

  async function logout() {
    await cookieStore.delete("userToken");
    setIsUserLoggedIn(false);
    setUser({ data: null, status: "success" });
  }

  return {
    user: user.data,
    isUserLoggedIn,
    status: user.status,
    logout,
  };
}

export default useUser;
