import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { PrismaService } from 'prisma/prisma.service';
import * as pactum from 'pactum';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(5000);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:5000');
  });

  afterAll(() => app.close());

  describe('Auth', () => {
    describe('Sign Up', () => {
      it('should sign up admin', () => {
        return pactum
          .spec()
          .post('/auth/sign-up')
          .withBody({ email: 'admin@test.com', password: '123456', role: 'ADMIN' })
          .expectStatus(HttpStatus.CREATED);
      });

      it('should sign up user', () => {
        return pactum
          .spec()
          .post('/auth/sign-up')
          .withBody({ email: 'user@test.com', password: '123456' })
          .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('Sign In', () => {
      it('should sign in as admin', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody({ email: 'admin@test.com', password: '123456' })
          .expectStatus(HttpStatus.OK)
          .stores('adminAt', 'access_token');
      });

      it('should sign in as user', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody({ email: 'user@test.com', password: '123456' })
          .expectStatus(HttpStatus.OK)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ firstName: 'Test', email: 'user@test.com' })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('user@test.com')
          .expectBodyContains('Test');
      });
    });
  });

  describe('EventType', () => {
    describe('Create event type', () => {
      it('should create event type as admin', () => {
        return pactum
          .spec()
          .post('/event-type')
          .withHeaders({ Authorization: 'Bearer $S{adminAt}' })
          .withBody({ name: 'Conference' })
          .expectStatus(HttpStatus.CREATED)
          .stores('eventTypeId', 'id');
      });
    });

    describe('Get event types', () => {
      it('should get event types', () => {
        return pactum
          .spec()
          .get('/event-type')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.OK);
      });
    });
  });

  describe('Booking', () => {
    describe('Get bookings', () => {
      it('should get empty bookings', () => {
        return pactum
          .spec()
          .get('/bookings')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.OK)
          .expectJsonLike({ data: [], total: 0 });
      });
    });

    describe('Create booking', () => {
      it('should create booking', () => {
        return pactum
          .spec()
          .post('/bookings')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            location: 'Hanoi Office',
            proposalDates: ['2026-07-01', '2026-07-02'],
            eventTypeId: '$S{eventTypeId}',
          })
          .expectStatus(HttpStatus.CREATED)
          .stores('bookingId', 'id');
      });
    });

    describe('Get booking by id', () => {
      it('should get booking by id', () => {
        return pactum
          .spec()
          .get('/bookings/{id}')
          .withPathParams('id', '$S{bookingId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Edit booking by id', () => {
      it('should edit booking by id as admin', () => {
        return pactum
          .spec()
          .patch('/bookings/{id}')
          .withPathParams('id', '$S{bookingId}')
          .withHeaders({ Authorization: 'Bearer $S{adminAt}' })
          .withBody({ location: 'HCMC Office' })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('HCMC Office');
      });
    });

    describe('Approve booking', () => {
      it('should approve booking as admin', () => {
        return pactum
          .spec()
          .post('/bookings/{id}/approve')
          .withPathParams('id', '$S{bookingId}')
          .withHeaders({ Authorization: 'Bearer $S{adminAt}' })
          .withBody({ selectedDate: '2026-07-01' })
          .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('Delete booking by id', () => {
      it('should delete booking as admin', () => {
        return pactum
          .spec()
          .delete('/bookings/{id}')
          .withPathParams('id', '$S{bookingId}')
          .withHeaders({ Authorization: 'Bearer $S{adminAt}' })
          .expectStatus(HttpStatus.NO_CONTENT);
      });

      it('should get empty bookings after delete', () => {
        return pactum
          .spec()
          .get('/bookings')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.OK)
          .expectJsonLike({ data: [], total: 0 });
      });
    });
  });
});
