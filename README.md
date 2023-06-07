# Ajna Pools Subgraph

[Ajna](https://www.ajna.finance/) is a non-custodial, peer-to-peer, permissionless lending, borrowing and trading system that requires no governance or external price feeds to function.

This Subgraph ingests contracts used by the Ajna Protocol. Core contracts can be found [here](https://github.com/ajna-finance/contracts).


## Installation
Install using `yarn`, because `npm` has an issue installing [Gluegun](https://github.com/infinitered/gluegun).
```
sudo yarn global add @graphprotocol/graph-cli
yarn install
```

Set `ETH_NETWORK` environment for your target network to `network:endpoint.  For example, 
 `ETH_NETWORK=goerli:https://eth-goerli.g.alchemy.com/v2/<your_api_key_here>` configures your environment for Goerli using an Alchemy node.  This environment variable is not needed when indexing a local ganache testnet.

If you will change ABIs, please install `jq`.


## Querying
The dockerized deployment offers a query UI at http://localhost:8000/subgraphs/name/ajna/graphql.

Below are some examples of queries that can be made to the Ajna Subgraph.

List pools showing their tokens and how many transactions have been performed on them:
```
{
  pools {
    id
    txCount
    quoteToken {
      id
      symbol
    }
    collateralToken {
      id
      symbol
    }
  }
}
```

Positions for a specific lender across all pools:
```
{
  accounts(where: {id:"0x4eb7f19d6efcace59eaed70220da5002709f9b71"}) {
    id
    lends {
      pool {
        id
        quoteToken {
          symbol
        }
        collateralToken {
          symbol
        }
      }
      bucket {
        bucketIndex
        deposit
        collateral
      }
    }
  }
}
```

Details for a specific pool:
```
{
  pool(id: "0xc2b64ca87090fe79786a8773009d7fb1288d3db1") {
    id
    quoteToken { symbol }
    collateralToken { symbol }
    poolSize
    debt
    actualUtilization
    htp
    hpb
    lup
    reserves
    borrowRate
    lendRate
    totalAjnaBurned
    totalInterestEarned
  }
}
```


## Known issues
- TheGraph tooling does not handle ERC-55 checksum addresses elegantly.  Please convert addresses to lowercase when filtering.
- Support for ERC-721 collateral pools has not been implemented.
- Integration testing has not been completed.


## Design
### Types

| Value              | Type         |
| ------------------ | ------------ |
| Prices and amounts | `BigDecimal` |
| Bucket indicies    | `Int` (*u32* in AssemblyScript, *number* in TypeScript) |
| Counts and timestamps | `BigInt`  |

### Persistence / Rentention Policy

This subgraph does not retain a history of `Lends` and `Loans`.  `Lends` are discarded when all LP balance has been redeemed.  `Loans` are discarded when the lender has no debt and no collateral.

[Time-travel queries](https://thegraph.com/docs/en/querying/graphql-api/#time-travel-queries) can be used to query historical state.

This subgraph will retain a list of `Pools`, even if they have no liquidity. Pools will also retain a history of `LiquidationAuctions` and `ReserveAuctions`, which can be filtered by status.


## Development and Deployment
Commands for adding new data sources to the subgraph are listed in the [add-commands.txt](./add-commands.txt) file.

Once data sources have been added, entites can be modified in the [schema.graphql](./schema.graphql) file. After any update, the following commands must be run to ensure the new types are available for the event handlers.  Before running, ensure `ETH_NETWORK` is set as prescribed above.
```
yarn codegen
yarn build --network [NETWORK_NAME]
```
Upon building, `subgraph.yaml` will be updated with contract addresses and start blocks for the specified network.

- To connect to a public network, `[NETWORK_NAME]` should be defined in `networks.json` and specified by `ETH_NETWORK`.  To start, run `docker-compose up`.  
- To run and index a local testchain, run `docker-compose -f ganache-indexer.yml up`.  This will start an instance of ganache with a canned deployment of Ajna, and an indexer pointed at it.  No need to configure `ETH_NETWORK`.

Once _graph-node_ is running, deploy the subgraph with:
```
yarn create-local
yarn deploy-local
```

For rough estimates, it takes ~15 minutes to index a month worth of data from an empty container.  Redeployment to an existing container takes 2-3 minutes to sync up.

Instructions on creating your own deployment are available in the [Graph Protocols Documentation](https://thegraph.com/docs/en/cookbook/quick-start/).

### Tests
Unit tests are written using the [Matchstick unit testing framework](https://github.com/LimeChain/matchstick/blob/main/README.md).  Unit tests do not guarantee your subgraph is deployable or functional.

Run the Matchstick tests by executing: 
```
yarn test
```

### Maintenance
To update for new release candidates:
1. Update ABIs using the provided `copy-abis.sh` script.  This script requires `jq` be installed.  Note `codegen` and `build` commands are not sensitive to ABI formatting, but deployment is.  ABIs formatted by Ethers.js will not work.  ABIs generated by `graph add` will not work.  In the ABI, note that all _output_ parameters must have a `name` field.  It may be blank, but the field must exist.
2. Update addresses in `networks.json` and `src/utils/constants.ts`.
3. Run `yarn run codegen` to find and resolve errors in code generation.
4. Review contract changes, adjusting subgraph and schema accordingly.  
5. Run `yarn run build [NETWORK_NAME]` to update `subgraph.yaml`.  Resolve compliation errors.  
6. Update handlers, test mocks, and unit tests.  Run `yarn run test` to find and resolve issues.
7. Start the dockerized environment and perform a local deployment to confirm functionality.

To clean out container data and autogenerated code, run the `clean.sh` script.


### Debugging
To check health, visit http://localhost:8030/graphql/playground and paste the following query:
```
{
  indexingStatuses(subgraphs: ["Qm..."]) {
    subgraph
    synced
    health
    entityCount
    fatalError {
      handler
      message
      deterministic
      block {
        hash
        number
      }
    }
    chains {
      chainHeadBlock {
        number
      }
      earliestBlock {
        number
      }
      latestBlock {
        number
      }
    }
  }
}
```
Replace `Qm...` with the `subgraph_id` from logs, and query.  If the indexer has failed, this may reveal the error.

The following red herrings occassionally appear in logs:
- `ERRO registering metric [deployment_handler_execution_time] failed because it was already registered`
- `WARN Bytes contain invalid UTF8. This may be caused by attempting to convert a value such as an address that cannot be parsed to a unicode string. You may want to use 'toHexString()' instead.`
These sometimes disappear upon redeployment with no changes.