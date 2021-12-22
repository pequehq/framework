export const DECORATORS = {
  metadata: {
    TEST_PROPERTIES: 'test_properties',
    CONTROLLER: 'prefix',
    ROUTES: 'routes',
    BODY: 'body',
    PARAMETERS: 'parameters',
    HEADERS: 'headers',
    REQUEST: 'request',
    RESPONSE: 'response',
    QUERY: 'queries',
    COOKIES: 'cookies',
    SESSION: 'session',
    WEBSOCKETS: {
      CONFIG: 'websocket_config',
      SERVER: 'websocket_server'
    },
    swagger: {
      ROUTES: 'swagger_route',
      DTO_CLASS: 'swagger_dto-class',
      DTO_PROPERTY: 'swagger_dto-property',
      OPERATION_ID: 'swagger_operation-ip',
      SUMMARY: 'swagger_summary',
      PARAMETERS: 'swagger_parameters',
      REQUEST_BODY: 'swagger_request-body',
      TAGS: 'swagger_tags',
      CONTROLLER: 'swagger_controller',
    },
    events: {
      ON_EVENT: 'on_event',
    },
    SCHEDULER: 'scheduler',
  },
};
