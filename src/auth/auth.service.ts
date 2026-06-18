import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    this.logger.info(
      { event: 'auth.register.attempt', email: dto.email },
      'Attempting user registration',
    );

    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      this.logger.warn(
        { event: 'auth.register.conflict', email: dto.email },
        'Registration failed — email already exists',
      );
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    this.logger.info(
      { event: 'auth.register.success', userId: user.id, email: user.email },
      'User registered successfully',
    );

    return this.buildAuthResponse(user.id, user.email);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    this.logger.info(
      { event: 'auth.login.attempt', email: dto.email },
      'Attempting user login',
    );

    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      this.logger.warn(
        { event: 'auth.login.failed', email: dto.email, reason: 'user_not_found' },
        'Login failed — user not found',
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      this.logger.warn(
        { event: 'auth.login.failed', email: dto.email, reason: 'invalid_password' },
        'Login failed — invalid password',
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.info(
      { event: 'auth.login.success', userId: user.id, email: user.email },
      'User logged in successfully',
    );

    return this.buildAuthResponse(user.id, user.email);
  }

  private buildAuthResponse(userId: string, email: string): AuthResponseDto {
    const accessToken = this.jwtService.sign({
      sub: userId,
      email,
    });

    return { accessToken };
  }
}
