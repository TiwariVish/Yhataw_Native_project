import {LoginFields} from "../../Models/Interface"

export const loginForm = () => {
    return {
      email: {
        value: "",
        error: "",
      },
      password: {
        value: "",
        error: "",
      },
    } as LoginFields;
  };