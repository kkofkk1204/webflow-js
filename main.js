<script src="https://unpkg.com/web3@latest/dist/web3.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/web3modal"></script>
<script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js"
        type="application/javascript"></script>
 
<script>
var abi;
		window.onload = function () {
            var url = "https://gateway.pinata.cloud/ipfs/QmSdzxPdSNMzKcxezbHJuMWjhCGNnydVhHQPeRFGw2CDgi"/*json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径*/
            var request = new XMLHttpRequest();
            request.open("get", url);/*设置请求方法与路径*/
            request.send(null);/*不发送数据到服务器*/
            request.onload = function () {/*XHR对象获取到返回信息后执行*/
                if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
                    abi = JSON.parse(request.responseText);
                }
            }
       }
       </script>

<script>

"use strict";



 // Unpkg imports
const Web3Modal = window.Web3Modal.default;

// Web3modal instance, Chosen wallet provider given by the dialog window, Address of the selected account
let web3Modal, provider, selectedAccount;
let accounts = [];
var Signature;
/**
 * Setup the orchestra
 */
function init() {

  provider = window.ethereum;

	if (typeof provider !== 'undefined') {
		provider.request({ method: 'eth_requestAccounts' })
			.then((acc) => {
				selectedAccount = acc[0];
        accounts = acc;
        var cutAcc = selectedAccount.replace(selectedAccount.substring(4,selectedAccount.length - 4), "...");
        $('#connect-text').text(cutAcc);
        $("#btn-connect").attr("disabled", "disabled");
        checkWalletNFT();
			})
			.catch((err) => {
				console.log(err);
				return;
			});

		provider.on('accountsChanged', function (acc) {
			selectedAccount = acc[0];
			console.log(`Selected account changed to ${selectedAccount}`);
      init();
		});
	}

}

async function testAdd(ContractName,TokenIndex) {

  var main_block = document.querySelector(".block_1");
  var sub_block=document.createElement("div");
  var new_text=document.createElement("div");
  var button=document.createElement("button");
  var img_frame = document.createElement('div');
  var img = document.createElement('img');
  
  sub_block.className = "block_2";
  new_text.className = "text_2";
  img_frame.className = "img_1";
  button.className = "button_1";
 	main_block.appendChild(sub_block);
  
  var src = 'https://gateway.pinata.cloud/ipfs/QmP7dLLmEo5Wergk193TS6TPz96jWXm29Vv1AUxsjB21Ko';
  img.src = src;
  img_frame.appendChild(img);

 	
 	var new_sub = document.querySelectorAll(".block_2")
  var id = new_sub.length - 1
  
  new_text.setAttribute("id", "Text-"+id.toString());
  button.setAttribute("id", "Button-"+id.toString());
  button.appendChild(document.createTextNode("Staking"));
  await new_sub[new_sub.length-1].appendChild(img_frame);
  new_sub[new_sub.length-1].appendChild(new_text);
  
  var new_sub_2 = document.querySelectorAll(".text_2")
  await new_sub_2[new_sub.length-1].appendChild(document.createTextNode(ContractName + " - #" + TokenIndex.toString()));
  await new_sub_[new_sub.length-1].appendChild(button);

}


async function checkWalletNFT() {
    const contract_address = "0x2f48bFb962aB645E0EC34d1ad7d6D9fd7742f885";
    const web3 = new Web3(provider);
    const nftContract = new web3.eth.Contract(abi,contract_address);
    var WalletOfTokenList = [];
    var ContractName;
    nftContract.defaultAccount = selectedAccount;
    await nftContract.methods.name().call().then(function(res){ContractName=res;})
    await nftContract.methods.balanceOf(selectedAccount).call().then(function(res)
    {
    for(let i = 0; i < res; i++){
    console.log(i);
    	 nftContract.methods.tokenOfOwnerByIndex(selectedAccount,i).call().then(function(TokenIndex){
  		 WalletOfTokenList.push(TokenIndex);
       testAdd(ContractName,TokenIndex);
       });
    }}
		);
   
}

async function mintingNFT() {
  const url = "https://gateway.pinata.cloud/ipfs/QmRuoSVbthvHpQb38fk2b8gZBn5ySpyprbuZv1KiCuT49D"/*json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径*/
  const request = new XMLHttpRequest();
  request.open("get", url);/*设置请求方法与路径*/
  request.send(null);/*不发送数据到服务器*/
  request.onload = function () {/*XHR对象获取到返回信息后执行*/
      if (request.status == 200) {
          const sign_code = JSON.parse(request.responseText)[selectedAccount];
          console.log(sign_code);
 					const contract_address = "0xa29f7Bd0Af7Ce9d529D403C27b2d12E049de688A";
          const web3 = new Web3(provider);
          const nftContract = new web3.eth.Contract(abi,contract_address);
           nftContract.methods.safeMint(sign_code).estimateGas({from: selectedAccount})
              .then(function(gasAmount){
              console.log(gasAmount);
               nftContract.methods.safeMint(sign_code).send({
                  gasLimit: gasAmount,
                  to: contract_address,
                  from: selectedAccount,
                  value: 0,})

      	});
      }
  }
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);

  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();

  // Get list of accounts of the connected wallet
  accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  selectedAccount = accounts[0];
  var cutAcc = selectedAccount.replace(selectedAccount.substring(4,selectedAccount.length - 4), "...");

  // Go through all accounts and get their ETH balance
  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);
    // ethBalance is a BigNumber instance
    // https://github.com/indutny/bn.js/
    const ethBalance = web3.utils.fromWei(balance, "ether");
    const parseBalance = parseFloat(ethBalance).toFixed(3);
    // Fill in the templated row and put in the document
    document.querySelector(".address").textContent = address;
    document.querySelector(".balance").textContent = parseBalance;
  });

  await Promise.all(rowResolvers);

  // Display fully loaded UI for wallet data
  $("#connect-text").text(cutAcc);
  $("#btn-disconnect").prop("disabled", false);
  $(".send_eth").show();
  document.querySelector("#btn-disconnect").style.display = "flex";
}

/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

  // If any current data is displayed when
  // the user is switching acounts in the wallet
  // immediate hide this data  
  document.querySelector("#btn-disconnect").style.display = "flex";

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}

/**
 * Connect wallet button pressed.
 */
async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  try {
    init();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}

/*Disconnect button pressed*/
async function onDisconnect() {

  // TODO: Which providers have close method?
  if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  // Set the UI back to the initial state
  $(".send_eth").hide();
  $('.address').text("0x00000");
  $('.balance').text("0.000");
  $("#btn-disconnect").prop("disabled", true);
  $("#connect-text").text("Connect Wallet");
}

 //Sending Ethereum to an address
async function sendTransaction(){
	ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: accounts[0],
            to: '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
            value: '0x29a2241af62c0000',
            gasPrice: '0x09184e72a000',
            gas: '0x2710',
          },
        ],
      })
      .then((txHash) => console.log(txHash))
      .catch((error) => console.error);
}

/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  $("#btn-connect").on("click", () => {onConnect() });
  $("#btn-disconnect").on("click", ()=> {onDisconnect() });

});
</script>
