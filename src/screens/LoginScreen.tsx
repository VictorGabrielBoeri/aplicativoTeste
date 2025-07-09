import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import authService from '../services/authService';
import {
  isValidCredentials,
  isValidUserRegistration,
  isValidEmail,
} from '../utils/validators';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  const handleLogin = () => {
    if (!isValidCredentials(username, password)) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const user = authService.login(username, password);
    if (user) {
      navigation.navigate('Home', { userData: user });
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos');
    }
  };

  const validateRegisterForm = () => {
    const newErrors = {};

    if (!registerData.username)
      newErrors.username = 'Nome de usuário é obrigatório';
    if (!registerData.password) newErrors.password = 'Senha é obrigatória';
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    if (!registerData.name) newErrors.name = 'Nome é obrigatório';
    if (!registerData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!isValidEmail(registerData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validateRegisterForm()) {
      return;
    }

    try {
      const { confirmPassword, ...userData } = registerData;

      authService.register(userData);

      setRegisterModalVisible(false);
      Alert.alert(
        'Sucesso',
        'Cadastro realizado com sucesso! Faça login para continuar.',
      );

      setRegisterData({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
      });
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const updateRegisterData = (field, value) => {
    setRegisterData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <Text style={styles.title}>Seja bem vindo!</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome de usuário"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.forgotPassword}>Redefinir senha</Text>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>ENTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => setRegisterModalVisible(true)}
        >
          <Text style={styles.registerButtonText}>CADASTRAR</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Cadastro */}
      <Modal
        visible={isRegisterModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cadastro de Usuário</Text>
              <TouchableOpacity onPress={() => setRegisterModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Nome de usuário</Text>
              <TextInput
                style={[styles.input, errors.username && styles.inputError]}
                placeholder="Digite seu nome de usuário"
                value={registerData.username}
                onChangeText={text => updateRegisterData('username', text)}
              />
              {errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}

              <Text style={styles.inputLabel}>Nome completo</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Digite seu nome completo"
                value={registerData.name}
                onChangeText={text => updateRegisterData('name', text)}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                value={registerData.email}
                onChangeText={text => updateRegisterData('email', text)}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <Text style={styles.inputLabel}>Senha</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Digite sua senha"
                secureTextEntry
                value={registerData.password}
                onChangeText={text => updateRegisterData('password', text)}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <Text style={styles.inputLabel}>Confirmar senha</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.confirmPassword && styles.inputError,
                ]}
                placeholder="Confirme sua senha"
                secureTextEntry
                value={registerData.confirmPassword}
                onChangeText={text =>
                  updateRegisterData('confirmPassword', text)
                }
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              <TouchableOpacity
                style={styles.registerSubmitButton}
                onPress={handleRegister}
              >
                <Text style={styles.registerSubmitButtonText}>CADASTRAR</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginCard: {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    backgroundColor: '#006633',
    height: 40,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  time: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#006633',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#666',
    fontSize: 12,
    marginBottom: 25,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF8C00',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#006633',
    borderWidth: 0,
    borderColor: '#006633',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    maxHeight: '80%',
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006633',
  },
  formContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  registerSubmitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#006633',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  registerSubmitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;
