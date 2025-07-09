import axios from 'axios';
import geocodingService from '../../src/services/geocodingService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('GeocodingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return coordinates for a valid CEP', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        cep: '01001-000',
        logradouro: 'Praça da Sé',
        complemento: 'lado ímpar',
        bairro: 'Sé',
        localidade: 'São Paulo',
        uf: 'SP',
        ibge: '3550308',
        gia: '1004',
        ddd: '11',
        siafi: '7107',
      },
    });

    const result = await geocodingService.getCoordinatesFromCEP('01001-000');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://viacep.com.br/ws/01001000/json/',
    );
    expect(result).toHaveProperty('lat');
    expect(result).toHaveProperty('lng');
    expect(typeof result.lat).toBe('number');
    expect(typeof result.lng).toBe('number');

    expect(result.lat).toBeGreaterThanOrEqual(-33);
    expect(result.lat).toBeLessThanOrEqual(-5);
    expect(result.lng).toBeGreaterThanOrEqual(-73);
    expect(result.lng).toBeLessThanOrEqual(-35);
  });

  it('should handle CEP not found error', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { erro: true },
    });

    const result = await geocodingService.getCoordinatesFromCEP('00000-000');

    expect(result).toEqual({ lat: -15.7801, lng: -47.9292 });
  });

  it('should handle API errors', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    const result = await geocodingService.getCoordinatesFromCEP('01001-000');

    expect(result).toEqual({ lat: -15.7801, lng: -47.9292 });
  });

  it('should clean CEP format before making API call', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        cep: '01001-000',
        logradouro: 'Praça da Sé',
        localidade: 'São Paulo',
        uf: 'SP',
      },
    });

    await geocodingService.getCoordinatesFromCEP('01001-000');
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://viacep.com.br/ws/01001000/json/',
    );

    mockedAxios.get.mockClear();
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        cep: '01001-000',
        logradouro: 'Praça da Sé',
        localidade: 'São Paulo',
        uf: 'SP',
      },
    });

    await geocodingService.getCoordinatesFromCEP('01.001-000');
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://viacep.com.br/ws/01001000/json/',
    );
  });
});
