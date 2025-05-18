import axiosInstance from './axiosConfig';

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

/**
 * Fetch citizens under a leader's administration
 */
export const getLeaderCitizens = async (): Promise<Citizen[]> => {
  try {
    const response = await axiosInstance.get('/api/leader/show-leader-citizens');
    return response.data;
  } catch (error) {
    console.error('Error fetching leader citizens:', error);
    throw new Error('Failed to fetch citizens. Please try again.');
  }
};
