export interface SwaggerOptionsInterface {
  folder: string;
  info: {
    title: string;
    description: string;
    contacts: {
      name: string;
      email: string;
    };
    version: string;
  };
  servers: [{ url: string }];
  tags: [{
    name: string;
    description: string
  }];
}
