const findAllNetworksQuery = `SELECT 
    m.network_name as "networkName"
FROM
    meta m`;

export { findAllNetworksQuery };
