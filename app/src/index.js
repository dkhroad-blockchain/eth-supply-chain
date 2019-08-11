import './style.css';
import Web3 from "web3";
import supplyChainArtifact from "../../build/contracts/SupplyChain.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = supplyChainArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        supplyChainArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      
      // this.refreshBalance();
      this.readForm();
      this.initSupplyChain();
      
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  initSupplyChain: async function () {
    this.fetchItemBufferOne();
    this.fetchItemBufferTwo();
    this.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click',this.handleButtonClick);
  },

  handleButtonClick: async function(event) {
    event.preventDefault();
    let processId = parseInt($(event.target).data('id')); 
    console.log(`processId: ${processId}`);
  },

  readForm: function () {
    App.sku = $("#sku").val();
    App.upc = $("#upc").val();
    App.ownerID = $("#ownerID").val();
    App.originFarmerID = $("#originFarmerID").val();
    App.originFarmName = $("#originFarmName").val();
    App.originFarmInformation = $("#originFarmInformation").val();
    App.originFarmLatitude = $("#originFarmLatitude").val();
    App.originFarmLongitude = $("#originFarmLongitude").val();
    App.productNotes = $("#productNotes").val();
    App.productPrice = $("#productPrice").val();
    App.distributorID = $("#distributorID").val();
    App.retailerID = $("#retailerID").val();
    App.consumerID = $("#consumerID").val();

    console.log(
      App.sku,
      App.upc,
      App.ownerID, 
      App.originFarmerID, 
      App.originFarmName, 
      App.originFarmInformation, 
      App.originFarmLatitude, 
      App.originFarmLongitude, 
      App.productNotes, 
      App.productPrice, 
      App.distributorID, 
      App.retailerID, 
      App.consumerID
    );
  },
  refreshBalance: async function() {
    const { getBalance } = this.meta.methods;
    const balance = await getBalance(this.account).call();

    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;
  },

  sendCoin: async function() {
    const amount = parseInt(document.getElementById("amount").value);
    const receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    const { sendCoin } = this.meta.methods;
    await sendCoin(receiver, amount).send({ from: this.account });

    this.setStatus("Transaction complete!");
    this.refreshBalance();
  },

  fetchItemBufferOne: async function () {
    App.upc = $('#upc').val();
    console.log('upc', App.upc);
    const {fetchItemBufferOne} = this.meta.methods;
    let result =  await fetchItemBufferOne(App.upc);
    console.log('fetchItemBufferOne', result);
    $("#ftc-item").text(result);
  },

  fetchItemBufferTwo: async function() {
    App.upc = $('#upc').val();
    console.log('upc', App.upc);
    const {fetchItemBufferTwo} = this.meta.methods;
    let result =  await fetchItemBufferTwo(App.upc);
    console.log('fetchItemBufferOne', result);
    $("#ftc-item").text(result);
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
