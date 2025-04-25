export interface signupError {
  data: {
    msg: string;
    path: string;
  }[];
}

export interface loginError {
  name: string;
  message: string;
}
