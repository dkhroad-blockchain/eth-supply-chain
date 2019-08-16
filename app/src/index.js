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
      await this.setOwners(accounts);

      $("#ftc_network_id").text(networkId);
      $("#ftc_account_id").text(this.admin);
      await this.fetchPastRoleEvents();
      
      this.setForm();
      this.readForm();
      this.initSupplyChain();
      
    } catch (error) {
      this.showToastError("Could not connect to contract or chain.",error);
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
        break;
      case 11:
        let farmerID = $("#originFarmerIDInput").val();
        if (await App.addRole("Farmer",farmerID)) {
          App.originFarmerID = farmerID;
          $("#originFarmerID").val(farmerID);
        }
        break;
      case 12:
        let distributorID = $("#distributorIDInput").val();
        if (await App.addRole("Distributor",distributorID)) {
          App.distributorID = distributorID;
          $("#distributorID").val(distributorID);
        }
        break;
      case 13:
        let retailerID = $("#retailerIDInput").val();
        if (await App.addRole("Retailer",retailerID)) {
          App.retailerID = retailerID;
          $("#retailerID").val(retailerID);
        }
        break;
      case 14:
        let consumerID = $("#consumerIDInput").val();
        if (await App.addRole("Consumer",consumerID)) {
          App.consumerID = consumerID;
          $("#consumerID").val(consumerID);
        }
        break;
    }
  },

  setOwners: async function(accounts) {
    this.admin = accounts[0];
	  if (window.ethereum || accounts.length == 1) {
			// metamask exposes only one account 
    } else { 
      if (await this.addRole("Farmer",accounts[1])) {
			  this.originFarmerID = accounts[1];
      }
      if (await this.addRole("Distributor",accounts[3])) {
        this.distributorID = accounts[2];
      }
      if (await this.addRole("Retailer",accounts[3])) {
        this.retailerID = accounts[3];
      }
      if (await this.addRole("consumer",accounts[4])) {
        this.retailerID = accounts[4];
      }
    }
	},

	addRole: async function(role,account) {
			let result;
			const {addFarmer,addDistributor,addRetailer,addConsumer} = this.meta.methods;
      let addRoleFunc;
			switch (role) {
        case "Farmer":
          addRoleFunc = addFarmer;
          break;
        case "Distributor":
          addRoleFunc = addDistributor;
          break;
        case "Retailer":
          addRoleFunc = addRetailer;
          break;
        case "Consumer":
          addRoleFunc = addConsumer;
          break;
        
			};	
			try {
				result = await addRoleFunc(account).send({from: this.admin});
				console.log("addRole:",role,result);
				return true;
				
			} catch(error) {
				console.log("addRole: ",role,error);
				return false;
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
        App.originFarmerID,
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
    this.fetchPastItemEvents(App.upc);
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

  fetchPastRoleEvents: async function(upc) {
    let allEvents,events;
    try {
      allEvents = await this.meta.getPastEvents(
        "allEvents", {fromBlock: 0 }
      );

      allEvents.forEach((log,idx) => {
        if (log.event == 'TransferOwnership') {
          $("#ftc-roles-events").append('<li>' + log.event + ' - '  + log.returnValues.newOwner + '</li>');
          this.admin = log.returnValues.newOwner;
        }
        if (log.event == "FarmerAdded") {
          $("#ftc-roles-events").append('<li>' + log.event + ' - ' + log.returnValues.account +  '</li>');
          this.originFarmerID = log.returnValues.account;
        }
        if (log.event == "DistributorAdded") {
          $("#ftc-roles-events").append('<li>' + log.event + ' - ' + log.returnValues.account +  '</li>');
          this.distributorID = log.returnValues.account;
        }
        if (log.event == "RetailerAdded") {
          $("#ftc-roles-events").append('<li>' + log.event + ' - ' + log.returnValues.account +  '</li>');
          this.retailerID = log.returnValues.account;
        }
        if (log.event == "ConsumerAdded") {
          $("#ftc-roles-events").append('<li>' + log.event + ' - ' + log.returnValues.account +  '</li>');
          this.consumerID = log.returnValues.account;
        }
        
      });
    }catch(error) {
      console.log("fetchPastRoleEvents: ",error);
    }
  },

  fetchPastItemEvents: async function(upc) {
    // There appears to be an bug in web3
    // filtering doesn't work when 'allEvents' is specified
    let allEvents,events;
    try {
      allEvents = await this.meta.getPastEvents(
        "allEvents", {fromBlock: 0 }
      );
      events = allEvents.filter((ev) => ev.returnValues.upc == upc);
      if (events) {
        $("#ftc-events").text("");

        events = Array.isArray(events) ? events : [events];
        events.forEach(function(log) {
          $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
      }
    }catch(error) {
      console.log("fetchPastItemEvents: ",error);
    }
  },

  fetchEvents: function() {
    var events = this.meta.events.allEvents(function(err, log){
      if (!err) {
        $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        if (log.event == "FarmerAdded" ||
					 	log.event == 'DistributorAdded' || 
					 	log.event == 'ConsumerAdded' || 
						log.event == 'RetailerAdded') {
          $("#ftc-roles-events").append('<li>' + log.event + ' - ' + log.returnValues.account +  '</li>');
				}
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
