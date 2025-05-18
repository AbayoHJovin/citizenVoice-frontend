import axiosInstance from './axiosConfig';

export interface Responder {
  id: string;
  name: string;
  role: string;
  email?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  administrationScope?: string;
}

export interface ResponseType {
  id: string;
  message: string;
  complaintId: string;
  responderId: string;
  responder: Responder;
  createdAt: string;
  updatedAt?: string;
}

// Create a new response
export const createResponse = async (complaintId: string, message: string): Promise<Response> => {
  try {
    const response = await axiosInstance.post('/api/responses/add', {
      complaintId,
      message
    });
    return response.data;
  } catch (error) {
    console.error('Error creating response:', error);
    throw new Error('Failed to add response. Please try again.');
  }
};

// Update an existing response
export const updateResponse = async (responseId: string, message: string): Promise<Response> => {
  try {
    const response = await axiosInstance.put(`/api/responses/update/${responseId}`, {
      message
    });
    return response.data;
  } catch (error) {
    console.error('Error updating response:', error);
    throw new Error('Failed to update response. Please try again.');
  }
};

// Delete a response
export const deleteResponse = async (responseId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/api/responses/delete/${responseId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting response:', error);
    throw new Error('Failed to delete response. Please try again.');
  }
};

// Get responses for a specific complaint
export const getResponsesByComplaint = async (complaintId: string): Promise<Response[]> => {
  try {
    const response = await axiosInstance.get(`/api/responses/complaint/${complaintId}`);
    return Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
  } catch (error) {
    console.error('Error fetching responses:', error);
    throw new Error('Failed to fetch responses. Please try again.');
  }
};
