import { Form, Formik } from "formik";
import React, { useCallback, useState } from "react";
import { HiOutlineUserAdd, HiUserAdd } from "react-icons/hi";
import { Option } from "../../types";
import { BOARD_ROLES } from "../../types/constants";
import * as Yup from "yup";
import debounce from "debounce-promise";
import SubmitBtn from "../FormikComponents/SubmitBtn";
import SelectDropDownAsync from "../FormikComponents/SelectDropDownAsync";
import CustomOption from "../CustomOption/CustomOption";
import axiosInstance from "../../axiosInstance";
import useClose from "../../hooks/useClose";
import Select from "../FormikComponents/Select";
import { MdClose } from "react-icons/md";

interface UserObj {
  _id: string;
  username: string;
  profile: string;
  isMember: string;
}

interface MembersObj {
  members: any[];
  role: typeof BOARD_ROLES.NORMAL | typeof BOARD_ROLES.OBSERVER;
}

interface Props {
  boardId: string;
}

const InviteBtn = ({ boardId }: Props) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const ref = useClose(() => setShowDropdown(false));

  const roleOptions: Option[] = [
    {
      value: BOARD_ROLES.NORMAL,
      label: BOARD_ROLES.NORMAL,
    },
    {
      value: BOARD_ROLES.OBSERVER,
      label: BOARD_ROLES.OBSERVER,
    },
  ];

  const initialValues: MembersObj = {
    members: [],
    role: "",
  };

  const validationSchema = Yup.object({
    members: Yup.array(
      Yup.object({
        value: Yup.string().required(),
        label: Yup.string().required(),
        profile: Yup.string().required(),
      })
    )
      .min(1, "Provide atleast one member")
      .required("Provide atleast one member"),
    role: Yup.string()
      .oneOf([BOARD_ROLES.NORMAL, BOARD_ROLES.OBSERVER], "Invalid role type")
      .required("Board role is required"),
  });

  const handleSubmit = useCallback(({ members, role }: MembersObj) => {
    const value = {
      members: members.map((m) => m.value),
      role: role,
    };

    console.log(value);
  }, []);

  const searchUsers = async (query: string) => {
    if (query) {
      const response = await axiosInstance.get(
        `/users/search/board?q=${query}&boardId=${boardId}`
      );

      const { data } = response.data;

      return data.map((user: UserObj) => {
        return {
          value: user._id,
          label: user.username,
          profile: user.profile,
          isDisabled: Object.keys(user).includes("isMember")
            ? user.isMember
            : false,
        };
      });
    }
  };

  const delayLoadUsers = useCallback(debounce(searchUsers, 300), []);

  // return a promise which is the remote api call
  const loadUsers = (inputValue: string) => {
    return delayLoadUsers(inputValue);
  };

  return (
    <div className="invite relative" ref={ref}>
      <button
        onClick={() => setShowDropdown((prevValue) => !prevValue)}
        className="bg-blue-500 rounded px-2 py-1.5 text-white flex items-center"
      >
        <HiOutlineUserAdd className="mr-1" size={16} />
        Invite
      </button>

      {showDropdown && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          <Form
            className="pb-3 mr-4 mt-6 absolute bg-white z-20 top-6 left-0 shadow-lg rounded"
            style={{
              width: "350px",
            }}
          >
            <header className="border-b px-4 py-3 mb-4 flex items-center justify-between">
              <h2 className="font-medium">Invite to Board</h2>

              <button
                onClick={() => {
                  setShowDropdown(false);
                }}
                type="button"
                role="close-dropdown-options"
              >
                <MdClose size={16} />
              </button>
            </header>
            <div
              className="flex flex-col justify-between px-4"
              style={{
                minHeight: "14rem",
              }}
            >
              <SelectDropDownAsync
                name="members"
                id="members"
                classes="mb-3"
                label=""
                isMulti={true}
                loadOptions={loadUsers}
                components={{ Option: CustomOption }}
                autoFocus={true}
              />
              <Select
                label="Add as"
                id="role"
                name="role"
                options={roleOptions}
              />

              <div className="buttons w-full flex flex-col text-sm mt-8">
                <SubmitBtn
                  text="Invite"
                  classes="mb-4"
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          </Form>
        </Formik>
      )}
    </div>
  );
};

export default InviteBtn;