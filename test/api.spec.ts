import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { AdminContactController, ContactService, PublicContactController } from '../src/contact';
import { Admin, Content, ContactRequest } from '../src/database/entities';
import { AdminGuard, AuthController, AuthService } from '../src/auth';
import { AdminContentController, ContentService, PublicContentController } from '../src/content';
import { setup } from '../src/setup';

describe('API security and content contract', () => {
  let app: INestApplication;
  let jwt: JwtService;
  const admins = { findOne: jest.fn(), findOneBy: jest.fn() };
  const content = { findAndCount: jest.fn().mockResolvedValue([[], 0]), findOneBy: jest.fn().mockResolvedValue(null) };
  const contacts = { create: jest.fn(dto => dto), save: jest.fn().mockResolvedValue({ id: 'contact-id' }), findAndCount: jest.fn().mockResolvedValue([[], 0]) };
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test-secret-only-not-for-deployment', signOptions: { expiresIn: '15m' } })],
      controllers: [AuthController, PublicContentController, AdminContentController, PublicContactController, AdminContactController],
      providers: [ContactService, { provide: getRepositoryToken(ContactRequest), useValue: contacts }, AuthService, AdminGuard, ContentService, { provide: getRepositoryToken(Admin), useValue: admins }, { provide: getRepositoryToken(Content), useValue: content }],
    }).compile();
    app = module.createNestApplication();
    setup(app, ['http://localhost:3000']);
    await app.init();
    jwt = module.get(JwtService);
  });
  afterAll(async () => { await app.close(); });
  it('keeps contact requests private and validates submissions', async () => {
    await request(app.getHttpServer()).get('/api/v1/admin/contact-requests').expect(401);
    await request(app.getHttpServer()).post('/api/v1/contact-requests').send({ email: 'invalid' }).expect(400);
    const result = await request(app.getHttpServer()).post('/api/v1/contact-requests').send({ name: 'Visitor', email: 'visitor@example.com', subject: 'Hello', message: 'Please contact me.' }).expect(201);
    expect(result.body).toEqual({ id: 'contact-id', message: 'Your request has been received.' });
    await request(app.getHttpServer()).post('/api/v1/contact-requests').send({ name: 'Visitor', email: 'visitor@example.com', subject: 'Hello', message: 'Hello', status: 'resolved' }).expect(400);
  });
  it('rejects unauthenticated admin access', async () => { await request(app.getHttpServer()).get('/api/v1/admin/content').expect(401); });
  it('rejects invalid and expired tokens', async () => {
    for (const token of ['invalid', jwt.sign({ sub: 'admin' }, { expiresIn: -1 })]) {
      await request(app.getHttpServer()).get('/api/v1/admin/content').set('Authorization', `Bearer ${token}`).expect(401);
    }
  });
  it('rejects a disabled account even with a valid token', async () => {
    admins.findOneBy.mockResolvedValueOnce(null);
    await request(app.getHttpServer()).get('/api/v1/admin/content').set('Authorization', `Bearer ${jwt.sign({ sub: 'admin' })}`).expect(401);
  });
  it('filters public listings to published content and paginates', async () => {
    await request(app.getHttpServer()).get('/api/v1/content?kind=portfolio&page=2&limit=5').expect(200);
    expect(content.findAndCount).toHaveBeenLastCalledWith(expect.objectContaining({ where: { kind: 'portfolio', published: true }, skip: 5, take: 5 }));
  });
  it('does not return drafts from the public detail endpoint', async () => {
    await request(app.getHttpServer()).get('/api/v1/content/draft').expect(404);
    expect(content.findOneBy).toHaveBeenLastCalledWith({ slug: 'draft', published: true });
  });
  it('rejects invalid pagination and unknown query fields', async () => {
    await request(app.getHttpServer()).get('/api/v1/content?limit=101').expect(400);
    await request(app.getHttpServer()).get('/api/v1/content?published=false').expect(400);
  });
  it('rejects malformed content and null required update fields', async () => {
    admins.findOneBy.mockResolvedValue({ id: 'admin', active: true });
    const token = jwt.sign({ sub: 'admin' });
    await request(app.getHttpServer()).post('/api/v1/admin/content').set('Authorization', `Bearer ${token}`).send({ title: 'Incomplete' }).expect(400);
    await request(app.getHttpServer()).patch('/api/v1/admin/content/123e4567-e89b-42d3-a456-426614174000').set('Authorization', `Bearer ${token}`).send({ title: null }).expect(400);
  });
  it('issues tokens only for valid active credentials without exposing hashes', async () => {
    admins.findOne.mockResolvedValue({ id: 'admin', active: true, passwordHash: await hash('a-long-test-password', 4) });
    const response = await request(app.getHttpServer()).post('/api/v1/admin/auth/login').send({ email: 'admin@example.com', password: 'a-long-test-password' }).expect(200);
    expect(jwt.verify(response.body.accessToken).sub).toBe('admin');
    expect(response.body.passwordHash).toBeUndefined();
    await request(app.getHttpServer()).post('/api/v1/admin/auth/login').send({ email: 'admin@example.com', password: 'wrong' }).expect(401);
  });
});
