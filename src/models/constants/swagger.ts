export const SWAGGER = {
  refs: {
    COMPONENTS_SCHEMA: '../schemas-generated.yaml#/{{DTO}}',
    PATHS_SCHEMA: '../../../components/schemas/schemas-generated.yaml#/{{DTO}}',
    PATHS_PARAMETERS: '../../../components/parameters/_index.yaml#/',
    PATHS_REQUEST_BODIES:
      '../../../components/request-bodies/generated/{{DTO}}.yaml#/',
    PATHS_CONTROLLERS: './generated/'
  }
};
