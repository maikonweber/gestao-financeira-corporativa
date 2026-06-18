import { createMockLogger } from '../testing/pino-logger.mock';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getLoggerToken } from 'nestjs-pino';
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
        {
          provide: getLoggerToken(AuthService.name),
          useValue: createMockLogger(),
        },
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
      expect(result).toEqual({ accessToken: 'jwt-token' });
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
        email: 'john@test.com',
        passwordHash: 'hashed-password',
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
        email: 'john@test.com',
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

    it('should throw UnauthorizedException when user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'unknown@test.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should sign JWT with user id and email without returning user data', async () => {
      usersService.findByEmail.mockResolvedValue({
        id: 'user-id',
        email: 'john@test.com',
        passwordHash: 'hashed-password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login({
        email: 'john@test.com',
        password: 'password123',
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user-id',
        email: 'john@test.com',
      });
      expect(result).toEqual({ accessToken: 'jwt-token' });
      expect(result).not.toHaveProperty('user');
    });
  });
});
