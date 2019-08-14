import './style.css';
import Web3 from "web3";
import supplyChainArtifact from "../../build/contracts/SupplyChain.json";


const App = {
  web3: null,
  admin: null,
  meta: null,
  originFarmerID: null,
  distributorID: null,
  retailerID: null,
  consumerID: null,



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
      
      // this.refreshBalance();
      await this.setOwners(accounts);
      this.setForm();
      this.readForm();
      this.initSupplyChain();
      
    } catch (error) {
      console.error("Could not connect to contract or chain.",error);
    }
  },

  initSupplyChain: async function () {
    App.fetchItemBufferOne();
    App.fetchItemBufferTwo();
    App.fetchEvents();
    App.bindEvents();
  },


  bindEvents: function() {
    $(document).on('click',App.handleButtonClick);
  },

  handleButtonClick: async function(event) {
    event.preventDefault();
    let processId = parseInt($(event.target).data('id')); 
    console.log(`processId: ${processId}`);
    switch(processId) {
      case 1:
        return await App.harvestItem(event);
      case 2:
        return await App.processItem(event);
      case 3:
        return await App.packItem(event);
      case 4:
        return await App.sellItem(event);
      case 5:
        return await App.buyItem(event);
      case 6:
        return await App.shipItem(event);
      case 7:
        return await App.receiveItem(event)
      case 8:
        return await App.purchaseItem(event)
      case 9:
        return await App.fetchItemBufferOne();
        break;
      case 10:
        return await App.fetchItemBufferTwo();
        break
    }
  },

  setOwners: async function(accounts) {
    this.admin = accounts[0];
    this.originFarmerID = accounts[1];
    this.distributorID = accounts[2];
    this.retailerID = accounts[3];
    this.consumerID = accounts[4];
    const {addFarmer,addDistributor,addRetailer,addConsumer} = this.meta.methods;
    let result;
    try {
      result = await addFarmer(this.originFarmerID).send({from: this.admin});
      console.log("addFarmer: ",result);
    } catch(error) {
      console.log("addFarmer: ",error);
    }

    try {
      result = await addRetailer(this.retailerID).send({from: this.admin});
      console.log("addRetailer: ",result);
    } catch (error) {
      console.log("addRetailer: ",error);
    }

    try {
      result = await addConsumer(this.consumerID).send({from: this.admin});
      console.log("addConsumer: ",result);
    }catch(error) {
      console.log("addConsumer: ",error);
    }


  },
  setForm: function() {
    $("#ownerID").val(this.admin); 
    $("#originFarmerID").val(this.originFarmerID); 
    $("#distributorID").val(this.distributorID); 
    $("#retailerID").val(this.retailerID); 
    $("#consumerID").val(this.consumerID); 
  },

  readForm: function () {
    App.sku = $("#sku").val();
    App.upc = $("#upc").val();
    App.ownerID = $("#originFarmerID").val(); // admin shouldn't be harvesting..
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

  harvestItem: async function(event) {  
    event.preventDefault();
    let processId = parseInt($(event.target).data('id'));
    const {harvestItem } = this.meta.methods;
    this.setStatus("Initiating harvestItem transaction... (please wait)");
    this.readForm();
    let result;
    try {
      result = await harvestItem(
        App.upc,
        App.ownerID,
        App.originFarmName,
        App.originFarmInformation,
        App.originFarmLatitude,
        App.originFarmLongitude,
        App.productNotes
      ).send({from: App.originFarmerID, gas: 300000});
      console.log('harvestItem',result);
      this.showToastInfo("harvestItem transaction complete!");
      this.setStatus("harvestItem transaction complete!");
    } catch (error) {
      this.showToastError(error);
      console.log(error);
      this.setStatus("harvestItem transaction failed!");
    }

  },

  processItem: async function(event) {
    event.preventDefault();
    const {processItem } = this.meta.methods;
    this.readForm();
    let result;
    this.setStatus("Initiating processItem transaction... (please wait)");
    try {
      result = await processItem(
        App.upc,
      ).send({from: App.originFarmerID, gas: 300000});
      console.log('processItem',result);
      this.showToastInfo("processItem transaction complete!");
      this.setStatus("processItem transaction complete!");
    } catch(error) {
      this.showToastError(error);
      console.log(error);
      this.setStatus("processItem transaction failed!");
    }
  },

  packItem: async function(event) {
    event.preventDefault();
    const {packItem } = this.meta.methods;
    this.readForm();
    let result;
    this.setStatus("Initiating packItem transaction... (please wait)");
    try {
      result = await packItem(
        App.upc,
      ).send({from: App.originFarmerID, gas: 300000});
      console.log('packItem',result);
      this.showToastInfo("packItem transaction complete!");
      this.setStatus("packItem transaction complete!");
    } catch(error) {
      this.showToastError(error);
      console.log(error);
      this.setStatus("packItem transaction failed!");
    }
  },

  sellItem: async function(event) {
    event.preventDefault();
    const {sellItem } = this.meta.methods;
    const price = this.web3.utils.toWei("1","ether");
    this.readForm();
    this.setStatus("Initiating sellItem transaction... (please wait)");
    let result;
    try {
      result = await sellItem(App.upc,price).send({from: App.originFarmerID, gas: 300000});
      console.log('sellItem',result);
      this.showToastInfo("sellItem transaction complete!");
      this.setStatus("sellItem transaction complete!");
    }catch (error) {
      this.showToastError(error);
      console.log(error);
      this.setStatus("sellItem transaction failed!");
    }
  },

  buyItem: async function(event) {
    event.preventDefault();
    const {buyItem } = this.meta.methods;
    this.readForm();
    let result;
    const price = this.web3.utils.toWei("2","ether");
    this.setStatus("Initiating buyItem transaction... (please wait)");
    try {
      result = await buyItem(
        App.upc,
      ).send({from: App.distributorID,value: price, gas: 300000});
      console.log('buyItem',result);
      this.showToastInfo("buyItem transaction complete!");
      this.setStatus("buyItem transaction complete!");
    } catch(error) {
      this.showToastError(error);
      console.log(error);
      this.setStatus("buyItem transaction failed!");
    }
  },
  
  shipItem: async function(event) {
    event.preventDefault();
    const {shipItem } = this.meta.methods;
    this.readForm();
    this.setStatus("Initiating shipItem transaction... (please wait)");
    let result;
    try {
      result = await shipItem(App.upc).send({from: App.distributorID, gas: 300000});
      console.log('shipItem',result);
      this.setStatus("shipItem transaction complete!");
      this.showToastInfo("shipItem transaction complete!");
    }catch (error) {
      this.showToastError(error);
      console.log(error);
      this.setStatus("shipItem transaction failed!");
    }
  },

  receiveItem: async function(event) {
    event.preventDefault();
    const {receiveItem } = this.meta.methods;
    this.readForm();
    this.setStatus("Initiating receiveItem transaction... (please wait)");
    let result;
    try {
      result = await receiveItem(App.upc).send({from: App.retailerID, gas: 300000});
      console.log('receiveItem',result);
      this.setStatus("receiveItem transaction complete!");
      this.showToastInfo("receiveItem transaction complete!");
    }catch (error) {
      this.showToastError(error);
      console.log(error);
      this.setStatus("receiveItem transaction failed!");
    }
  },

  purchaseItem: async function(event) {
    event.preventDefault();
    const {purchaseItem } = this.meta.methods;
    this.readForm();
    this.setStatus("Initiating purchaseItem transaction... (please wait)");
    let result;
    try {
      result = await purchaseItem(App.upc).send({from: App.consumerID, gas: 300000});
      console.log('purchaseItem',result);
      this.showToastInfo("purchadeItem transaction complete!");
      this.setStatus("purchaseItem transaction complete!");
    }catch (error) {
      this.showToastError(error);
      console.log(error);
      this.setStatus("purchaseItem transaction failed!");
    }
  },


  fetchItemBufferOne: async function () {
    App.upc = $('#upc').val();
    console.log('upc', App.upc);
    const { fetchItemBufferOne} = this.meta.methods;
    let result =  await fetchItemBufferOne(App.upc).call();
    console.log('fetchItemBufferOne', result);
    this.showToastInfo("fetchData1 transaction complete!");
    $("#sku").val(result[0]);
    $("#ownerID").val(result[2]);
    /*
    if (!/^(0x)0{40}/.test(result[2])) {
      $("#ownerID").val(result[2]);
    } else {
      console.log("skipping setting ownerID to a null address");
    }
    */
    $("#ftc-item").text(JSON.stringify(result));
    this.fetchPastEvents(App.upc);
  },

  fetchItemBufferTwo: async function() {
    App.upc = $('#upc').val();
    console.log('upc', App.upc);
    const { fetchItemBufferTwo} = this.meta.methods;
    let result =  await fetchItemBufferTwo(App.upc).call();
    console.log('fetchItemBufferTwo', result);
    this.showToastInfo("fetchData2 transaction complete!");
    let state = parseInt(result[5]); 
    switch (state) {
      case 0: 
        $("#state").val("New");
        break
      case 1: 
        $("#state").val("Harvested");
        break
      case 2: 
        $("#state").val("Processed");
        break
      case 3: 
        $("#state").val("Packed");
        break
      case 4: 
        $("#state").val("ForSale");
        break
      case 5: 
        $("#state").val("Sold");
        break
      case 6: 
        $("#state").val("Shipped");
        break
      case 7: 
        $("#state").val("Received");
        break
      case 8: 
        $("#state").val("Purchased");
        break
      default:
        $("#state").val("Unknown");
        break
    }
  
    // $("#ftc-item").text(JSON.stringify(result));
  },

  fetchPastEvents: async function(upc) {
    // There appears to be an bug in web3
    // filtering doesn't work when 'allEvents' is specified
    let events
    try {
      events = await this.meta.getPastEvents(
        "allEvents", {fromBlock: 0 }
      );

      events = events.filter((ev) => ev.returnValues.upc == upc);
      if (events) {
        $("#ftc-events").text("");

        events = Array.isArray(events) ? events : [events];
        events.forEach(function(log) {
          $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
      }
    }catch(error) {
      console.log("fetchPastEvents: ",error);
    }
  },

  fetchEvents: function() {
    var events = this.meta.events.allEvents(function(err, log){
      if (!err) {
        $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
      } else {
        console.log("fetchEvents: ",err);
      }
    });

  },
  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  showToastInfo: function(message) {
    const snackbar = $("#snackbar");
    snackbar.text(message);
    snackbar.addClass("show-info");
    setTimeout(function(){ snackbar.removeClass("show-info"); }, 3000);

  },
  showToastError: function(message) {
    const snackbar = $("#snackbar");
    snackbar.text(message);
    snackbar.addClass("show-error");
    setTimeout(function(){ snackbar.removeClass("show-error"); }, 3000);
  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      // new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
      new Web3.providers.WebsocketProvider("ws://127.0.0.1:7545"),
    );
  }

  App.start();
});
