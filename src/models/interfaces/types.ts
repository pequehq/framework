export type MiddlewareHandler = any | any[];
export type ExpressMethods =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'options';
export type ParamType =
  | 'body'
  | 'header'
  | 'param'
  | 'query'
  | 'request'
  | 'response';
export type SwaggerParamType =
  | 'string'
  | 'number'
  | 'array'
  | 'object'
  | 'boolean';
export type SwaggerTags =
  | 'App'
  | 'Bookmarks'
  | 'Content'
  | 'Device'
  | 'Diagnostics'
  | 'Favourites'
  | 'Hooks'
  | 'Link'
  | 'Log'
  | 'Page'
  | 'Recommendations'
  | 'Subscriptions'
  | 'User'
  | 'Promotions'
  | 'Voucher';
export enum SwaggerSecurityType {
  BEARER = 'bearerAuth',
  OPTIONAL = '{}'
}
export type CacheServers = 'Redis';
