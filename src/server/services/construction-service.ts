export interface ConstructionService {
  constructionDerive(
    request: Components.Schemas.ConstructionDeriveRequest
  ): Promise<Components.Schemas.ConstructionDeriveResponse | Components.Schemas.Error>;

  constructionPreprocess(
    request: Components.Schemas.ConstructionDeriveRequest
  ): Promise<Components.Schemas.ConstructionDeriveResponse | Components.Schemas.Error>;

  constructionMetadata(
    request: Components.Schemas.ConstructionMetadataRequest
  ): Promise<Components.Schemas.ConstructionCombineResponse | Components.Schemas.Error>;

  constructionPayloads(
    request: Components.Schemas.ConstructionPayloadsRequest
  ): Promise<Components.Schemas.ConstructionPayloadsResponse | Components.Schemas.Error>;

  constructionCombine(
    request: Components.Schemas.ConstructionCombineRequest
  ): Promise<Components.Schemas.ConstructionCombineResponse | Components.Schemas.Error>;

  constructionParse(
    request: Components.Schemas.ConstructionParseRequest
  ): Promise<Components.Schemas.ConstructionParseResponse | Components.Schemas.Error>;

  constructionHash(
    request: Components.Schemas.ConstructionHashRequest
  ): Promise<Components.Schemas.TransactionIdentifierResponse | Components.Schemas.Error>;

  constructionSubmit(
    request: Components.Schemas.ConstructionSubmitRequest
  ): Promise<Components.Schemas.TransactionIdentifierResponse | Components.Schemas.Error>;
}

const constructionService: ConstructionService = {
  async constructionDerive(request): Promise<Components.Schemas.ConstructionDeriveResponse | Components.Schemas.Error> {
    return {
      code: 0,
      message: 'string',
      retriable: true
    };
  },
  async constructionPreprocess(request) {
    return {
      code: 1,
      message: 'string',
      retriable: true
    };
  },
  async constructionMetadata(request) {
    return {
      code: 2,
      message: 'string',
      retriable: true
    };
  },
  async constructionPayloads(request) {
    return {
      code: 3,
      message: 'string',
      retriable: true
    };
  },
  async constructionCombine(request) {
    return {
      code: 4,
      message: 'string',
      retriable: true
    };
  },
  async constructionParse(request) {
    return {
      code: 5,
      message: 'string',
      retriable: true
    };
  },
  async constructionHash(request) {
    return {
      code: 6,
      message: 'string',
      retriable: true
    };
  },
  async constructionSubmit(request) {
    return {
      code: 7,
      message: 'string',
      retriable: true
    };
  }
};

export default constructionService;
