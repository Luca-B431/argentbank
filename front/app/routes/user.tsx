import cookieStore from "../utils/cookies";
import { store } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setIsEditing } from "../store/store";
import type { User } from "~/utils/user";
import type { RootState, AppDispatch } from "~/store/store";

export default function UserPage() {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.user.data);
  const edit = useSelector((state: RootState) => state.user.isEditing);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!edit) {
      dispatch(setIsEditing(true));
      return;
    }

    const formData = new FormData(
      document.querySelector("form") as HTMLFormElement
    );

    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");

    const userToken = await cookieStore.get("userToken");

    const response = await fetch("http://localhost:3001/api/v1/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken?.value}`,
      },
      body: JSON.stringify({ firstName, lastName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as {
      status: 200;
      message: "Successfully got user profile data";
      body: User;
    };
    const userData = data.body;
    dispatch(setUser(userData));
    dispatch(setIsEditing(false));
  };

  return (
    <>
      <main className="main bg-dark">
        <div className="header">
          {/* Edit form */}
          {/* // */}
          <form
            onReset={() => {
              dispatch(setUser(user));
              dispatch(setIsEditing(false));
            }}
            onSubmit={handleSubmit}
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
              className="edit-button font-bol cursor-pointer ml-4"
              type="submit"
            >
              Edit Name
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
