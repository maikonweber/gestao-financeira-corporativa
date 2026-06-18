import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly logger;
    private readonly saltRounds;
    constructor(usersService: UsersService, jwtService: JwtService, logger: PinoLogger);
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    private buildAuthResponse;
}
