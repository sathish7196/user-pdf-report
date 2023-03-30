const request = require('supertest');
const app = require('./index');

describe('POST /', () => {

  it('should check steps count data exits and return a 400 status code', async () => {
    const payload = {
      "EmailId": "test123@gmail.com",
      "StepsCount": []
    };
    const res = await request(app)
      .post('/')
      .send(payload);
    expect(res.statusCode).toEqual(400);
  });

  it('should check valid email Id and return a 400 status code', async () => {
    const payload = {
      "EmailId": "test123",
      "StepsCount": [
        {
          "Day1": "1000"
        },
        {
          "Day2": "1100"
        },
        {
          "Day3": "1200"
        },
        {
          "Day4": "1400"
        },
        {
          "Day5": "800"
        },
        {
          "Day6": "900"
        },
        {
          "Day7": "2000"
        },
        {
          "Day8": "200"
        }
      ]
    };
    const res = await request(app)
      .post('/')
      .send(payload);
    expect(res.statusCode).toEqual(400);
  });

  it('should send mail with genarated graph data and return a 200 status code', async () => {
    const payload = {
      "EmailId": "sathish7196@gmail.com",
      "StepsCount": [
        {
          "Day1": "1000"
        },
        {
          "Day2": "1100"
        },
        {
          "Day3": "1200"
        },
        {
          "Day4": "1400"
        },
        {
          "Day5": "800"
        },
        {
          "Day6": "900"
        },
        {
          "Day7": "2000"
        },
        {
          "Day8": "200"
        }
      ]
    };
    const res = await request(app)
      .post('/')
      .send(payload);
    expect(res.statusCode).toEqual(200);
  });
});