"use strict";

// Data
const accounts = [
  {
    owner: "Tahmina Tanni",
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2,
    password: 1111,
    // movementsDates: [
    //   "2021-11-18T21:31:17.178Z",
    //   "2021-12-23T07:42:02.383Z",
    //   "2022-01-28T09:15:04.904Z",
    //   "2022-04-01T10:17:24.185Z",
    //   "2022-05-08T14:11:59.604Z",
    //   "2022-09-12T17:01:17.194Z",
    //   "2022-09-15T23:36:17.929Z",
    //   "2022-09-18T10:51:36.790Z",
    // ],
    // currency: "BDT",
    // locale: "bn-BD",
  },
  {
    owner: "Sunerah Binte Ayesha",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    password: 2222,
    // movementsDates: [
    //   "2021-11-01T13:15:33.035Z",
    //   "2021-11-30T09:48:16.867Z",
    //   "2021-12-25T06:04:23.907Z",
    //   "2022-01-25T14:18:46.235Z",
    //   "2022-02-05T16:33:06.386Z",
    //   "2022-04-10T14:43:26.374Z",
    //   "2022-06-25T18:49:59.371Z",
    //   "2022-07-26T12:01:20.894Z",
    // ],
    // currency: "USD",
    // locale: "en-US",
  },
];

// login
/* function displayApp(account) {
  const loginBtn = document.querySelector('.login-btn');
  loginBtn.addEventListener('click', function (event) {
    event.preventDefault();
    const inputUserName = document.getElementById('username').value;
    const inputPassword = Number(document.getElementById('password').value);
    const app = document.querySelector('.app');
    // console.log(account.username);
    // console.log(account.password);
    if (inputUserName === account.username && inputPassword === account.password) {
      app.style.opacity = 1;
    }
  })
}

displayApp(accounts[0]); */

const welcome = document.querySelector('.welcome');
const app = document.querySelector('.app');
const currentBalanceAmount = Number(document.getElementById('current-balance-amount').textContent);


// update UI
function updateUI(currentAccount) {
  displayTransactions(currentAccount);
  displaySummary(currentAccount);
  displayBalance(currentAccount);
}

// create username
function createUsernames(accounts) {
  accounts.forEach(account => {
    const lowerOwner = account.owner.toLowerCase();
    const splitOwner = lowerOwner.split(' ');
    const username = splitOwner.map(word => word.at(0).toUpperCase()).join('');
    account.username = username;
  })
}

createUsernames(accounts);


// login
let currentAccount;
const loginBtn = document.querySelector('.login-btn');
loginBtn.addEventListener('click', function (event) {
  event.preventDefault();
  const inputUserName = document.getElementById('username').value;
  const inputPassword = Number(document.getElementById('password').value);
  currentAccount = accounts.find(account => account.username === inputUserName);
  if (inputPassword === currentAccount.password) {
    welcome.textContent = `Welcome ${currentAccount.owner.split(' ').at(0)}`;
    app.style.opacity = 1;

    // update UI
    updateUI(currentAccount);
  }
  // hide UI and warning sms
  else {
    welcome.textContent = "Invalid password";
    welcome.style.color = 'red';
    app.style.opacity = 0;
  }

  // clear fields
  document.getElementById('username').value = document.getElementById('password').value = '';
  document.getElementById('password').blur();

});

// add transactions
function displayTransactions(account, sort = false) {
  const transactionsDiv = document.getElementById('transactions');
  transactionsDiv.textContent = "";
  const transactions = sort ? account.movements.slice(0).sort((a, b) => a - b) : account.movements;
  console.log(transactions);
  transactions.forEach((transaction, i) => {
    const transactionType = transaction > 0 ? 'deposit' : 'withdrawal';
    const transactionDiv = document.createElement('div');
    transactionDiv.classList.add('single-transaction');
    transactionDiv.innerHTML = `
      <div class="transaction-details">
        <p class="transaction-state ${transactionType}"><small>${i + 1} ${transactionType}</small></p>
        <p class="transaction-date"><small>5 days ago</small></p>
      </div>
      <p class="transaction-amount">${transaction}$</p>
`;
    transactionsDiv.insertAdjacentElement('afterbegin', transactionDiv);
  })

}


