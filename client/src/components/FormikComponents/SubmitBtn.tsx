import { useFormikContext } from "formik";
import React from "react";
import Loader from "../Loader/Loader";

interface Props {
  text: string;
  isSubmitting: boolean;
  classes?: string;
}

const SubmitBtn = ({ text, isSubmitting, classes }: Props) => {
  const { isValid, dirty } = useFormikContext();

  return isSubmitting === true ? (
    <button
      className="btn-primary mb-4 w-full disabled:opacity-100 cursor-default flex items-center justify-center"
      disabled
    >
      <Loader size={20} />
    </button>
  ) : (
    <button
      type="submit"
      className={`btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed ${classes}`}
      disabled={!isValid || !dirty}
    >
      {text}
    </button>
  );
};

export default SubmitBtn;
