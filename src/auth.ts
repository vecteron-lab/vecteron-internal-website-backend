import { Body, CanActivate, Controller, ExecutionContext, HttpCode, Injectable, Post, UnauthorizedException, UseGuards, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { Admin } from './database/entities';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  private readonly dummyHash = hash('dummy-password-for-timing-only', 12);
  constructor(@InjectRepository(Admin) private readonly admins: Repository<Admin>, private readonly jwt: JwtService) {}
  async login(dto: LoginDto) {
    if (Buffer.byteLength(dto.password, 'utf8') > 72) throw new UnauthorizedException('Invalid credentials');
    const admin = await this.admins.findOne({ where: { email: dto.email }, select: ['id', 'passwordHash', 'active'] });
    const valid = await compare(dto.password, admin?.passwordHash ?? await this.dummyHash);
    if (!admin?.active || !valid) throw new UnauthorizedException('Invalid credentials');
    return { accessToken: await this.jwt.signAsync({ sub: admin.id }), tokenType: 'Bearer', expiresIn: 900 };
  }
}
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, @InjectRepository(Admin) private readonly admins: Repository<Admin>) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const match = /^Bearer ([^ ]+)$/i.exec(request.headers.authorization || '');
    if (!match) throw new UnauthorizedException();
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(match[1]);
      if (typeof payload.sub !== 'string') throw new Error('Invalid subject');
      const admin = await this.admins.findOneBy({ id: payload.sub, active: true });
      if (!admin) throw new Error('Inactive account');
      return true;
    } catch { throw new UnauthorizedException(); }
  }
}
@ApiTags('Admin authentication')
@Controller('admin/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('login') @HttpCode(200) @Throttle({ default: { limit: 5, ttl: 60000 } })
  login(@Body() dto: LoginDto) { return this.auth.login(dto); }
  @Get('session') @UseGuards(AdminGuard) @ApiBearerAuth()
  session() { return { authenticated: true }; }
}
