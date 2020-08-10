import Web3 from 'web3'
import Wadaag from '../contracts/Wadaag.json';

const CONTRACT_NAME    = 'Wadaag';
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS_ || '0xa4675Ef1cec4FB882241787fc6CE35f0D10A5f28';
const HTTP_PROVIDER    = process.env.REACT_APP_HTTP_PROVIDER_    || 'http://localhost:8545';

const cache = {};

export async function connect() {
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
            if (!cache.web3) {
                cache.web3 = new Web3(window.web3.currentProvider);
            }
        } else {
            if (!cache.web3) {
                cache.web3 = new Web3(new Web3.providers.HttpProvider(HTTP_PROVIDER));
            }
        }

        resolve(cache.web3);
    });
}

async function context() {
    return new Promise(async (resolve, reject) => {
        const web3 = await connect();

        const abi = Wadaag.abi;
        const address = web3.utils.isAddress(CONTRACT_ADDRESS) ? CONTRACT_ADDRESS : await web3.eth.ens.getAddress(CONTRACT_ADDRESS);
        const contract = new web3.eth.Contract(abi, address);

        resolve({
            web3,
            contract,
        });
    });
}

export async function getContractName() {
    return CONTRACT_NAME;
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

    getContractName,
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