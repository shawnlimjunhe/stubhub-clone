import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/tickets';
import { natsWrapper } from '../../nats-wrapper';

const generateID = () => {
  return new mongoose.Types.ObjectId().toHexString();
};

it('returns a 404 if the provided id does not exist', async () => {
  const id = generateID();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'aslkdfj',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', global.signin())
    .send({
      title: 'aslkdfj',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'aslkdferej',
      price: 30,
    })
    .expect(401);

  const tickets = await Ticket.findOne({ _id: response.body.id });
  expect(tickets).toBeDefined();
  expect(tickets!.price).toEqual(20);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'aslkdfj',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 30,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'eraoeraoe',
      price: -10,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'aslkdfj',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'helloworld',
      price: 30,
    })
    .expect(200);

  const tickets = await Ticket.findOne({ _id: response.body.id });
  expect(tickets).toBeDefined();
  expect(tickets!.price).toEqual(30);
  expect(tickets!.title).toEqual('helloworld');
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'aslkdfj',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'helloworld',
      price: 30,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
