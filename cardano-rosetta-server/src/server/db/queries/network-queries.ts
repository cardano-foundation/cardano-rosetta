const findAllNetworksQuery = `SELECT 
    m.network_name as "networkName"
FROM
    meta m`;

const findNetworkByNetworkName = `SELECT 
    COUNT(*) 
FROM 
    meta m 
WHERE m.network_name = $1`;

export { findAllNetworksQuery, findNetworkByNetworkName };
