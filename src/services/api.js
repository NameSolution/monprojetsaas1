
const API_BASE = '/api';

class ApiService {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);

    const contentType = response.headers.get('Content-Type') || '';

    if (!response.ok) {
      if (contentType.includes('application/json')) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Request failed');
      } else {
        await response.text();
        throw new Error('Request failed');
      }
    }

    if (contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  // Auth methods
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async signup(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async resetPassword(email) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: { email },
    });
  }

  // Hotels methods
  async getHotels() {
    return this.request('/hotels');
  }

  async getMyHotel() {
    return this.request('/hotels/my-hotel');
  }

  async createHotel(hotelData) {
    return this.request('/hotels', {
      method: 'POST',
      body: hotelData,
    });
  }

  async updateHotel(id, hotelData) {
    return this.request(`/hotels/${id}`, {
      method: 'PUT',
      body: hotelData,
    });
  }

  async deleteHotel(id) {
    return this.request(`/hotels/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics methods
  async getAnalytics() {
    return this.request('/analytics/overview');
  }

  // Support methods
  async getSupportTickets() {
    return this.request('/support/tickets');
  }

  async createSupportTicket(ticketData) {
    return this.request('/support/tickets', {
      method: 'POST',
      body: ticketData,
    });
  }

  async updateSupportTicket(id, ticketData) {
    return this.request(`/support/tickets/${id}`, {
      method: 'PUT',
      body: ticketData,
    });
  }

  async deleteSupportTicket(id) {
    return this.request(`/support/tickets/${id}`, {
      method: 'DELETE'
    });
  }

  // Users methods
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: userData,
    });
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: userData,
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Plans methods
  async getPlans() {
    return this.request('/plans');
  }

  async createPlan(planData) {
    return this.request('/plans', {
      method: 'POST',
      body: planData,
    });
  }

  async updatePlan(id, planData) {
    return this.request(`/plans/${id}`, {
      method: 'PUT',
      body: planData,
    });
  }

  // Languages methods
  async getLanguages() {
    return this.request('/languages');
  }

  // Knowledge base methods
  async getKnowledgeItems() {
    return this.request('/knowledge');
  }

  async createKnowledgeItem(data) {
    return this.request('/knowledge', {
      method: 'POST',
      body: data
    });
  }

  async updateKnowledgeItem(id, data) {
    return this.request(`/knowledge/${id}`, {
      method: 'PUT',
      body: data
    });
  }

  async deleteKnowledgeItem(id) {
    return this.request(`/knowledge/${id}`, {
      method: 'DELETE'
    });
  }
}

export default new ApiService();
