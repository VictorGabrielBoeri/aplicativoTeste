import api from '../../src/services/api';
import clientService from '../../src/services/clientService';

jest.mock('../../src/services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('ClientService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clientService.clients = [];
  });

  it('should fetch clients successfully', async () => {
    const mockResponse = {
      data: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          address: {
            street: 'Main St',
            city: 'New York',
            zipcode: '10001',
            geo: {
              lat: '40.7128',
              lng: '-74.0060',
            },
          },
        },
      ],
    };

    mockedApi.get.mockResolvedValueOnce(mockResponse);

    const result = await clientService.getClients();

    expect(mockedApi.get).toHaveBeenCalledWith('/users');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('John Doe');
    expect(result[0].address.geo.lat).toBe(40.7128);
  });

  it('should handle error when fetching clients', async () => {
    const errorMessage = 'Network Error';
    mockedApi.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(clientService.getClients()).rejects.toThrow(errorMessage);
    expect(mockedApi.get).toHaveBeenCalledWith('/users');
  });

  it('should fetch a client by id successfully', async () => {
    const mockResponse = {
      data: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: {
          street: 'Main St',
          city: 'New York',
          zipcode: '10001',
          geo: {
            lat: '40.7128',
            lng: '-74.0060',
          },
        },
      },
    };

    mockedApi.get.mockResolvedValueOnce(mockResponse);

    const result = await clientService.getClientById(1);

    expect(mockedApi.get).toHaveBeenCalledWith('/users/1');
    expect(result.name).toBe('John Doe');
    expect(result.address.geo.lat).toBe(40.7128);
  });
});
