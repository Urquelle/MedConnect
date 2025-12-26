
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR'
}

export interface User {
  id: string;
  role: UserRole;
  name?: string; // Optional for patients (anonymity)
  specialization?: string; // For doctors
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  avatar?: string;
}

export interface MedicalCase {
  id: string;
  patientId: string;
  title: string;
  description: string;
  symptoms: string[];
  severity: 'Low' | 'Medium' | 'High' | 'Emergency';
  images: string[]; // Base64 strings
  status: 'Open' | 'Consulted' | 'Closed';
  createdAt: string;
  diagnoses: Diagnosis[];
}

export interface Diagnosis {
  id: string;
  doctorId: string;
  doctorName: string;
  content: string;
  recommendations: string;
  rating?: number;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}
