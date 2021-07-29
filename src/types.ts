import { Request } from 'express';

export interface ExtRequest extends Request {
  rawBody: string;
}
