// Connect the button click event to the wallet connection function
const success = document.getElementById("success");
const error = document.getElementById("error");

const connectButton = document.getElementById("connectButton");
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

const form = document.getElementById("myForm");
const pincodeInput = document.getElementById("pincode");
const textStringInput = document.getElementById("textString");
const pincodeError = document.getElementById("pincodeError");
const textStringError = document.getElementById("textStringError");
form.addEventListener("submit",async function(event) {
    event.preventDefault();

    const pincode = pincodeInput.value;
    const textString = textStringInput.value;

    // Clear previous error messages
    pincodeError.textContent = "";
    textStringError.textContent = "";

    // Validate Pin Code (should be 6 digits)
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
        pincodeError.textContent = "Pin Code must be 6 digits";
        return;
    }

    // Validate Text String (should not be empty)
    if (textString.trim() === "") {
        textStringError.textContent = "Text String cannot be empty";
        return;
    }

    // Display the result
    console.log(`Pin Code: ${pincode}<br>Text String: ${textString}`);
    
    await reportFIR();
    clearText();
});

function clearText(){
    // Clear the input fields
    pincodeInput.value = "";
    textStringInput.value = "";
}

async function reportFIR(){
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
    const pincode = pincodeInput.value;
    const textString = textStringInput.value;
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress,contractABI,signer);
        console.log(pincode,typeof(pincode),textString,typeof(textString))
        success.innerHTML = `Transaction in progress....`;
        const tx = await contract.fileReport(ethers.toBigInt(parseInt(pincode)),textString);
        success.innerHTML += `<br>Transaction Hash : ${await tx.hash}`;
        success.innerHTML += `<br>Transaction in progress....`;
        await tx.wait();
        success.innerHTML += `<br>FIR Report Number : ${(parseInt((await contract.totalReports()).toString()))-1}`;
        success.innerHTML += `<br>######## FIR RECORDED ########`;
    }
    catch(err){
        error.innerHTML = err;
    }
}
