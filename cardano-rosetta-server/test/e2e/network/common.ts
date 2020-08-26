export const generateNetworkPayload = (blockchain: string, network: string): Components.Schemas.NetworkRequest => ({
  // eslint-disable-next-line camelcase
  network_identifier: {
    blockchain,
    network
  }
});
