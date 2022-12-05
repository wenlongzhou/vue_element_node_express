import { Response } from 'express'
import { AppError } from './appError'

class ErrorHandler {
  public handleError(err: Error | AppError, res?: Response) {
    if (err.name === 'UnauthorizedError') {
      res.status(200).json({
        code: 401,
        message: 'invalid token',
      })
    } else if (err instanceof AppError && res) {
      res.status(200).json({
        code: 400,
        message: err.message,
      })
    } else {
      // log ...
      console.log(err);

      res.status(500).json({
        message: '服务器处理异常',
      })
    }
  }
}

export const errorHandler = new ErrorHandler()