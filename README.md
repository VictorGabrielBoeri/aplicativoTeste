# Aplicativo Processo Seletivo

Aplicativo mobile desenvolvido em **React Native** para gerenciamento de clientes, visualização em mapa e cadastro, como parte de um processo seletivo.

## ✨ Funcionalidades

- **Login de usuário**
- **Cadastro de clientes**
- **Listagem de clientes**
- **Visualização dos clientes em mapa**
- **Busca de endereço por CEP**
- **Validações de formulário**
- **Testes automatizados**

## 📁 Estrutura de Pastas

```
src/
  assets/           # Imagens e recursos estáticos
  components/       # Componentes reutilizáveis
  navigation/       # Configuração de navegação
  screens/          # Telas principais (Login, Home, Cadastros, Mapa)
  services/         # Serviços de API, autenticação, geocodificação
  types/            # Tipos TypeScript
  utils/            # Funções utilitárias
__tests__/          # Testes automatizados
```

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js (recomendado: 18+)
- npm ou yarn
- Android Studio (para Android) ou Xcode (para iOS)
- Emulador ou dispositivo físico

### Instalação

```sh
npm install
# ou
yarn install
```

### Rodando no Android

```sh
npm start
# Em outro terminal:
npm run android
```

### Rodando no iOS

```sh
npm start
# Em outro terminal:
npm run ios
```
> **Obs:** No Mac, rode `cd ios && pod install` antes do primeiro build iOS.

## 🧪 Rodando os testes

```sh
npm test
```
Os testes estão localizados na pasta `__tests__` e cobrem serviços, telas e integrações principais.

## 🛠️ Tecnologias utilizadas

- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [React Navigation](https://reactnavigation.org/)
- [Axios](https://axios-http.com/)
- [Expo (se aplicável)]

## 👨‍💻 Contribuição

Sinta-se à vontade para abrir issues ou pull requests!

---

> Projeto desenvolvido para fins de avaliação técnica.