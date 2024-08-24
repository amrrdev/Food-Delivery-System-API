export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodType: string[];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface VendorLoginInput {
  email: string;
  password: string;
}

export interface UpdateVendorInput {
  name: string;
  address: string;
  foodType: string[];
  phone: string;
}

export interface VendorPayload {
  id: string;
  email: string;
  name: string;
}

export interface VendorQuery {
  pincode: string;
  serviceAvailable?: boolean;
}
export interface VendorOfferInput {
  offerType: string; //Vendor // Generic
  vendors: any[];
  title: string;
  description: string;
  expirationDate: Date;
  discountPercentage: number; //min order amount should 300 EG
  pincode: string; // OFFER WITHIN SPECIFIC AREA
  isActive: boolean;
}
