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
  password?: string; // Optional on edit, required on register
  description: string;
  email: string;
  contact: string;
  zipCode: string;
  street: string;
  city: string;
  country: string;
}

export interface BillingDetailsBase {
  id?: string;
  owner: string;
}

export interface CreditCard extends BillingDetailsBase {
  type: 'creditCard';
  cardNumber: string;
  expMonth: string;
  expYear: string;
}

export interface BankAccount extends BillingDetailsBase {
  type: 'bankAccount';
  account: string;
  bankname: string;
  swift: string;
}

export type BillingDetails = CreditCard | BankAccount;
