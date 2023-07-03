const numberForm = document.getElementById("numberForm");
const numberInput = document.getElementById("numberInput");
const resultDiv = document.getElementById("result");

numberForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const number = parseInt(numberInput.value.trim());

    // Clear previous result
    resultDiv.textContent = "";

    // Check if the entered value is a valid number
    await verifyReport(number);
    // Clear the input field
    numberInput.value = "";
});

async function verifyReport(number){
    const contractAddress = "0xc75b4A40cb9600f9D2f7ef4fB883735c92351Cf9";
    const contractABI = [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
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
              "internalType": "uint32",
              "name": "pincode",
              "type": "uint32"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "data",
              "type": "string"
            }
          ],
          "name": "Reported",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "verifier",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "reportNumber",
              "type": "uint256"
            }
          ],
          "name": "Verified",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_wallet",
              "type": "address"
            }
          ],
          "name": "addCitizen",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint32",
              "name": "_pincode",
              "type": "uint32"
            },
            {
              "internalType": "string",
              "name": "_data",
              "type": "string"
            }
          ],
          "name": "fileReport",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalReports",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "_reports",
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
              "name": "reportNumber",
              "type": "uint256"
            }
          ],
          "name": "verify",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "reportNumber",
              "type": "uint256"
            }
          ],
          "name": "viewReport",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "informant",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "pincode",
                  "type": "uint32"
                },
                {
                  "internalType": "string",
                  "name": "report",
                  "type": "string"
                },
                {
                  "internalType": "bool",
                  "name": "isVerified",
                  "type": "bool"
                },
                {
                  "internalType": "address",
                  "name": "verifier",
                  "type": "address"
                }
              ],
              "internalType": "struct zFIR.Report",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ];
    try {
        provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress,contractABI,signer);
        const tx = await contract.verify(number);
        error.innerHTML = ""; 
        success.innerHTML = `Transaction in progress...`
        success.innerHTML += `<br>transaction hash : ${await tx.hash}`;
        await tx.wait();
        success.innerHTML += `<br>######### FIR Verified #########`;
    }
    catch(err){
        error.innerHTML = err;
    }    
}


connectButton.addEventListener("click", connectOrDisconnect);
async function connectOrDisconnect() {
    if (connectButton.textContent === 'Connect to Wallet') {
        try {
            // Prompt user to connect to a wallet
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            // Update the button text with the connected wallet address
            connectButton.innerHTML = `<i class="fas fa-link"></i>${accounts[0].slice(0, 6)}...<span class="address">${accounts[0]}</span>`;

            // Add the connected class to change the button color
            connectButton.classList.add('connected');
        } catch (error) {
            console.error(error);
        }
    } else {
        // Disconnect from the wallet
        await ethereum.request({ method: 'eth_accounts' });

        // Change the button text back to "Connect to Wallet"
        connectButton.innerHTML = '<i class="fas fa-link"></i>Connect to Wallet';

        // Remove the connected class to revert the button color
        connectButton.classList.remove('connected');
    }
}