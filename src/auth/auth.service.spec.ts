import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  const usersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    toEntity: jest.fn(),
  };

  const jwtService = {
    sign: jest.fn().mockReturnValue('jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return token', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue({
        id: 'user-id',
        name: 'John',
        email: 'john@test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.register({
        name: 'John',
        email: 'john@test.com',
        password: 'password123',
      });

      expect(result.accessToken).toBe('jwt-token');
      expect(result.user.email).toBe('john@test.com');
      expect(bcrypt.hash).toHaveBeenCalled();
    });

    it('should throw ConflictException when email exists', async () => {
      usersService.findByEmail.mockResolvedValue({ id: 'existing' });

      await expect(
        authService.register({
          name: 'John',
          email: 'john@test.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return token for valid credentials', async () => {
      usersService.findByEmail.mockResolvedValue({
        id: 'user-id',
        passwordHash: 'hashed-password',
      });
      usersService.toEntity.mockReturnValue({
        id: 'user-id',
        name: 'John',
        email: 'john@test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login({
        email: 'john@test.com',
        password: 'password123',
      });

      expect(result.accessToken).toBe('jwt-token');
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      usersService.findByEmail.mockResolvedValue({
        id: 'user-id',
        passwordHash: 'hashed-password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'john@test.com',
          password: 'wrong',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
