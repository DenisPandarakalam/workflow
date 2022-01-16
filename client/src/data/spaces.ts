import { SpaceObj } from "../types";
import { ADMIN, NORMAL, VIEWER } from "../types/constants";

const spaces: SpaceObj[] = [
  {
    _id: "1",
    name: "Google New dadfsa",
    isGuestSpace: true,
    icon: "https://images.unsplash.com/photo-1541411438265-4cb4687110f2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    boards: [
      {
        _id: "1",
        name: "Board 1",
        color: "#00C2E2",
        role: ADMIN,
        spaceId: "1",
        img: "https://images.unsplash.com/photo-1640661060277-7c6d52cbf823?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      },
      {
        _id: "2",
        name: "Board 2",
        role: NORMAL,
        color: "#5DBF48",
        spaceId: "1",
      },
      {
        _id: "3",
        role: VIEWER,
        name: "Board 2",
        color: "#5DBF48",
        spaceId: "1",
      },
      {
        _id: "4",
        role: VIEWER,
        name: "Board 2",
        color: "#5DBF48",
        spaceId: "1",
      },
      {
        _id: "5",
        role: ADMIN,
        name: "Board 2",
        color: "#5DBF48",
        spaceId: "1",
      },
    ],
  },
  {
    _id: "3",
    isGuestSpace: false,
    name: "Newman",
    icon: null,
    boards: [],
  },
  {
    _id: "4",
    isGuestSpace: false,
    name: "Newman",
    icon: null,
    boards: [],
  },
  {
    _id: "5",
    isGuestSpace: false,
    name: "Newman",
    icon: null,
    boards: [],
  },
  {
    _id: "6",
    isGuestSpace: false,
    name: "Newman",
    icon: null,
    boards: [],
  },
  {
    _id: "7",
    isGuestSpace: false,
    name: "Newman",
    icon: null,
    boards: [],
  },
  {
    _id: "8",
    isGuestSpace: false,
    name: "Newman",
    icon: null,
    boards: [],
  },
  {
    _id: "9",
    isGuestSpace: false,
    name: "Newman",
    icon: null,
    boards: [],
  },
  {
    _id: "10",
    isGuestSpace: false,
    name: "Newman",
    icon: null,
    boards: [],
  },
];

export default spaces;
