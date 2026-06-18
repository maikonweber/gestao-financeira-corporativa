"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const nestjs_pino_1 = require("nestjs-pino");
const bcrypt = __importStar(require("bcrypt"));
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    logger;
    saltRounds = 10;
    constructor(usersService, jwtService, logger) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.logger = logger;
    }
    async register(dto) {
        this.logger.info({ event: 'auth.register.attempt', email: dto.email }, 'Attempting user registration');
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            this.logger.warn({ event: 'auth.register.conflict', email: dto.email }, 'Registration failed — email already exists');
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
        const user = await this.usersService.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        this.logger.info({ event: 'auth.register.success', userId: user.id, email: user.email }, 'User registered successfully');
        return this.buildAuthResponse(user.id, user.email);
    }
    async login(dto) {
        this.logger.info({ event: 'auth.login.attempt', email: dto.email }, 'Attempting user login');
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            this.logger.warn({ event: 'auth.login.failed', email: dto.email, reason: 'user_not_found' }, 'Login failed — user not found');
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            this.logger.warn({ event: 'auth.login.failed', email: dto.email, reason: 'invalid_password' }, 'Login failed — invalid password');
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        this.logger.info({ event: 'auth.login.success', userId: user.id, email: user.email }, 'User logged in successfully');
        return this.buildAuthResponse(user.id, user.email);
    }
    buildAuthResponse(userId, email) {
        const accessToken = this.jwtService.sign({
            sub: userId,
            email,
        });
        return { accessToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, nestjs_pino_1.InjectPinoLogger)(AuthService.name)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        nestjs_pino_1.PinoLogger])
], AuthService);
//# sourceMappingURL=auth.service.js.map