import { updateUser } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { setIsEditing } from "../store/store";
import type { RootState, AppDispatch } from "~/store/store";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import Account from "~/components/account";

export default function UserPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.data);
  const edit = useSelector((state: RootState) => state.user.isEditing);
  const status = useSelector((state: RootState) => state.user.status);
  const isLoggedIn = useSelector(
    (state: RootState) => state.user.isUserLoggedIn
  );

  useEffect(() => {
    if (status === "success" && !isLoggedIn) {
      navigate("/");
    }
  }, [status, isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!edit) {
      dispatch(setIsEditing(true));
      return;
    }

    const formData = new FormData(
      document.querySelector("form") as HTMLFormElement
    );

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    dispatch(updateUser({ firstName, lastName }));
  };

  if (status === "loading") {
    return <div> Loading ... </div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <main className="main bg-dark">
        <div className="header">
          {/* Edit form */}
          {/* // */}
          <form
            onReset={() => {
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

        <Account title={"Argent Bank Checking (x8349)"} amount={"$2,082.79"} />
        <Account title={"Argent Bank Savings (x6712)"} amount={"$10,928.42"} />
        <Account title={"Argent Bank Credit Card (x8349)"} amount={"$184.30"} />
      </main>
    </>
  );
}
