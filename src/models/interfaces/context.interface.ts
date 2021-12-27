import express from 'express';

export interface Context {
  request: express.Request;
  response: express.Response;
}
