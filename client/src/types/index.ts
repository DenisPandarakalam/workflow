import {
  CREATE_PROJECT_MODAL,
  DEFAULT,
  ERROR,
  INFO,
  SUCCESS,
  WARNING,
} from "./constants";

export interface UserObj {
  _id: string;
  username: string;
  profile: string;
  email: string;
  emailVerified: boolean;
  isOAuth: boolean;
}

export interface ProjectObj {
  _id: string;
  name: string;
  icon: string | null;
  boards: BoardObj[];
}

export interface BoardObj {
  _id: string;
  name: string;
  color: string;
  img?: string;
}

export interface ToastObj {
  kind:
    | typeof ERROR
    | typeof SUCCESS
    | typeof INFO
    | typeof WARNING
    | typeof DEFAULT;
  msg: string;
}

export interface ModalObj {
  modalType: typeof CREATE_PROJECT_MODAL | null;
  modalProps?: any;
  modalTitle?: string;
  showCloseBtn?: boolean;
  bgColor?: string;
  textColor?: string;
}
