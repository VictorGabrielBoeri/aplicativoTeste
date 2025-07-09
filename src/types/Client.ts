export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  city: string;
  zipcode: string;
  geo: GeoLocation;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: Address;
}