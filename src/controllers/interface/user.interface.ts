export interface User {
  username: string;
  password: string;
  fullName: string;
  address: string;
  phone: string;
  accountType?: "ADMIN" | "USER" | "SYSTEM";
}
