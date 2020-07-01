import Web3 from 'web3'
import Wadaag from '../contracts/Wadaag.json';

export async function connect() {
    const cache = {};

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

            return;
        }

        if (window.web3) {
            cache.web3 = new Web3(window.web3.currentProvider);
        } else {
            cache.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        }

        resolve(cache.web3);
    });
}

async function context() {
    return new Promise(async (resolve, reject) => {
        const web3 = await connect();

        const networkId = await web3.eth.net.getId()

        const network = Wadaag.networks[networkId];

        if (network) {
            const abi = Wadaag.abi;
            const address = network.address;
            const contract = new web3.eth.Contract(abi, address);

            resolve({
                web3,
                contract,
            });
        } else {
            reject();
        }
    });
}

export async function getSocialContractName() {
    return context().then(async (context) => {
        const { contract } = context;

        const result = await contract.methods.name().call();

        return result;
    });
}

export function getTotalRegisteredOwners() {
    return context().then(async (context) => {
        const { contract } = context;

        const result = await contract.methods.countOwners().call();

        return result;
    });
}

export function getTotalAllowedOwners() {
    return context().then(async (context) => {
        const { contract } = context;

        const result = await contract.methods.maxOwners().call();

        return result;
    });
}

export function getRegisteredOwners() {
    return context().then(async (context) => {
        const { contract } = context;

        const result = await contract.methods.listOwners().call();

        return result;
    });
}

export function getDepositedAmount() {
    return context().then(async (context) => {
        const { contract } = context;

        const result = await contract.methods.totalDeposited().call();

        return result;
    });
}

export function isOwner(address) {
    // isOwner
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

export function deposit() {
    // deposit
}

export function transferTo() {
    // transferRatio
}

export function withdrawal() {
    // withdrawal
}

const WadaagService = {
    connect,

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