import { User } from '../types/User';

export interface IAuthService {
  login(username: string, password: string): User | null;
  register(user: Omit<User, 'id'>): User;
  getUserByUsername(username: string): User | null;
}

class AuthService implements IAuthService {
  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      name: 'Administrador',
      email: 'admin@exemplo.com',
    },
  ];

  login(username: string, password: string): User | null {
    const user = this.getUserByUsername(username);
    if (user && user.password === password) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }
    return null;
  }

  register(userData: Omit<User, 'id'>): User {
    if (this.getUserByUsername(userData.username)) {
      throw new Error('Usuário já existe');
    }

    const newUser: User = {
      ...userData,
      id: this.users.length + 1,
    };

    this.users.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  }

  getUserByUsername(username: string): User | null {
    return this.users.find(user => user.username === username) || null;
  }
}

export default new AuthService();
