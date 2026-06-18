import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ApiPublicErrors } from '../common/swagger/api-error-response.decorator';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectPinoLogger(AuthController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar novo usuário',
    description:
      'Cria uma conta corporativa e retorna o JWT para acesso imediato às rotas protegidas. ' +
      'O e-mail deve ser único no sistema. A senha é armazenada com hash bcrypt.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    type: AuthResponseDto,
    description: 'Usuário criado com sucesso e token JWT emitido',
  })
  @ApiPublicErrors()
  register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    this.logger.info(
      { event: 'auth.register.request', email: dto.email },
      'Register request received',
    );
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar usuário',
    description:
      'Valida e-mail e senha e retorna um access token JWT. ' +
      'Utilize o token no header `Authorization: Bearer <token>` nas demais rotas.',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'Credenciais válidas — token JWT retornado',
  })
  @ApiPublicErrors()
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    this.logger.info(
      { event: 'auth.login.request', email: dto.email },
      'Login request received',
    );
    return this.authService.login(dto);
  }
}
