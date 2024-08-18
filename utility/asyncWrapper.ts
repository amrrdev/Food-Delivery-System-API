import express, { Request, Response, NextFunction } from "express";

type AsyncHandlerFunc = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export default (fn: AsyncHandlerFunc) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
