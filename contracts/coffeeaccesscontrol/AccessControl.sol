pragma solidity ^0.5.8;

import './ConsumerRole.sol';
import './DistributorRole.sol';
import './FarmerRole.sol';
import './RetailerRole.sol';


contract AccessControl is FarmerRole, DistributorRole, RetailerRole, ConsumerRole {
  constructor() public {}
}

