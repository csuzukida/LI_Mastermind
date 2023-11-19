import { Session } from 'express-session';

/**
 * Needed to extend the express-session Session interface to allow for userId
 * @example
 * import { ISession } from 'path/to/ISession';
 * (req.session as ISession).userId = user._id.toString();
 */

export interface ISession extends Session {
  userId?: string | number;
}
