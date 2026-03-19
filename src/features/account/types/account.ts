export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  id: string;
  email: string;
  role: string;
  accessToken: string;
};
