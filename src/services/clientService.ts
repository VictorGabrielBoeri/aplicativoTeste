import api from './api';
import { Client } from '../types/Client';
import geocodingService from './geocodingService';

export interface IClientService {
  getClients(): Promise<Client[]>;
  getClientById(id: number): Promise<Client>;
  createClient(client: Omit<Client, 'id'>): Promise<Client>;
  updateClient(client: Client): Promise<Client>;
  deleteClient(id: number): Promise<void>;
}

class ClientService implements IClientService {
  private clients: Client[] = [];
  private nextId = 1;

  async getClients(): Promise<Client[]> {
    try {
      if (this.clients.length === 0) {
        const response = await api.get('/users');
        this.clients = response.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: {
            street: user.address.street,
            city: user.address.city,
            zipcode: user.address.zipcode,
            geo: {
              lat: parseFloat(user.address.geo.lat),
              lng: parseFloat(user.address.geo.lng),
            },
          },
        }));
        this.nextId = Math.max(...this.clients.map(c => c.id)) + 1;
      }
      return [...this.clients];
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    try {
      const geo = await geocodingService.getCoordinatesFromCEP(
        client.address.zipcode,
      );

      const newClient = {
        ...client,
        id: this.nextId++,
        address: {
          ...client.address,
          geo: geo,
        },
      };

      this.clients.push(newClient);

      try {
        await api.post('/users', client);
      } catch (apiError) {
        console.warn('API error, but client was saved locally:', apiError);
      }

      return newClient;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  async getClientById(id: number): Promise<Client> {
    try {
      const response = await api.get(`/users/${id}`);
      const user = response.data;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: {
          street: user.address.street,
          city: user.address.city,
          zipcode: user.address.zipcode,
          geo: {
            lat: parseFloat(user.address.geo.lat),
            lng: parseFloat(user.address.geo.lng),
          },
        },
      };
    } catch (error) {
      console.error(`Error fetching client with id ${id}:`, error);
      throw error;
    }
  }

  async updateClient(client: Client): Promise<Client> {
    try {
      const response = await api.put(`/users/${client.id}`, client);
      return response.data;
    } catch (error) {
      console.error(`Error updating client with id ${client.id}:`, error);
      throw error;
    }
  }

  async deleteClient(id: number): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Error deleting client with id ${id}:`, error);
      throw error;
    }
  }
}

export default new ClientService();
