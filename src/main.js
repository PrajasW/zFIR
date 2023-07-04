const contractAddress = "0xD729B59fFcb98FbFF0cbfAb797DE7141390EB741";
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
// index.html

const form = document.getElementById("myForm");
const pincodeInput = document.getElementById("pincode");
const textStringInput = document.getElementById("textString");
const pincodeError = document.getElementById("pincodeError");
const textStringError = document.getElementById("textStringError");

if(form !== undefined){
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
}

async function reportFIR(){
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
        success.innerHTML += `<br>FIR Report Number : ${parseInt((await contract.totalReports()).toString()-1)}`;
        success.innerHTML += `<br>######## FIR RECORDED ########`;
    }
    catch(err){
        error.innerHTML = err;
    }
}

// citizen.html

const addressForm = document.getElementById("addressForm");
if(addressForm !== undefined){
    addressForm.addEventListener("submit",async function(event) {
        const addressInput = document.getElementById("addressInput");
        const addressError = document.getElementById("addressError");
        event.preventDefault();
    
        const address = addressInput.value.trim();
    
        // Clear previous error message
        addressError.innerHTML = "";
    
        // Validate Ethereum address
        if (!isAddressValid(address)) {
            addressError.innerHTML = "Invalid Ethereum address";
            return;
        }
    
        // Display the result
        await addCitizen();
    });
}

async function addCitizen(){
    const address = addressInput.value;
    try {
        provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress,contractABI,signer);
        const tx = await contract.addCitizen(address);
        error.innerHTML = "";
        success.innerHTML = `Transaction in progress...`
        success.innerHTML += `<br>transaction hash : ${await tx.hash}`;
        success.innerHTML = `Transaction in progress...`
        await tx.wait();
        success.innerHTML += `<br>######### CITIZEN ADDED #########`;
    }
    catch(err){
        error.innerHTML = err;
    }    
}
function isAddressValid(address) {
    // Ethereum address validation logic
    const addressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
    return addressRegex.test(address);
}


// verify.html

const reportNumberForm = document.getElementById("reportNumberForm");
const reportNumberInput = document.getElementById("reportNumberInput");
const resultDiv = document.getElementById("result");

if(reportNumberForm !== undefined){
    reportNumberForm.addEventListener("submit", async function(event) {
        event.preventDefault();
    
        const number = parseInt(reportNumberInput.value.trim());
    
        // Clear previous result
        resultDiv.textContent = "";
    
        // Check if the entered value is a valid number
        await verifyReport(number);
        // Clear the input field
        reportNumberInput.value = "";
    });
}

async function verifyReport(number){
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

// query.html
const numberForm = document.getElementById("numberForm");
const numberInput = document.getElementById("numberInput");
if(numberForm !== undefined){
    numberForm.addEventListener("submit", async function(event) {
        event.preventDefault();
    
        const number = parseInt(numberInput.value.trim());
    
        // Clear previous result
        resultDiv.textContent = "";
    
        // Check if the entered value is a valid number
        await queryReport(number);
        // Clear the input field
        numberInput.value = "";
    });
}

async function queryReport(number){
    try {
        provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress,contractABI,signer);
        const report = await contract.viewReport(number);
        error.innerHTML = ""; 
        success.innerHTML = `
        <h3> FIR FOUND </h3>

        Informant: ${report.informant}
        <br>Pincode: ${report.pincode}
        <br>Report: ${report.report}
        <br>Verfied: ${report.isVerified}
        <br>Verifier: ${report.verifier}
        <br>
        <br>
        `;
    }
    catch(err){
        error.innerHTML = err;
}
}