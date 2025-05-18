import axiosInstance from './axiosConfig';

export interface LeaderSummary {
  totalComplaints: number;
  totalResolved: number;
  totalPending: number;
  totalRejected: number;
}

export interface ComplaintImage {
  id: string;
  url: string;
  complaintId: string;
}

export interface Citizen {
  id: string;
  name: string;
  email: string;
  role: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  citizenId: string;
  citizen: Citizen;
  images: ComplaintImage[];
}

export const fetchLeaderSummary = async (): Promise<LeaderSummary> => {
  try {
    const response = await axiosInstance.get('/api/leader/get-leader-summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching leader summary:', error);
    throw new Error('Failed to fetch leader summary. Please try again.');
  }
};

export const fetchComplaintsInMyRegion = async (): Promise<Complaint[]> => {
  try {
    const response = await axiosInstance.get('/api/complaints/region/mine');
    return response.data;
  } catch (error) {
    console.error('Error fetching complaints in region:', error);
    throw new Error('Failed to fetch complaints in your region. Please try again.');
  }
};

export const getAdministrativeAreaString = (user: any): string => {
  if (!user) return '';
  
  const parts = [];
  
  if (user.village) parts.push(`${user.village} Village`);
  if (user.cell) parts.push(`${user.cell} Cell`);
  if (user.sector) parts.push(`${user.sector} Sector`);
  if (user.district) parts.push(`${user.district} District`);
  if (user.province) parts.push(`${user.province} Province`);
  
  return parts.join(', ');
};
