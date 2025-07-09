import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userData = route.params?.userData || { name: 'Usuário' };
  
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#006633" barStyle="light-content" />
      
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Olá, {userData.name}</Text>
        <View style={styles.idContainer}>
          <Icon name="location-on" size={16} color="#666" />
          <Text style={styles.idText}>A5874125</Text>
        </View>
      </View>
      
      <View style={styles.bannerContainer}>
        <Image 
          source={require('../assets/imagem-inicio.png')} 
          style={styles.banner} 
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.menuContainer}>
        <View style={styles.menuRow}>
          <TouchableOpacity 
            style={styles.menuCard} 
            onPress={() => navigation.navigate('Cadastros')}
          >
            <View style={styles.iconContainer}>
              <Icon name="person-add" size={24} color="white" />
            </View>
            <Text style={styles.menuText}>Cadastros</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuCard}>
            <View style={styles.iconContainer}>
              <Icon name="business" size={24} color="white" />
            </View>
            <Text style={styles.menuText}>Consultar Organização</Text>
          </TouchableOpacity>
        </View>
      </View>
      
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
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#006633',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  bannerContainer: {
    paddingHorizontal: 20,
  },
  banner: {
    height: 150,
    width: '100%',
    borderRadius: 10,
  },
  menuContainer: {
    padding: 20,
  },
  menuRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
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

export default HomeScreen;