export type RegisterDto = {
  username: string;
  email: string;
  password: string;
}

export type LoginDto = {
  email: string;
  password: string;
}

export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export type ApiError = {
  message: string;
  statusCode: number;
  error?: string;
}