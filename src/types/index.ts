export enum UserRole {
  SuperAdmin = "superadmin",
  SchoolAdmin = "schooladmin",
  Teacher = "teacher",
  Student = "student",
}

export enum ParentLanguage {
  English = "english",
  Hindi = "hindi",
  Marathi = "marathi",
  Tamil = "tamil",
  Telugu = "telugu",
  Kannada = "kannada",
  Malayalam = "malayalam",
  Gujarati = "gujarati",
  Bengali = "bengali",
  Punjabi = "punjabi",
  Urdu = "urdu",
  Odia = "odia",
}

export interface User {
  _id: string;
  name: string;
  email: string;
  registrationId: string;
  role: UserRole;
  isActive: boolean;
  school?: string;
  createdAt: string;
  mobile?: string;
  additionalInfo?: Record<string, any>;
  parentLanguage?: ParentLanguage;
  parentOccupation?: string;
}

// Interface for updating user data
export interface UpdateUserData {
  name?: string;
  role?: UserRole;
  school?: string;
  isActive?: boolean;
  email?: string;
  mobile?: string;
  additionalInfo?: Record<string, any>;
  parentLanguage?: ParentLanguage;
  parentOccupation?: string;
}

export interface School {
  _id: string;
  name: string;
  registrationId: string;
  address: string;
  createdBy: string;
  isActive: boolean;
}

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  pages: number;
  schools?: T[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User, permissions?: string[]) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export interface LoginCredentials {
  registrationId: string;
  password: string;
}

export interface OnboardUserData {
  name: string;
  role: UserRole;
  schoolId?: string;
  email?: string;
  mobile?: string;
  parentLanguage?: ParentLanguage;
  parentOccupation?: string;
}

export interface SchoolCreateData {
  name: string;
  address: string;
}
