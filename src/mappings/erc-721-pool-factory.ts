import { PoolCreated as PoolCreatedEvent } from "../../generated/ERC721PoolFactory/ERC721PoolFactory";
import { PoolCreated, Token } from "../../generated/schema";
import { ERC721Pool } from "../../generated/templates";
import { ERC721Pool as ERC721PoolContract } from "../../generated/templates/ERC721Pool/ERC721Pool";

import { ONE_BI, ZERO_BI } from "../utils/constants";
import { addressToBytes, wadToDecimal } from "../utils/convert";
import { loadOrCreateFactory } from "../utils/pool/pool-factory";
import {
  getPoolSubsetHash,
  getRatesAndFees,
  loadOrCreatePool,
  updateTokenPools,
} from "../utils/pool/pool";
import {
  getTokenName as getTokenNameERC721,
  getTokenSymbol as getTokenSymbolERC721,
} from "../utils/token-erc721";
import {
  getTokenDecimals,
  getTokenName,
  getTokenSymbol,
  getTokenTotalSupply,
} from "../utils/token-erc20";
import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";

export function handlePoolCreated(event: PoolCreatedEvent): void {
  const poolCreated = new PoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  poolCreated.pool = event.params.pool_;
  poolCreated.poolType = "ERC721";
  poolCreated.factory = event.address;

  poolCreated.blockNumber = event.block.number;
  poolCreated.blockTimestamp = event.block.timestamp;
  poolCreated.transactionHash = event.transaction.hash;

  // record factory information
  let factory = loadOrCreateFactory(event.address, "ERC721");
  factory.poolCount = factory.poolCount.plus(ONE_BI);
  factory.txCount = factory.txCount.plus(ONE_BI);

  // instantiate pool contract
  const poolContract = ERC721PoolContract.bind(event.params.pool_);

  // get pool initial interest rate
  const interestRateResults = poolContract.interestRateInfo();
  const ratesAndFees = getRatesAndFees(event.params.pool_);

  // create Token entites associated with the pool
  const collateralTokenAddress = poolContract.collateralAddress();
  const collateralTokenAddressBytes = addressToBytes(collateralTokenAddress);
  const quoteTokenAddress = poolContract.quoteTokenAddress();
  const quoteTokenAddressBytes = addressToBytes(quoteTokenAddress);

  // decode subset tokenIds if available
  let tokenIds: Array<BigInt> = [];

  if (poolContract.isSubset()) {
    // Hex values without 0x prefix
    const hexData = event.transaction.input.toHexString().slice(2);
    const hexCollateralAddress = collateralTokenAddress.toHexString().slice(2);
    const hexQuoteAddress = quoteTokenAddress.toHexString().slice(2);

    /**************************************************************************
     ** Looking for collateralToken + quoteToken + (62 zeroes)80 combination to assume start of PoolData
     ** Required because of possible multisig or contract calls that may have different transaction data
     *************************************************************************/
    const lowercasedHexData = hexData.toLowerCase();
    const lookingFor = (hexCollateralAddress + hexQuoteAddress.padStart(64, "0") + "80".padStart(64, "0")).toLowerCase()
    const startOfPoolData = lowercasedHexData.indexOf(lookingFor);

    /**************************************************************************
     ** collateralToken length (without zeroes) + quoteToken length + (62 zeroes)80 + interestRate legth
     *************************************************************************/
    const numTokenIdsPosition = startOfPoolData + 40 + 64 * 3;

    const tokenIdsPosition = numTokenIdsPosition + 64;

    const numTokenIdsHex = hexData.substring(
      numTokenIdsPosition,
      tokenIdsPosition
    );

    const numTokenIds = I32.parseInt(numTokenIdsHex, 16);

    if (!numTokenIds) {
      log.warning("No token IDs even though this is a Subset NFT Pool: {}", [
        poolCreated.pool.toHexString(),
      ]);
    } else {
      const tokenIdsHexString = hexData.substring(
        tokenIdsPosition,
        tokenIdsPosition + 64 * numTokenIds
      );

      log.info(
        "Saving following tokenIds for the Subset NFT Pool: {}. IDs: {}",
        [poolCreated.pool.toHexString(), tokenIdsHexString]
      );

      const chunkSize = 64;

      for (let i = 0; i < tokenIdsHexString.length; i += chunkSize) {
        let hexChunk = tokenIdsHexString.substring(i, i + chunkSize);
        let bigIntValue = BigInt.fromI64(I64.parseInt(hexChunk, 16));
        tokenIds.push(bigIntValue);
      }
    }
  }

  // record token information
  let collateralToken = Token.load(collateralTokenAddressBytes);
  if (collateralToken == null) {
    // create new token if it doesn't exist already
    collateralToken = new Token(collateralTokenAddressBytes) as Token;
    collateralToken.name = getTokenNameERC721(collateralTokenAddress);
    collateralToken.symbol = getTokenSymbolERC721(collateralTokenAddress);
    collateralToken.txCount = ZERO_BI;
    collateralToken.poolCount = ONE_BI;
    collateralToken.tokenType = "ERC721";
    collateralToken.pools = [];
  } else {
    collateralToken.poolCount = collateralToken.poolCount.plus(ONE_BI);
  }
  let quoteToken = Token.load(quoteTokenAddressBytes);
  if (quoteToken == null) {
    // create new token if it doesn't exist already
    quoteToken = new Token(quoteTokenAddressBytes) as Token;
    quoteToken.name = getTokenName(quoteTokenAddress);
    quoteToken.symbol = getTokenSymbol(quoteTokenAddress);
    quoteToken.decimals = getTokenDecimals(quoteTokenAddress);
    quoteToken.totalSupply = getTokenTotalSupply(quoteTokenAddress);
    quoteToken.txCount = ZERO_BI;
    quoteToken.tokenType = "ERC20";
    quoteToken.poolCount = ONE_BI;
    quoteToken.pools = [];
  } else {
    quoteToken.poolCount = quoteToken.poolCount.plus(ONE_BI);
  }

  // create pool entity
  const pool = loadOrCreatePool(event.params.pool_);
  ERC721Pool.create(event.params.pool_); // create pool template

  // update list of pools including these tokens
  updateTokenPools(collateralToken, pool);
  updateTokenPools(quoteToken, pool);

  // record pool metadata
  pool.createdAtTimestamp = event.block.timestamp;
  pool.createdAtBlockNumber = event.block.number;
  pool.txCount = ZERO_BI;

  // record pool token information
  pool.collateralToken = collateralToken.id;
  pool.quoteToken = quoteToken.id;

  // record pool rate information
  pool.borrowRate = wadToDecimal(interestRateResults.value0);
  pool.borrowFeeRate = wadToDecimal(ratesAndFees.borrowFeeRate);
  pool.depositFeeRate = wadToDecimal(ratesAndFees.depositFeeRate);

  // record ERC721Pool tokenId information
  if (tokenIds.length > 0) {
    pool.poolType = "Subset";
    pool.subsetHash = getPoolSubsetHash(event.address, tokenIds);
  } else {
    pool.poolType = "Collection";
    pool.subsetHash = Bytes.fromHexString(
      "0x93e3b87db48beb11f82ff978661ba6e96f72f582300e9724191ab4b5d7964364"
    );
  }
  pool.tokenIdsAllowed = tokenIds;

  // add pool reference to factories' list of pools
  factory.pools = factory.pools.concat([pool.id]);

  // save entities to the store
  collateralToken.save();
  quoteToken.save();
  factory.save();
  pool.save();
  poolCreated.save();
}
