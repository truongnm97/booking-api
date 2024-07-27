import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { PrismaService } from 'prisma/prisma.service';
import * as pactum from 'pactum';
import { EditUserDto } from 'user/dto';
import { CreateBookingDto, EditBookingDto } from 'booking/dto';
import { SignUpDto } from 'auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const modulteRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = modulteRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(5000);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:5000');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: SignUpDto = {
      email: 'hello@gmail.com',
      password: '123456',
    };

    describe('Sign Up', () => {
      it('should sign up a new user', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('Sign In', () => {
      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
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
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Edit user', () => {
      const dto: EditUserDto = {
        firstName: 'Hello',
        email: 'hello@gmail.com',
      };
      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstName);
      });
    });
  });

  // describe('Booking', () => {
  //   describe('Get bookings', () => {
  //     it('should get bookings', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookings')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(HttpStatus.OK);
  //     });
  //   });

  //   describe('Create booking', () => {
  //     const dto: CreateBookingDto = {
  //       title: 'First booking',
  //       link: 'https://teddyy.netlify.app',
  //     };
  //     it('should create booking', () => {
  //       return pactum
  //         .spec()
  //         .post('/bookings')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .withBody(dto)
  //         .expectStatus(HttpStatus.CREATED)
  //         .stores('bookingId', 'id');
  //     });
  //   });

  //   describe('Get booking by id', () => {
  //     it('should get booking by id', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookings/{id}')
  //         .withPathParams('id', '$S{bookingId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(HttpStatus.OK);
  //     });
  //   });

  //   describe('Edit booking by id', () => {
  //     it('should edit booking by id', () => {
  //       const dto: EditBookingDto = {
  //         title: 'Edited booking',
  //         description: 'Testing',
  //       };
  //       return pactum
  //         .spec()
  //         .patch('/bookings/{id}')
  //         .withPathParams('id', '$S{bookingId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .withBody(dto)
  //         .expectStatus(HttpStatus.OK);
  //     });
  //   });

  //   describe('Delete booking by id', () => {
  //     it('should delete booking by id', () => {
  //       return pactum
  //         .spec()
  //         .delete('/bookings/{id}')
  //         .withPathParams('id', '$S{bookingId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(HttpStatus.NO_CONTENT);
  //     });

  //     it('should get empty bookings', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookings')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(HttpStatus.OK)
  //         .expectJsonLength(0);
  //     });
  //   });
  // });
});
