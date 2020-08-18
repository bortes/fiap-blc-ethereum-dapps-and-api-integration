import Web3 from 'web3'

import Wadaag from '../contracts/Wadaag.json';

const CONTRACT_NAME    = 'Wadaag';
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS_ || '0x56e58CcFF9366cCb513A2315EC61c059058c3153';
const HTTP_PROVIDER    = process.env.REACT_APP_HTTP_PROVIDER_    || 'http://localhost:8545';

const cache = {};

async function provider() {
    return new Promise(async (resolve, reject) => {
        if (cache.web3) {
            resolve(cache.web3);
        }

        if (window.ethereum) {
            window.ethereum.enable()
                .then(() => {
                    cache.web3 = new Web3(window.ethereum);
                    resolve(cache.web3);
                })
                .catch(error => {
                    reject(error);
                });

            window.ethereum.on('accountsChanged', function (accounts) {
                window.location.reload();
            });

            return;
        }

        if (window.web3) {
            cache.web3 = new Web3(window.web3.currentProvider);
        } else {
            cache.web3 = new Web3(new Web3.providers.HttpProvider(HTTP_PROVIDER));
        }

        resolve(cache.web3);
    });
}

async function contract() {
    return new Promise(async (resolve, reject) => {
        if (cache.contract) {
            resolve(cache.contract);
        }

        const web3 = await provider();

        const abi = Wadaag.abi;
        const address = web3.utils.isAddress(CONTRACT_ADDRESS) ? CONTRACT_ADDRESS : await web3.eth.ens.getAddress(CONTRACT_ADDRESS);

        if (!cache.contract) {
            cache.contract = new web3.eth.Contract(abi, address);
        }

        resolve(cache.contract);
    });
}

export async function getContractName() {
    return CONTRACT_NAME;
}

export async function getAccountAddress() {
    return provider().then(async (web3) => {
        const result = (await web3.eth.getAccounts())[0];

        return result;
    });
}

export async function getSocialContractName() {
    return contract().then(async (contract) => {
        const result = await contract.methods.name().call();

        return result;
    });
}

export function getTotalRegisteredOwners() {
    return contract().then(async (contract) => {
        const result = await contract.methods.countOwners().call();

        return result;
    });
}

export function getTotalAllowedOwners() {
    return contract().then(async (contract) => {
        const result = await contract.methods.maxOwners().call();

        return result;
    });
}

export function getRegisteredOwners() {
    return contract().then(async (contract) => {
        const result = await contract.methods.listOwners().call();

        return result;
    });
}

export function getDepositedAmount() {
    return contract().then(async (contract) => {
        const result = await contract.methods.totalDeposited().call();

        return result;
    });
}

export function isOwner() {
    return contract().then(async (contract) => {
        var address = await getAccountAddress();

        const result = await contract.methods.isOwner(address).call();

        return result;
    });
}

export function getBalanceOf(address) {
    // balanceOf
}

export function getPercentageOf(address) {
    // percOf
}

export function getDepositedAmountOf(address) {
    // totalOwner
}

export function deposit(amount) {
    return contract().then(async (contract) => {
        var address = await getAccountAddress();

        const result = await contract.methods.deposit().send({from: address, value: amount, gas: 180000});

        return result;
    });
}

export function transferTo() {
    // transferRatio
}

export function withdrawal() {
    // withdrawal
}

const WadaagService = {
    getContractName,
    getAccountAddress,

    getSocialContractName,
    getTotalRegisteredOwners,
    getTotalAllowedOwners,
    getRegisteredOwners,
    getDepositedAmount,
    isOwner,
    getBalanceOf,
    getPercentageOf,
    getDepositedAmountOf,
    deposit,
    transferTo,
    withdrawal
}

export default WadaagService;