/* eslint-disable complexity */
/* eslint-disable max-statements*/
import { CatalystLabels, OperationType, OperatorType } from '../../../../utils/constants';
import { CoinIdentifier, SearchFilters } from '../../../../models';
import { isStakeAddress } from '../../../../utils/cardano/addresses';

const voteRegistrationJoin = `
      JOIN tx_metadata AS metadata_sig
        ON metadata_sig.tx_id = tx.id 
          AND metadata_sig.key = ${CatalystLabels.SIG}
      JOIN tx_metadata AS metadata_data
        ON metadata_data.tx_id = tx.id
          AND metadata_data.key = ${CatalystLabels.DATA}
      `;

const queryAndTypeMapping: { [type: string]: string } = {
  [OperationType.OUTPUT]: 'JOIN tx_out ON tx_out.tx_id = tx.id',
  [OperationType.INPUT]: 'JOIN tx_in ON tx_in.tx_in_id = tx.id',
  [OperationType.POOL_REGISTRATION]: 'JOIN pool_update pu ON pu.registered_tx_id = tx.id',
  [OperationType.POOL_REGISTRATION_WITH_CERT]: 'JOIN pool_update pu ON pu.registered_tx_id = tx.id',
  [OperationType.POOL_RETIREMENT]: 'JOIN pool_retire pr ON tx.id = pr.announced_tx_id',
  [OperationType.STAKE_DELEGATION]: 'JOIN delegation d ON d.tx_id = tx.id',
  [OperationType.STAKE_KEY_DEREGISTRATION]: 'JOIN stake_deregistration sd ON tx.id = sd.tx_id',
  [OperationType.STAKE_KEY_REGISTRATION]: 'JOIN stake_registration sr ON tx.id = sr.tx_id',
  [OperationType.VOTE_REGISTRATION]: voteRegistrationJoin,
  [OperationType.WITHDRAWAL]: 'JOIN withdrawal w ON w.tx_id = tx.id'
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNullOrUndefined = (object: any) => object === null || object === undefined;

export const TYPES_TO_IGNORE = [OperationType.INPUT, OperationType.OUTPUT];

export const generateInputCoinWhereCondition = (coinIdentifier: CoinIdentifier) =>
  `(tx_out."index" = ${coinIdentifier.index} AND (tx.hash = $1 OR tx_out_tx.hash = $1))`;
export const generateOutputCoinWhereCondition = (coinIdentifier: CoinIdentifier) =>
  `(tx_out."index" = ${coinIdentifier?.index} AND tx.hash = $1)`;

export const generateTxQuery = ({ from, offset, limit }: { from: string; offset: number; limit: number }) => `
  WITH tx_query AS (
    select
      DISTINCT tx.id,
        tx."size",
        tx.fee,
        tx.hash,
        tx.valid_contract,
        tx.block_id,
        tx.script_size,
        block.hash AS block_hash,
        block.block_no AS block_no
      ${from}
      ORDER BY id DESC
      LIMIT ${limit}
      OFFSET ${offset}
    )
    SELECT 
      hash,
      fee,
      size,
      valid_contract AS "validContract",
      script_size AS "scriptSize",
      block_hash AS "blockHash",
      block_no as "blockNo"
    FROM tx_query`;

export const buildFromSentenceWithInputsAndOutputs = ({
  maxBlock,
  inputsJoins,
  outputsJoins,
  inputsWhere,
  outputsWhere
}: {
  inputsJoins: string;
  outputsJoins: string;
  inputsWhere: string;
  outputsWhere: string;
  maxBlock?: number;
}) => `
          FROM
                (
                  SELECT
                      tx.id,
                      tx."size",
                      tx.fee,
                      tx.hash,
                      tx.valid_contract,
                      tx.block_id,
                      tx.script_size
                  FROM tx_out
                  JOIN tx_in
                    ON tx_out.tx_id = tx_in.tx_out_id
                    AND tx_in.tx_out_index = tx_out.index
                  JOIN tx ON tx.id = tx_in.tx_in_id
                  ${inputsJoins}
                  ${inputsWhere}
                  UNION
                  SELECT
                      tx.id,
                      tx."size",
                      tx.fee,
                      tx.hash,
                      tx.valid_contract,
                      tx.block_id,
                      tx.script_size
                  FROM tx_out
                  JOIN tx ON tx_out.tx_id = tx.id
                  ${outputsJoins}
                  ${outputsWhere}
                  ) as tx
                JOIN block ON block.id = tx.block_id ${maxBlock ? ` AND block.block_no <= ${maxBlock}` : ''}`;

/* eslint-disable-next-line sonarjs/cognitive-complexity */
export const withFilters = (filters: SearchFilters, isTotalCount: boolean): string => {
  const {
    transactionHash,
    status,
    coinIdentifier,
    limit,
    offset,
    currencyIdentifier,
    address,
    maxBlock,
    type
  } = filters;
  const whereConditions = [];
  let whereSentence = '';
  let joinSentence = '';
  let outputsWhere = '';
  let inputsWhere = '';
  let outputsJoins = '';
  let inputsJoins = '';

  const joinTables = [];
  if (!isNullOrUndefined(status)) {
    whereConditions.push(`tx.valid_contract = ${status}`);
  }
  if (transactionHash && !coinIdentifier) {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    whereConditions.push('tx.hash = $1');
  }
  if (currencyIdentifier) {
    const { policy, symbol } = currencyIdentifier;
    joinTables.push(
      `ma_tx_out ON ma_tx_out.tx_out_id = tx_out.id 
          JOIN multi_asset AS asset ON asset.id = ma_tx_out.ident`
    );
    whereConditions.push(
      `
            (asset.name= DECODE('${symbol}', 'hex') AND asset.policy = DECODE('${policy}', 'hex'))
          `
    );
  }
  if (address) {
    const isStake = isStakeAddress(address);
    isStake && joinTables.push('stake_address ON tx_out.stake_address_id = stake_address.id');
    whereConditions.push(`${isStake ? `stake_address.view = '${address}'` : `tx_out.address = '${address}'`}`);
  }
  if (whereConditions.length > 0) {
    whereSentence = `WHERE ${whereConditions.join(` ${OperatorType.AND} `)}`;
  }
  if (joinTables.length > 0) {
    joinSentence = `JOIN ${joinTables.join(' JOIN ')}`;
  }
  const requiresToQueryInputsAndOutputs = coinIdentifier || currencyIdentifier || address;
  if (requiresToQueryInputsAndOutputs) {
    outputsWhere = inputsWhere = whereSentence;
    outputsJoins = joinSentence + (type && type !== OperationType.OUTPUT ? ` ${queryAndTypeMapping[type]} ` : '');
    inputsJoins =
      joinSentence + (type && !TYPES_TO_IGNORE.includes(type as OperationType) ? ` ${queryAndTypeMapping[type]} ` : '');
    if (coinIdentifier) {
      const operator = whereConditions.length > 0 ? ` ${OperatorType.AND} ` : ' WHERE ';
      outputsWhere += operator + generateOutputCoinWhereCondition(coinIdentifier);
      inputsWhere += operator + generateInputCoinWhereCondition(coinIdentifier);
      inputsJoins += ' JOIN tx AS tx_out_tx ON tx_out_tx.id = tx_in.tx_out_id ';
    }
  }
  const from = requiresToQueryInputsAndOutputs
    ? buildFromSentenceWithInputsAndOutputs({
        maxBlock,
        inputsJoins,
        outputsJoins,
        outputsWhere,
        inputsWhere
      })
    : `
  FROM tx
  JOIN block
    ON block.id = tx.block_id ${maxBlock ? ` AND block_no <= ${maxBlock}` : ''}
  ${joinSentence}
  ${type ? queryAndTypeMapping[type] : ''}
  ${whereSentence}
`;

  return isTotalCount
    ? `SELECT COUNT(DISTINCT tx.id) AS "totalCount" ${from}`
    : generateTxQuery({ from, offset, limit });
};
