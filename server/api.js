import {Router} from 'express';
import {Snippet} from './models';

const api = Router();

//api.get('/', (req, res) => res.json({version: '1.0'}));

api.post('/users', (req, res) => {
  res.json({message: 'TODO'});
});

api.post('/users/:id/login', (req, res) => {
  res.json({message: 'TODO'});
});

api.post('/users/:id/logout', (req, res) => {
  res.json({message: 'TODO'});
});

api.get('/bookmarks/:id', (req, res) => {
  res.json({message: 'TODO'});
});

api.post('/bookmarks', (req, res) => {
  res.json({message: 'TODO'});
});

api.put('/bookmarks/:id', (req, res) => {
  res.json({message: 'TODO'});
});

api.delete('/bookmarks/:id', (req, res) => {
  res.json({message: 'TODO'});
});

export default api;
