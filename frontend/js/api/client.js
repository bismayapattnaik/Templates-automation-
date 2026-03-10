/**
 * API Client for communicating with backend
 */

const API_BASE_URL = '/api';

class APIClient {
  /**
   * Generates template by calling backend API
   */
  async generateTemplate(request) {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate template');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Gets available section types
   */
  async getSectionTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/section-types`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch section types');
      }

      return data.data || [];
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Checks API health
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data.status === 'ok';
    } catch {
      return false;
    }
  }

  /**
   * Converts file to base64
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// Export singleton instance
const apiClient = new APIClient();
