export interface MataDataTeamData {
  // Department: JSX.Element;
  // Designation: string;
  // Action: JSX.Element;
  phone: string;
  email: string;
  city: string;
  gender: string;
  name: string;
  address: string;
}

export interface locationType {
  hash?: string | undefined;
  key?: string | undefined;
  pathname?: string | undefined;
  search?: string | undefined;
  state?: any;
}

export interface AuthMap {
  [key: string]: string[];
}

export interface ForgotPasswordFields {
  [key: string]: {
    value: string;
    error: any;
  };
}

export interface LoginFields {
  [key: string]: {
    value: string;
    error: any;
  };
}

export interface RegistrationFeild {
  [key: string]: {
    value: string;
    error: string;
  };
}

// TEAMS

export interface PersonalDetailsInterface {
  name: String;
  password: String;
  phone: String;
  email: String;
  whatsapp: String;
  dob: String;
  martial_status: String;
  gender: String;
  address: String;
  country_id: Number;
  state_id: Number;
  city: String;
  zipcode: String;
}
