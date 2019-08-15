# Yet Another Supply Chain and Data Auditing

Ethereum Dapp for Tracking Items through Supply Chain

This repository containts an Ethereum DApp that demonstrates a Supply Chain flow between a Seller and Buyer and how to manage and audit blockchain product ownership as product is transferred down the supply chain. The user story is similar to any commonly used supply chain process. A Seller can add items to the inventory system stored in the blockchain. A Buyer can purchase such items from the inventory system. Additionally a Seller can mark an item as Shipped, and similarly a Buyer can mark an item as Received.

The DApp User Interface when running looks like this...

![product overview](images/ftc_product_overview.png)

![farm details](images/ftc_farm_details.png)

![product details](images/ftc_product_details.png)

![product roles](images/ftc_roles_mgmt.png)

![transaction history](images/ftc_transaction_history.png)

![roles history](images/ftc_roles_history.png)

## Prerequisites

You must be familiar with the basic concepts tools related developing decentralized application on Ethereum
Blockchain.

1. Download and install [Node Version Manager]( https://github.com/nvm-sh/nvm#installation-and-update ) 
  (optional but highly recommended)

2. Download and install npm and [ nodejs ]( https://nodejs.org/en/ ). If you are using NVM, then 
  the latest version nodejs can be installed as: 
    ```
    nvm install node
    ```
3. Install [ Truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation ) v5.0.31 or higher.
    ```
    npm install -g truffle
    ```
4. Install [Ganache](https://www.trufflesuite.com/docs/ganache/quickstart)  development blockchain.

5. Install the command line version of Ganache as well.
    ```
    npm install -g ganache-cli
    ```

6. Install dotenv npm package. We will use this tool to store and use truffle wallet provider related credentials to deploy contracts to testnets (e.g., Rinkeby). More on this later.
    ```
    npm install -g dotenv
    ```


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

1. Clone this repository. 
    




## Requirements

* Truffle v5.0.31 (core: 5.0.31)
* Solidity v0.5.0 (solc-js)
* Node v12.8.0
* Web3.js v1.2.1
* (Optional) Node Version Manager v0.34.0



## Shortcomings
- same price for distributor, retailer and consumer? Disclose the right price to the right role? 
  what about different set of prices for different group of retailers, consumers etc.

