import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import MapScreen from '../../src/screens/MapScreen';
import clientService from '../../src/services/clientService';

// Helper para garantir que todas as promessas sejam resolvidas
const flushPromises = () => new Promise(resolve => setImmediate(resolve));

jest.mock('../../src/services/clientService');

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      addListener: jest.fn().mockImplementation((event, callback) => {
        if (event === 'focus') {
          callback();
        }
        return jest.fn();
      }),
    }),
  };
});

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Remover completamente este bloco de código - NÃO DEIXAR COMENTADO

describe('MapScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    jest
      .spyOn(clientService, 'getClients')
      .mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(<MapScreen />);

    expect(getByText('Carregando clientes...')).toBeTruthy();
  });

  it('should render map with markers after loading clients', async () => {
    const mockClients = [
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
            lat: 40.7128,
            lng: -74.006,
          },
        },
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '987-654-3210',
        address: {
          street: 'Second St',
          city: 'Los Angeles',
          zipcode: '90001',
          geo: {
            lat: 34.0522,
            lng: -118.2437,
          },
        },
      },
    ];

    // Limpar o mock e configurar para retornar os clientes mock
    jest.clearAllMocks();
    
    // Usar mockResolvedValue para garantir que a promessa seja resolvida imediatamente
    jest.spyOn(clientService, 'getClients').mockResolvedValue(mockClients);

    // Renderizar o componente normalmente
    const { getByTestId, queryByText } = render(<MapScreen />);

    // Esperar o mapa aparecer
    await waitFor(() => {
      expect(queryByText('Carregando clientes...')).toBeFalsy();
      expect(getByTestId('map-view')).toBeTruthy();
      expect(getByTestId('map-marker-1')).toBeTruthy();
      expect(getByTestId('map-marker-2')).toBeTruthy();
    });
  });

  it('should render error state when client fetching fails', async () => {
    const errorMessage = 'Falha ao carregar os clientes. Tente novamente.';
    jest
      .spyOn(clientService, 'getClients')
      .mockRejectedValue(new Error('Network error'));

    const { getByText } = render(<MapScreen />);

    await flushPromises();
    
    await waitFor(() => {
      expect(getByText(errorMessage)).toBeTruthy();
    });
  });
});
