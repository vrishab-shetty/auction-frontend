export interface Address {
  street: string;
  city: string;
  country: string;
  zipcode: string;
}

export interface UserDTO {
  id: string;
  name: string;
  description: string;
  username: string;
  contact: string;
  enabled: boolean;
  homeAddress: Address;
}

export interface UserEditableDTO {
  name: string;
  password?: string; // Only for registration
  description: string;
  email: string;
  contact: string;
  zipCode: string;
  street: string;
  city: string;
  country: string;
}

export interface UserUpdateDTO {
  name: string;
  description: string;
  contact: string;
  zipCode: string;
  street: string;
  city: string;
  country: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface BillingDetailsBase {
  id: string;
  owner: string;
  type: 'CARD' | 'BANK_ACCOUNT';
}

export interface CreditCard extends BillingDetailsBase {
  type: 'CARD';
  cardNumber: string;
  expMonth: string;
  expYear: string;
}

export interface BankAccount extends BillingDetailsBase {
  type: 'BANK_ACCOUNT';
  account: string;
  bankname: string;
  swift: string;
}

export type BillingDetails = CreditCard | BankAccount;
