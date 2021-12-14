import { HTTP_STATES } from '../models/constants/http-states';

export const guardExecutor = (guard: any) => {
  return async (req, res, next) => {
    const canExecute = await guard.canExecute({ req, res });
    if (canExecute) {
      next();
    } else {
      res.status(HTTP_STATES.HTTP_401);
      res.send({
        message: 'Route is unauthorized.',
      });
    }
  };
};