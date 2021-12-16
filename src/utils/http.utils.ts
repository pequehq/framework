import express from 'express';

const executeFunction = (fn: any, req: express.Request, res: express.Response): Promise<any> => {
  return Promise.resolve().then(() => fn.call(this, req, res));
};

export async function httpResponse(fn: any) {
  return async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      const data = await executeFunction(fn, req, res);
      res.setHeader('Content-Type', 'application/json');
      res.status(data.statusCode || 200).send(Array.isArray(data) ? data : { ...data });
      res.end();
    } catch (error) {
      return console.log(error);
    }
  };
}