// add summary
function displaySummary(account) {
  const transactions = account.movements;
  // incomes
  const deposits = transactions.filter(transaction => transaction > 0);
  const incomes = deposits.reduce((acc, deposit) => acc + deposit, 0);
  const incomeAmount = document.querySelector('.income-amount');
  incomeAmount.textContent = `${incomes}$`;

  // outcomes
  const withdraws = transactions.filter(transaction => transaction < 0);
  const outcomes = Math.abs(withdraws.reduce((acc, withdraw) => acc + withdraw, 0));
  const outcomeAmount = document.querySelector('.outcome-amount');
  outcomeAmount.textContent = `${outcomes}$`;

  // interest
  const interest = deposits.map(deposit => (deposit * account.interestRate) / 100).filter(depositWithInterestRate => depositWithInterestRate > 1).reduce((acc, depositWithInterestRate) => acc + depositWithInterestRate, 0);
  const interestAmount = document.querySelector('.interest-amount');
  interestAmount.textContent = `${interest}$`;

}


// display current balance
function displayBalance(account) {
  const balance = account.movements.reduce((acc, transaction) => acc + transaction, 0);
  const currentBalance = document.querySelector('.current-balance');
  currentBalance.textContent = `${balance}$`;
  account.balance = balance;
}

// transfer operation
const transferBtn = document.querySelector(".transfer-btn");
transferBtn.addEventListener('click', function (event) {
  event.preventDefault();
  const transferAccountUsername = document.querySelector('.transfer-account').value;
  let transferAmount = Number(document.querySelector('.transfer-amount').value);
  const findAccount = accounts.find(account => account.username === transferAccountUsername);
  if (findAccount && findAccount !== currentAccount && transferAmount > 0 && currentAccount.balance > transferAmount) {
    findAccount.movements.push(transferAmount);
    currentAccount.movements.push(-transferAmount);
    // update UI
    updateUI(currentAccount);

    // show message
    welcome.textContent = 'Transaction Successful!';
    welcome.style.color = "green";
  }
  else {
    welcome.textContent = 'Transaction Failed!';
    welcome.style.color = "red";
  }

  document.querySelector('.transfer-account').value = '';
  document.querySelector('.transfer-amount').value = '';
  document.querySelector('.transfer-amount').blur();
});

// loan request
const loanBtn = document.querySelector('.loan-btn');
loanBtn.addEventListener('click', function (event) {
  event.preventDefault();
  const loanAmount = Number(document.querySelector('.loan-amount').value);
  if (loanAmount > 0 && currentAccount.movements.some(move => move >= (loanAmount * 0.1))) {
    currentAccount.movements.push(loanAmount);
    // update UI
    updateUI(currentAccount);
    welcome.textContent = " Loan Request Successful!";
    welcome.style.color = "green";
  }
  else {
    welcome.textContent = 'Loan Request Failed!';
    welcome.style.color = "red";
  }

  document.querySelector('.loan-amount').value = '';
  document.querySelector('.loan-amount').blur();
})


// close account
document.querySelector('.close-btn').addEventListener('click', function (event) {
  event.preventDefault();
  const confirmUsername = document.getElementById('confirm-username').value;
  const confirmPassword = Number(document.getElementById('confirm-password').value);
  if (confirmUsername === currentAccount.username && confirmPassword === currentAccount.password) {
    const index = accounts.findIndex(account => account.username === confirmUsername);

    // delete 
    accounts.splice(index, 1);

    app.style.opacity = 0;
    welcome.textContent = "Log in to get started";
    welcome.style.color = "#444";
  }
  else {
    app.style.opacity = 1;
    welcome.textContent = " Incorrect Username or Password!";
    welcome.style.color = "red";
  }
  confirmUsername = '';
  document.getElementById('confirm-password').value = '';
  document.getElementById('confirm-password').blur();
})

// sort transactions
let sortedTransaction = false;
document.querySelector('.sort-btn').addEventListener('click', function (event) {
  event.preventDefault();
  displayTransactions(currentAccount, !sortedTransaction);
  sortedTransaction = !sortedTransaction;
})
console.log(sortedTransaction);




