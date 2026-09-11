import { Controller, Get, Module, ServiceUnavailableException } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DataSource } from 'typeorm';
import { configuration } from './config';
import { databaseOptions } from './database/data-source';
import { Admin, Content, ContactRequest } from './database/entities';
import { AdminGuard, AuthController, AuthService } from './auth';
import { AdminContentController, ContentService, PublicContentController } from './content';
import { AdminContactController, ContactService, PublicContactController } from './contact';

@Controller('health')
class HealthController {
  constructor(private readonly db: DataSource) {}
  @Get() async health() {
    try { await this.db.query('SELECT 1'); return { status: 'ok' }; }
    catch { throw new ServiceUnavailableException('Database unavailable'); }
  }
}
@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: () => ({ ...databaseOptions, url: configuration().databaseUrl }) }),
    TypeOrmModule.forFeature([Admin, Content, ContactRequest]),
    JwtModule.registerAsync({ useFactory: () => ({ secret: configuration().jwtSecret, signOptions: { expiresIn: '15m', issuer: 'vecteron-api', audience: 'vecteron-admin' }, verifyOptions: { issuer: 'vecteron-api', audience: 'vecteron-admin', algorithms: ['HS256'] } }) }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
  ],
  controllers: [HealthController, AuthController, PublicContentController, AdminContentController, PublicContactController, AdminContactController],
  providers: [AuthService, AdminGuard, ContentService, ContactService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
