const tokenList = {
    usdc: {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimal: 6
    },
    dai: {
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        decimal: 18
    },
    usdt: {
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        decimal: 6
    },
    hoge: {
        address: '0xfad45e47083e4607302aa43c65fb3106f1cd7607',
        decimal: 9
    },
}


let userWallet = '';
// check withUserDetails input;
const userName = document.querySelector('#defiplugs-name');
const userEmail = document.querySelector('#defiplugs-email');
const donationAmount = document.querySelector('#defiplugs-amount');
const defiPlugsBtn = document.querySelector('#defiplugs-btn');
const defiPlugsConnect = document.querySelector('#defiplugs-connect');
const isDonation = defiPlugsBtn.dataset.dplgsdonation == 1 ? true: false;
const withUserInput = defiPlugsBtn.dataset.dplgsinput ==1 ? true: false;



window.ethereum.request({ method: 'eth_accounts' }).then((addr) => {
  if (addr.length > 0) {
    defiPlugsConnect.style.display = 'none';
    userWallet = addr[0];
  }
});

defiPlugsConnect.addEventListener('click', () => {
  window.ethereum.request({ method: 'eth_requestAccounts' }).then((wallet) => {
    userWallet = wallet[0];
    defiPlugsConnect.style.display = 'none';
  });
});




defiPlugsBtn.addEventListener('click', () => {
  const dataToken = defiPlugsBtn.dataset.dplgstoken;
  const dataAmount = isDonation ?  donationAmount.value : defiPlugsBtn.dataset.dplgsprice;
  let web3 = new Web3(window.ethereum);
  let tokenAddress = tokenList[dataToken].address;
  let toAddress = userWallet;
  let fromAddress = userWallet;
  // Use BigNumber
  let decimals = web3.utils.toBN(Number(tokenList[dataToken].decimal));
  let amount = web3.utils.toBN(Number(dataAmount));
  let minABI = [
    // transfer
    {
      constant: false,
      inputs: [
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'transfer',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      type: 'function',
    },
  ];
  // Get ERC20 Token contract instance
  let contract = new web3.eth.Contract(minABI, tokenAddress);
  // calculate ERC20 token amount
  let value = amount.mul(web3.utils.toBN(10).pow(decimals));
  // call transfer function
  if(withUserInput){
    defiplugsUserDetails.name = userName.value;
    defiplugsUserDetails.email = userEmail.value;
  }
  console.log(defiplugsUserDetails)
  

  contract.methods
    .transfer(toAddress, value)
    .send({ from: fromAddress })
    .on('receipt', function (hash) {
      console.log(hash);
      //send info to BE, record userDetail and hash
    });
});
