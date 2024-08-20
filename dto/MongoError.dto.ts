export interface Mongo11000Error extends Error {
  code: number;
  keyValue: Record<string, string>;
}
