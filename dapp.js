
const serverUrl = "https://if32pxbtefqb.usemoralis.com:2053/server";
const appId = "KcSdbvNBRf8rLGLAVfLRoD19yyThOZpOdndr997D";

Moralis.start({ serverUrl, appId });
var userAddress; 
var ethers; 
var provider; 
const contractAddress = "0xd0C75adAEd6631212965c131B61243B74F4E85A1";
var mainContract; 
var stakingContract; 

function linkSimpleButtons() {
    document.getElementById("usersWallet").onclick = loginManual;
	document.getElementById("buyButton").onclick = buy; 
	document.getElementById("emergencyWithdraw").onclick = withdraw; 
}

function beautifyAddress(address, first) {
    return address.slice(0, first)+"..."+address.slice(-3);
}
function updateUserAddress(ethAddress) {
    userAddress = ethAddress;
    document.getElementById("usersWallet").innerHTML = beautifyAddress(ethAddress,5);
   // beautifyAddress(ethAddress,5);
}

async function buy() {
    const amount = document.getElementById("buyInput").value;
    if(!userAddress) {
        //setErrorMessage("Error: Wallet not connected");
    }

    // sending 0.5 tokens with 18 decimals
    
	const options = {
		type: "native",
		amount: Moralis.Units.ETH(amount),
		receiver: contractAddress
	  };
	  //let result = await Moralis.transfer(options)
	  
    try {
    let result = await Moralis.transfer(options)
    } catch(error) {
        console.log(error)
        if (typeof error === 'string' || error instanceof String || Array.isArray(error)) {
            setErrorMessage(error);
        } else {
            setErrorMessage(error['message']);
        }
        return;
    }
    setErrorMessage("");
   //getStats();
	
}

function setErrorMessage(message) {
	document.getElementById("errorMessage").innerHTML = message; 
}



async function loginManual() {
   await logOut();
   await login();
}

async function login() {
    provider = await Moralis.enableWeb3();
    ethers = Moralis.web3Library; 

   /* const curChainId = await Moralis.getChainId();
    console.log("chainID",curChainId); */

    const newChainId = "0x38"; //BSC Mainnet
    const chainIdHex = await Moralis.switchNetwork(newChainId); 
    
   let user = Moralis.User.current();
    if (!user) {
      user = await Moralis.Web3.authenticate({signingMessage: "Requesting permission to read account balances"});
    }
    updateUserAddress(user.attributes.ethAddress);
   	getStats();
  }

async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
}
 
async function getStats() {
	var options = {chain: "0x38", address: userAddress};
	let balance = await Moralis.Web3API.account.getNativeBalance(options);
	document.getElementById("balance").innerHTML = (parseFloat(balance.balance)/(10**18)).toFixed(2); 

	var options = {chain: "0x38", address: contractAddress};
	let contractBalance = await Moralis.Web3API.account.getNativeBalance(options);
	document.getElementById("pending").innerHTML = (parseFloat(contractBalance.balance)/(10**18)).toFixed(2); 


    var contract = await new ethers.Contract(contractAddress, abi, provider);
    
	let totalBNBBought = await contract.totalBNBBought();
	document.getElementById("totalBNBBought").innerHTML = parseFloat(totalBNBBought)/(10**18).toFixed(2);
    
	let totalBuysRequested = await contract.totalBuysRequested();
	document.getElementById("totalBuysRequested").innerHTML = totalBuysRequested;

	if(Moralis.User.current()) {
		let bnbContributed = await contract.bnbContributed(userAddress);
		document.getElementById("bnbContributed").innerHTML = parseFloat(bnbContributed)/(10**18).toFixed(2);
	}

    

}


async function withdraw() {
	const signer = provider.getSigner();
	var contract = await new ethers.Contract(contractAddress, abi, signer);
	await contract.emergencyWithdraw();
}

linkSimpleButtons();
//getStats();

const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "BNBContributed",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "buy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "emergencyWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "withdrawAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			}
		],
		"name": "withdrawToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "bnbContributed",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "currentlyBuying",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "router",
		"outputs": [
			{
				"internalType": "contract IDEXRouter",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalBNBBought",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalBuysRequested",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "addr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
