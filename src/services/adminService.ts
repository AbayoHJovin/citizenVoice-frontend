import axiosInstance from './axiosConfig';

export interface AdminSummary {
  totalComplaints: number;
  totalResolved: number;
  totalPending: number;
  totalRejected: number;
  totalLeaders: number;
  totalCitizens: number;
  totalAdmins: number;
}

export interface TopLeader {
  id: string;
  name: string;
  email: string;
  totalResponses: number;
}

export interface Leader {
  id: string;
  name: string;
  email: string;
  role: string;
  adminstrationScope: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  createdAt?: string;
}

export interface CreateLeaderData {
  name: string;
  email: string;
  adminstrationScope: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
}

export const fetchAdminSummary = async (): Promise<AdminSummary> => {
  try {
    const response = await axiosInstance.get('/api/users/get-summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin summary:', error);
    // Return default values in case of error
    return {
      totalComplaints: 0,
      totalResolved: 0,
      totalPending: 0,
      totalRejected: 0,
      totalLeaders: 0,
      totalCitizens: 0,
      totalAdmins: 0
    };
  }
};

export const fetchTopLeaders = async (): Promise<TopLeader[]> => {
  try {
    const response = await axiosInstance.get('/api/users/get-top-leaders');
    return response.data;
  } catch (error) {
    console.error('Error fetching top leaders:', error);
    // Return empty array in case of error
    return [];
  }
};

export const fetchAllLeaders = async (): Promise<Leader[]> => {
  try {
    const response = await axiosInstance.get('/api/users/leaders');
    return response.data;
  } catch (error) {
    console.error('Error fetching all leaders:', error);
    // Return empty array in case of error
    return [];
  }
};

export const fetchLeaderById = async (id: string): Promise<Leader> => {
  try {
    const response = await axiosInstance.get(`/api/users/leader/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leader details:', error);
    throw new Error('Failed to fetch leader details. Please try again.');
  }
};

export const createLeader = async (data: CreateLeaderData): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post('/api/users/leader/create', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating leader:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create leader. Please try again.');
  }
};
