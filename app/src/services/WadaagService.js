import Web3 from 'web3'
import Q from 'q';

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
    if (cache.contract) {
        return cache.contract.promise;
    }

    cache.contract = Q.defer();

    const web3 = await provider();

    const abi = Wadaag.abi;
    const address = web3.utils.isAddress(CONTRACT_ADDRESS) ? CONTRACT_ADDRESS : await web3.eth.ens.getAddress(CONTRACT_ADDRESS);

    cache.contract.resolve(new web3.eth.Contract(abi, address));

    return cache.contract.promise;
}

export async function getContractName() {
    return Q.fcall(function () {
        return CONTRACT_NAME;
    });
}

export async function getAccountAddress() {
    const web3 = await provider();

    const result = (await web3.eth.getAccounts())[0];

    return result;
}

export async function getSocialContractName() {
    const instance = await contract();

    const result = await instance.methods.name().call();

    return result;
}

export async function getTotalRegisteredOwners() {
    const instance = await contract();

    const result = await instance.methods.countOwners().call();

    return result;

}

export async function getTotalAllowedOwners() {
    const instance = await contract();

    const result = await instance.methods.maxOwners().call();

    return result;
}

export async function getRegisteredOwners() {
    const instance = await contract();

    const result = await instance.methods.listOwners().call();

    return result;
}

export async function getDepositedAmount() {
    const instance = await contract();

    const result = await instance.methods.totalDeposited().call();

    return result;
}

export async function isOwner() {
    const instance = await contract();

    var address = await getAccountAddress();

    const result = await instance.methods.isOwner(address).call();

    return result;
}

export async function getBalanceOf(address) {
    const instance = await contract();
    
    address = address || await getAccountAddress();

    const result = await instance.methods.balanceOf(address).call();

    return result;
}

export async function getPercentageOf(address) {
    const instance = await contract();
    
    address = address || await getAccountAddress();

    const result = await instance.methods.percOf(address).call();

    return result;
}

export async function getDepositedAmountOf(address) {
    const instance = await contract();
    
    address = address || await getAccountAddress();

    const result = await instance.methods.totalOwner(address).call();

    return result;
}

export async function deposit(amount, address) {
    var deferred = Q.defer();

    const instance = await contract();
    
    address = address || await getAccountAddress();

    instance.methods
        .deposit()
        .send({
            from: address, 
            value: amount, 
            gas: 180000
        })
        .then(data => {
            let message;
            
            message = {
                title: 'Solicitação de depósito realizada com sucesso!',
                detail: 'Seu solicitação foi processada e uma nova transação foi criada. Em alguns instântes um novo bloco será gerado com esta transação e então sua solicitação será atendida.'
            };

            deferred.resolve([message, data]);
        })
        .catch(reason => {
            let message;
            
            message = {
                title: 'Não foi possível efetuar a solicitação do depósito.',
                detail: 'Um erro inesperado ocorreu. Verifique seu saldo e tente novamente.'
            };

            if (/: revert zero address/.test(reason.message))
            {
                message = {
                    title: 'Não foi possível efetuar a solicitação do depósito.',
                    detail: 'O endereço informado é inválido. Verifique o endereço e tente novamente mais tarde.'
                };
            }
            
            if (/: revert shares are 0/.test(reason.message))
            {
                message = {
                    title: 'Não foi possível efetuar a solicitação do depósito.',
                    detail: 'O valor do depósito esta esta zerado. Verifica o valor e tente novamente.'
                };
            }

            if (/: revert max owners/.test(reason.message))
            {
                message = {
                    title: 'Não foi possível efetuar a solicitação do depósito.',
                    detail: 'O grupo esta fechado para novos participantes, todas as vagas disponíveis estão ocupadas. Tente novamente mais tarde.'
                };
            }

            deferred.reject([message, reason]);
        })

    return deferred.promise;
}

export async function transferTo() {
    // transferRatio
}

export async function withdrawal() {
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