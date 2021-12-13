const executeFunction = (fn: any, req: any, res: any) => {
  return Promise.resolve().then(() => fn.call(this, req, res));
};

export const httpResponse = (fn: any) => (req: any, res: any) => {
  return executeFunction(fn, req, res)
    .then((data) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(data.statusCode || 200).send(Array.isArray(data) ? data : { ...data });
      res.end();
    })
    .catch((error) => console.log(error));
};
