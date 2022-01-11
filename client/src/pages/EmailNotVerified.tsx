import axios from "axios";
import React, { useCallback } from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/features/authSlice";
import { addToast } from "../redux/features/toastSlice";
import { ERROR, SUCCESS } from "../types/constants";

const EmailNotVerified = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const resendEmail = useCallback(() => {
    axios
      .post(`/email/resend-verify`)
      .then((response) => {
        const { message } = response.data;

        dispatch(addToast({ kind: SUCCESS, msg: message }));
      })
      .catch((error) => {
        if (error.response) {
          const response = error.response;
          const { message } = response.data;

          switch (response.status) {
            case 401:
              queryClient.removeQueries();
              dispatch(logoutUser());
              break;
            case 500:
              dispatch(addToast({ kind: ERROR, msg: message }));
              break;
            default:
              dispatch(
                addToast({ kind: ERROR, msg: "Oops, something went wrong" })
              );
              break;
          }
        } else if (error.request) {
          dispatch(
            addToast({ kind: ERROR, msg: "Oops, something went wrong" })
          );
        } else {
          dispatch(addToast({ kind: ERROR, msg: `Error: ${error.message}` }));
        }
      });
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div
        className="card bg-white shadow px-8 py-4 flex flex-col text-left"
        style={{
          maxWidth: "480px",
        }}
      >
        <h3 className="text-2xl font-bold mb-4 text-center">
          Verify your Email
        </h3>
        <p className="mb-4">
          To use Workflow, click the verification link your email. This helps
          keep your account secure.
        </p>
        <p className="mb-4">
          No email in your inbox or spam folder?{" "}
          <button className="text-primary" onClick={resendEmail}>
            Let’s resend it.
          </button>
        </p>
        <p className="mb-4">
          Wrong address?{" "}
          <button
            className="text-primary"
            onClick={() => {
              queryClient.removeQueries();
              dispatch(logoutUser());
            }}
          >
            Log out
          </button>{" "}
          to sign in with a different email. If you mistyped your email when
          signing up, create a new account.
        </p>
      </div>
    </div>
  );
};

export default EmailNotVerified;
