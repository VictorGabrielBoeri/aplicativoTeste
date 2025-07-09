import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import clientService from '../services/clientService';
import { Client } from '../types/Client';

const MapScreen = () => {
  const navigation = useNavigation();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState({
    latitude: -15.7801,
    longitude: -47.9292,
    latitudeDelta: 25,
    longitudeDelta: 25,
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getClients();
      setClients(data);

      if (data.length > 0) {
        adjustMapRegion(data);
      }

      setError(null);
    } catch (err) {
      setError('Falha ao carregar os clientes. Tente novamente.');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const adjustMapRegion = (clientsData: Client[]) => {
    let minLat = 90;
    let maxLat = -90;
    let minLng = 180;
    let maxLng = -180;

    clientsData.forEach(client => {
      const { lat, lng } = client.address.geo;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });

    const latDelta = (maxLat - minLat) * 1.5 || 10;
    const lngDelta = (maxLng - minLng) * 1.5 || 10;

    const latitude = (minLat + maxLat) / 2;
    const longitude = (minLng + maxLng) / 2;

    setRegion({
      latitude,
      longitude,
      latitudeDelta: Math.max(latDelta, 0.5),
      longitudeDelta: Math.max(lngDelta, 0.5),
    });
  };

  useEffect(() => {
    fetchClients();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchClients();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006633" />
        <Text style={styles.loadingText}>Carregando clientes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={50} color="#FF8C00" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#006633" barStyle="light-content" />
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Mapa de Clientes</Text>
      </View>

      <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region}>
        {clients.map(client => (
          <Marker
            key={client.id}
            identifier={String(client.id)}
            coordinate={{
              latitude: client.address.geo.lat,
              longitude: client.address.geo.lng,
            }}
            title={client.name}
            description={`${client.phone} - ${client.address.city}`}
          />
        ))}
      </MapView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="call" size={24} color="#999" />
          <Text style={styles.tabText}>ITEM 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="person" size={24} color="#006633" />
          <Text style={[styles.tabText, styles.activeTab]}>ITEM 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="favorite" size={24} color="#999" />
          <Text style={styles.tabText}>ITEM 3</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#006633',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subHeader: {
    backgroundColor: '#006633',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  screenTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  map: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#999',
  },
  activeTab: {
    color: '#006633',
    fontWeight: 'bold',
  },
});

export default MapScreen;
