import { ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from '../src/health/health.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('HealthService', () => {
  it('returns ok when the database responds', async () => {
    const prisma = { $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]) };
    const service = new HealthService(prisma as unknown as PrismaService);

    await expect(service.check()).resolves.toEqual({ status: 'ok' });
  });

  it('throws when the database is unavailable', async () => {
    const prisma = { $queryRaw: jest.fn().mockRejectedValue(new Error('offline')) };
    const service = new HealthService(prisma as unknown as PrismaService);

    await expect(service.check()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
