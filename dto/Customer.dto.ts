import { IsString, IsEmail, Length, IsNotEmpty } from "class-validator";

export class CreateUserInput {
  @IsString({ message: "Customer name must be a string" })
  @IsNotEmpty({ message: "Customer first name is required" })
  firstName: string;

  @IsString({ message: "Customer name must be a string" })
  @IsNotEmpty({ message: "Customer last name is required" })
  lastName: string;

  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsString()
  @Length(6, 20, { message: "Password must be between 6 and 20 characters" })
  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @IsString()
  @IsNotEmpty({ message: "Phone number is required" })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: "address is required" })
  address: string;
}

export class CustomerLoginInput {
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsString()
  @Length(6, 20, { message: "Password must be between 6 and 20 characters" })
  @IsNotEmpty({ message: "Password is required" })
  password: string;
}

export class UpdateCustomerProfileInput {
  @IsString({ message: "Customer name must be a string" })
  @IsNotEmpty({ message: "Customer first name is required" })
  firstName: string;

  @IsString({ message: "Customer name must be a string" })
  @IsNotEmpty({ message: "Customer last name is required" })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: "address is required" })
  address: string;
}

export interface CustomerPayload {
  id: string;
  email: string;
  verified: boolean;
}

export interface CustomerPaymentOfferDTO {
  amount: number;
  paymentMode: string;
  offerId?: string;
}
