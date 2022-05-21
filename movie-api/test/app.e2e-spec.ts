import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  //beforeEach는 각 테스트 단위마다 초기화되는 것들을 의미
  //이걸 beforeAll로 변경하면 한번 만들고 모든 테스트에 적용된다
  /*beforeEach*/
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(); //어플리케이션을 만들때 서버에서 설정한 파이프도 추가해야 정상적인 테스트가 가능
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true, //decorator가 없는 property의 object 를 거르는 역할
      forbidNonWhitelisted: true, //이상한걸 보내면 request자체를 막음
      transform: true, //유저들이 보낸 정보를 실제 사용하고자하는 타입으로 변경
    }));
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('welcome to my movie api');
  });

  describe("/movies", () => {
    it("GET", () => {
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect([]);
    });

    it("POST 201", () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'test',
          year: 2000,
          genres: ['test'],
        })
        .expect(201);
    });

    it('POST 400', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'test',
          year: 2000,
          genres: ['test'],
          other: 'thing'
        })
        .expect(400);
    })

    it("DELETE", () => {
      return request(app.getHttpServer())
        .delete('/movies')
        .expect(404);
    });
  });

  describe('/movies/:id', () => {
    it("GET 200", () => {
      return request(app.getHttpServer())
        .get('/movies/1')
        .expect(200);
    });

    it("GET 404", () => {
      return request(app.getHttpServer())
        .get('/movies/999')
        .expect(404);
    });

    it("PATCH 200", () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({
          title: 'update test'
        })
        .expect(200);
    });

    it("DELETE", () => {
      return request(app.getHttpServer())
        .delete('/movies/1')
        .expect(200);
    });
  })
});
