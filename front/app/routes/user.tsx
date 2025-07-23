import { useEffect, useState } from "react";
import cookieStore from "../utils/cookies";
import type { User } from "~/utils/user";
import Header from "~/components/header";
import Footer from "~/components/footer";

export default function UserPage() {
  // 2. Typage explicite
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [displaySaveButton, setDisplaySaveButton] = useState(false);

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
        setUserData(data.body);
        console.log("User data fetched successfully:", data.body);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <main className="main bg-dark">
        <div className="header pt-100 text-4xl font-bold">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main bg-dark">
        <div className="header mt-100 mx-24 py-8 text-4xl bg-red-500 font-bold">
          <p>Error: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Header />

      <main className="main bg-dark">
        <div className="header">
          <h1 className="text-2xl font-bold py-4">
            Welcome back{" "}
            {edit ? (
              <input
                type="text"
                onChange={() => {
                  setDisplaySaveButton(true);
                }}
                onMouseLeave={() => {
                  setDisplaySaveButton(false);
                }}
                className="bg-white w-48 text-black"
              />
            ) : (
              userData?.firstName
            )}{" "}
            {edit ? (
              <input
                type="text"
                name="firstNameEdit"
                onChange={() => {
                  setDisplaySaveButton(true);
                }}
                className="bg-white w-48 text-black"
              />
            ) : (
              userData?.lastName
            )}
          </h1>
          <button
            className="edit-button font-bol cursor-pointer"
            onClick={(e) => (edit ? setEdit(false) : setEdit(true))}
          >
            Edit Name
          </button>

          {/* ternaire d'affichage du save sur saisi d'input */}
          {displaySaveButton ? (
            <button className="save-button font-bol cursor-pointer ml-4">
              Save
            </button>
          ) : null}
        </div>
        <h2 className="sr-only">Accounts</h2>

        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Checking (x8349)</h3>
            <p className="account-amount">$2,082.79</p>
            <p className="account-amount-description">Available Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <button className="transaction-button">View transactions</button>
          </div>
        </section>

        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Savings (x6712)</h3>
            <p className="account-amount">$10,928.42</p>
            <p className="account-amount-description">Available Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <button className="transaction-button">View transactions</button>
          </div>
        </section>

        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
            <p className="account-amount">$184.30</p>
            <p className="account-amount-description">Current Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <button className="transaction-button">View transactions</button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
