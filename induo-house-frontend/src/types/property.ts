export interface PropertyListResponse {
  id: number;
  title: string;
  price: number;
  area: number;
  city: string;
  numberOfRooms: number | null;
  transactionType: string;
  propertyType: string;
  status: string;
  thumbnailUrl: string | null;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhoneNumber: string;
}

export interface PageResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface SearchParams {
  page?: number;
  size?: number;
  sort?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  transactionType?: string;
}
