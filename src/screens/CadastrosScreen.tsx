import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import clientService from '../services/clientService';
import { Client } from '../types/Client';
import {
  isValidEmail,
  isValidPhone,
  isNotEmpty,
  isValidClient,
} from '../utils/validators';
import { formatPhoneNumber } from '../utils/formatters';

const CadastrosScreen = () => {
  const navigation = useNavigation();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      zipcode: '',
      geo: {
        lat: 0,
        lng: 0,
      },
    },
  });
  const [errors, setErrors] = useState({});

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getClients();
      setClients(data);
      setFilteredClients(data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar os clientes. Tente novamente.');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filtered = clients.filter(
        client =>
          client.name.toLowerCase().includes(text.toLowerCase()) ||
          client.phone.includes(text),
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  };

  const handleClientPress = (client: Client) => {
    Alert.alert(
      'Cliente selecionado',
      `Nome: ${client.name}\nTelefone: ${client.phone}`,
    );
  };

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const formatCEP = (cep: string): string => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length === 8) {
      return `${cleaned.substring(0, 5)}-${cleaned.substring(5)}`;
    }
    return cleaned;
  };

  const updateNewClientData = (field, value) => {
    if (field === 'phone') {
      const cleanedValue = value.replace(/\D/g, '');

      const formattedValue = formatPhoneNumber(cleanedValue);

      setNewClient(prev => ({
        ...prev,
        [field]: cleanedValue,
      }));

      return formattedValue;
    } else if (field === 'address.zipcode') {
      const cleanedValue = value.replace(/\D/g, '');

      const formattedValue = formatCEP(cleanedValue);

      setNewClient(prev => ({
        ...prev,
        address: {
          ...prev.address,
          zipcode: cleanedValue,
        },
      }));

      return formattedValue;
    } else if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setNewClient(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
      return value;
    } else {
      setNewClient(prev => ({
        ...prev,
        [field]: value,
      }));
      return value;
    }
  };

  const validateClientForm = () => {
    const newErrors = {};

    if (!isNotEmpty(newClient.name)) newErrors.name = 'Nome é obrigatório';
    if (!isNotEmpty(newClient.email)) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!isValidEmail(newClient.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!isNotEmpty(newClient.phone)) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!isValidPhone(newClient.phone)) {
      newErrors.phone = 'Telefone inválido';
    }
    if (!isNotEmpty(newClient.address.street))
      newErrors.street = 'Rua é obrigatória';
    if (!isNotEmpty(newClient.address.city))
      newErrors.city = 'Cidade é obrigatória';
    if (!isNotEmpty(newClient.address.zipcode))
      newErrors.zipcode = 'CEP é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterClient = async () => {
    if (!validateClientForm()) {
      return;
    }

    try {
      setLoading(true);
      const createdClient = await clientService.createClient(newClient);

      setClients(prev => [...prev, createdClient]);
      setFilteredClients(prev => [...prev, createdClient]);

      setRegisterModalVisible(false);
      Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!');

      setNewClient({
        name: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          zipcode: '',
          geo: {
            lat: 0,
            lng: 0,
          },
        },
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao cadastrar cliente. Tente novamente.');
      console.error('Error creating client:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContact = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleClientPress(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && clients.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006633" />
        <Text style={styles.loadingText}>Carregando clientes...</Text>
      </View>
    );
  }

  if (error && clients.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={50} color="#FF8C00" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchClients}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
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
        <Text style={styles.screenTitle}>Cadastros</Text>
        <TouchableOpacity style={styles.mapButton} onPress={handleMapPress}>
          <Icon name="map" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Procurar"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredClients}
        renderItem={renderContact}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.contactsList}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="person-off" size={50} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchText
                ? 'Nenhum cliente encontrado'
                : 'Nenhum cliente cadastrado'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setRegisterModalVisible(true)}
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal de Cadastro de Cliente */}
      <Modal
        visible={isRegisterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRegisterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cadastro de Cliente</Text>
              <TouchableOpacity onPress={() => setRegisterModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Digite o nome completo"
                value={newClient.name}
                onChangeText={text => updateNewClientData('name', text)}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Digite o e-mail"
                keyboardType="email-address"
                value={newClient.email}
                onChangeText={text => updateNewClientData('email', text)}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <Text style={styles.inputLabel}>Telefone</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Digite o telefone"
                keyboardType="phone-pad"
                value={formatPhoneNumber(newClient.phone)}
                onChangeText={text => {
                  const formattedValue = updateNewClientData('phone', text);
                }}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}

              <Text style={styles.inputLabel}>Rua</Text>
              <TextInput
                style={[styles.input, errors.street && styles.inputError]}
                placeholder="Digite a rua"
                value={newClient.address.street}
                onChangeText={text =>
                  updateNewClientData('address.street', text)
                }
              />
              {errors.street && (
                <Text style={styles.errorText}>{errors.street}</Text>
              )}

              <Text style={styles.inputLabel}>Cidade</Text>
              <TextInput
                style={[styles.input, errors.city && styles.inputError]}
                placeholder="Digite a cidade"
                value={newClient.address.city}
                onChangeText={text => updateNewClientData('address.city', text)}
              />
              {errors.city && (
                <Text style={styles.errorText}>{errors.city}</Text>
              )}

              <Text style={styles.inputLabel}>CEP</Text>
              <TextInput
                style={[styles.input, errors.zipcode && styles.inputError]}
                placeholder="Digite o CEP"
                keyboardType="numeric"
                value={formatCEP(newClient.address.zipcode)}
                onChangeText={text => {
                  const formattedValue = updateNewClientData(
                    'address.zipcode',
                    text,
                  );
                }}
              />
              {errors.zipcode && (
                <Text style={styles.errorText}>{errors.zipcode}</Text>
              )}

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegisterClient}
              >
                <Text style={styles.registerButtonText}>CADASTRAR</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  subHeader: {
    backgroundColor: '#006633',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  mapButton: {
    padding: 5,
  },
  screenTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  searchContainer: {
    padding: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  contactsList: {
    paddingHorizontal: 15,
    paddingBottom: 120,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF8C00',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 70,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
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

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006633',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  inputError: {
    borderColor: 'red',
  },
  registerButton: {
    backgroundColor: '#006633',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CadastrosScreen;
