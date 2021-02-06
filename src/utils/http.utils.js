const executeAsync = ({fn, req, res}) => {
  return Promise.resolve().then(() => fn.call(this, req, res));
};

const returnJsonResponse = ({data = {}, maskable = false, res}) => {
  const {statusCode = 200} = data;
  const {
    context: {id: contextId, sessionId} = {},
    portability,
    portabilityEcho
  } = res.locals;
  let responseData;

  if (Array.isArray(data)) {
    responseData = data;
  } else {
    responseData = maskable ? {} : {...data, contextId, sessionId};
  }

  if (portabilityEcho) {
    responseData.portability = portability;
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(statusCode).send(responseData);
  res.end();
};

const restFunction = (fn, maskable) => (req, res) => {
  return executeAsync({fn, req, res})
    .then(data => {
      returnJsonResponse({data, maskable, res});
    })
    .catch(error => console.log(error));
};

module.exports = {
  restFunction
};
