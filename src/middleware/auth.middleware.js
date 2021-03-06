import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET } = process.env;
// verifica se o usuário está autenticado
export const AuthMiddleware = (request, response, next) => {
  const { authorization } = request.headers;

  // middleware será passado nessas requisições
  if (
    request.url === '/api/login' ||
    (request.url === '/api/users' && request.method === 'POST')
  ) {
    return next();
  }

  if (!authorization) {
    return response.status(401).json({ message: 'Authoriaztion not found' });
  }
  const [, token] = authorization.split(' '); // apenas o token será retirado do authorization, pois está depois do espaço

  try {
    const payload = jsonwebtoken.verify(token, JWT_SECRET);

    request.loggedUser = payload;
  } catch (error) {
    return response.status(401).json({ message: 'Token Invalid' });
  }

  return next();
};
