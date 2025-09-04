import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
  }

  res.status(statusCode).json({
    message,
    success: false,
    error: err,
  });
};
