import { useState } from "react";
import useUser from "~/hooks/use-user";
import cookieStore from "../utils/cookies";
import type { User } from "~/utils/user";

export default function UserPage() {
  const { status, user, setUser } = useUser();

  const [edit, setEdit] = useState(false);

  if (status === "loading") {
    return (
      <main className="main bg-dark">
        <div className="header pt-100 text-4xl font-bold">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="main bg-dark">
        <div className="header mt-100 mx-24 py-8 text-4xl bg-red-500 font-bold">
          <p>Error</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="main bg-dark">
        <div className="header">
          {/* Edit form */}
          {/* // */}
          <form
            onReset={() => {
              setEdit(false);
            }}
            onSubmit={async (e) => {
              e.preventDefault();

              if (!edit) {
                setEdit(true);

                return;
              }
              const formData = new FormData(e.target as HTMLFormElement);

              const firstName = formData.get("firstName");
              const lastName = formData.get("lastName");

              const userToken = await cookieStore.get("userToken");

              const response = await fetch(
                "http://localhost:3001/api/v1/user/profile",
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken?.value}`,
                  },
                  body: JSON.stringify({ firstName, lastName }),
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
              console.log("User data updated successfully:", data.body);
              console.log(user?.firstName, user?.lastName);
              setEdit(false);
            }}
          >
            <h1 className="text-2xl font-bold py-4">
              Welcome back{" "}
              {!edit ? (
                user?.firstName
              ) : (
                <input
                  type="text"
                  name="firstName"
                  defaultValue={user?.firstName}
                  className="bg-white w-48 text-black"
                />
              )}{" "}
              {!edit ? (
                user?.lastName
              ) : (
                <input
                  type="text"
                  name="lastName"
                  defaultValue={user?.lastName}
                  className="bg-white w-48 text-black"
                />
              )}
            </h1>
            {edit && (
              <button
                type="reset"
                className="edit-button font-bol cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="edit-button font-bol cursor-pointer ml-4"
            >
              {edit ? "Submit" : "Edit Name"}
            </button>
          </form>
          {/* // */}
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
    </>
  );
}
