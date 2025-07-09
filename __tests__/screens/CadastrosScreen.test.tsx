import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import CadastrosScreen from '../../src/screens/CadastrosScreen';
import clientService from '../../src/services/clientService';

jest.mock('../../src/services/clientService');

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

describe('CadastrosScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    jest
      .spyOn(clientService, 'getClients')
      .mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(<CadastrosScreen />);

    expect(getByText('Carregando clientes...')).toBeTruthy();
  });

  it('should render clients list after loading', async () => {
    jest.spyOn(clientService, 'getClients').mockResolvedValue([
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
    ]);

    const { getByText, queryByText } = render(<CadastrosScreen />);

    expect(queryByText('Carregando clientes...')).toBeTruthy();

    await waitFor(() => {
      expect(queryByText('Carregando clientes...')).toBeFalsy();
    });

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('123-456-7890')).toBeTruthy();
  });

  it('should filter clients based on search text', async () => {
    jest.spyOn(clientService, 'getClients').mockResolvedValue([
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
    ]);

    const { getByText, queryByText, getByPlaceholderText } = render(
      <CadastrosScreen />,
    );

    await waitFor(() => {
      expect(queryByText('Carregando clientes...')).toBeFalsy();
    });

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Jane Smith')).toBeTruthy();

    const searchInput = getByPlaceholderText('Procurar');
    fireEvent.changeText(searchInput, 'Jane');

    expect(queryByText('John Doe')).toBeFalsy();
    expect(getByText('Jane Smith')).toBeTruthy();
  });
});
