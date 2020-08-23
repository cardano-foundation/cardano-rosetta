export const generateNetworkPayload = (blockchain: string, network: string) => ({
  // eslint-disable-next-line camelcase
  network_identifier: {
    blockchain,
    network
  }
});
