import Q from 'q';

import AccountService from './AccountService.js';
import ProviderService from './ProviderService.js';
import Wadaag from '../contracts/Wadaag.json';

const CONTRACT_NAME    = 'Wadaag';
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x56e58CcFF9366cCb513A2315EC61c059058c3153';
const CACHE            = {};

async function contract() {
    if (CACHE.contract) {
        return CACHE.contract.promise;
    }

    CACHE.contract = Q.defer();

    const web3 = await ProviderService.getProvider();

    const abi = Wadaag.abi;
    const address = web3.utils.isAddress(CONTRACT_ADDRESS) ? CONTRACT_ADDRESS : await web3.eth.ens.getAddress(CONTRACT_ADDRESS);

    CACHE.contract.resolve(new web3.eth.Contract(abi, address));

    return CACHE.contract.promise;
}

export async function getContractName() {
    return Q.fcall(function () {
        return CONTRACT_NAME;
    });
}

export async function isReady() {
    return isOwner();
}

export async function getSocialName() {
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

export async function isOwner(address) {
    const instance = await contract();

    address = address || await AccountService.getAccountAddress();

    const result = await instance.methods.isOwner(address).call();

    return result;
}

export async function getBalanceOf(address) {
    const instance = await contract();
    
    address = address || await AccountService.getAccountAddress();

    const result = await instance.methods.balanceOf(address).call();

    return result;
}

export async function getPercentageOf(address) {
    const instance = await contract();
    
    address = address || await AccountService.getAccountAddress();

    const result = await instance.methods.percOf(address).call();

    return result;
}

export async function getDepositedAmountOf(address) {
    const instance = await contract();
    
    address = address || await AccountService.getAccountAddress();

    const result = await instance.methods.totalOwner(address).call();

    return result;
}

export async function deposit(amount) {
    var deferred = Q.defer();

    const instance = await contract();
    
    const from = await AccountService.getAccountAddress();

    instance.methods
        .deposit()
        .send({
            from: from, 
            value: amount, 
            gas: 180000
        })
        .then(data => {
            let message;
            
            message = {
                title: 'Solicitação de depósito realizada com sucesso!',
                detail: 'Sua solicitação foi processada e uma nova transação foi criada. Em alguns instantes um novo bloco será gerado com esta transação e então sua solicitação será atendida.'
            };

            deferred.resolve([message, data]);
        })
        .catch(reason => {
            let message;
            
            message = {
                title: 'Não foi possível efetuar a solicitação do depósito.',
                detail: 'Ocorreu um erro inesperado. Verifique seu saldo e tente novamente.'
            };

            if (/: revert zero address/.test(reason.message)) {
                message = {
                    title: 'Não foi possível efetuar a solicitação do depósito.',
                    detail: 'O endereço informado é inválido. Verifique o endereço e tente novamente mais tarde.'
                };
            }
            
            if (/: revert shares are 0/.test(reason.message)) {
                message = {
                    title: 'Não foi possível efetuar a solicitação do depósito.',
                    detail: 'O valor do depósito esta zerado. Verifica o valor e tente novamente.'
                };
            }

            if (/: revert max owners/.test(reason.message)) {
                message = {
                    title: 'Não foi possível efetuar a solicitação do depósito.',
                    detail: 'O grupo esta fechado para novos usuários, todas as vagas disponíveis estão ocupadas. Tente novamente mais tarde.'
                };
            }

            deferred.reject([message, reason]);
        })

    return deferred.promise;
}

export async function transferTo(to, amount) {
    var deferred = Q.defer();

    const instance = await contract();
    
    const from = await AccountService.getAccountAddress();

    instance.methods
        .transferRatio(to, amount)
        .send({
            from: from, 
            gas: 180000
        })
        .then(data => {
            let message;
            
            message = {
                title: 'Solicitação de transferência realizada com sucesso!',
                detail: 'Sua solicitação foi processada e uma nova transação foi criada. Em alguns instantes um novo bloco será gerado com esta transação e então sua solicitação será atendida.'
            };

            deferred.resolve([message, data]);
        })
        .catch(reason => {
            let message;

            message = {
                title: 'Não foi possível efetuar a solicitação de transferência.',
                detail: 'Ocorreu um erro inesperado. Verifique seu saldo e tente novamente.'
            };

            if (/: revert zero address/.test(reason.message)) {
                message = {
                    title: 'Não foi possível efetuar a solicitação de transferência.',
                    detail: 'O endereço informado é inválido. Verifique o endereço e tente novamente mais tarde.'
                };
            }
            
            if (/: revert invalid perc/.test(reason.message)) {
                message = {
                    title: 'Não foi possível efetuar a solicitação de transferência.',
                    detail: 'A taxa informada é maior do que atribuída para você. Verifica a taxa e tente novamente.'
                };
            }

            if (/: revert removeOwner error/.test(reason.message)) {
                message = {
                    title: 'Não foi possível efetuar a solicitação de transferência.',
                    detail: 'Erro ao excluir usuário. Tente novamente mais tarde.'
                };
            }

            if (/: revert shares are 0/.test(reason.message)) {
                message = {
                    title: 'Não foi possível efetuar a solicitação de transferência.',
                    detail: 'A taxa informada é inválida. Verifique a taxa e tente novamente mais tarde.'
                };
            }

            if (/: revert max owners/.test(reason.message)) {
                message = {
                    title: 'Não foi possível efetuar a solicitação de transferência.',
                    detail: 'O grupo esta fechado para novos usuários, todas as vagas disponíveis estão ocupadas. Tente novamente mais tarde.'
                };
            }
            
            deferred.reject([message, reason]);
        });

    return deferred.promise;
}

export async function withdrawal() {
        var deferred = Q.defer();

    const instance = await contract();
    
    const from = await AccountService.getAccountAddress();

    instance.methods
        .withdrawal()
        .send({
            from: from, 
            gas: 180000
        })
        .then(data => {
            let message;
            
            message = {
                title: 'Solicitação de saque realizada com sucesso!',
                detail: 'Sua solicitação foi processada e uma nova transação foi criada. Em alguns instantes um novo bloco será gerado com esta transação e então sua solicitação será atendida.'
            };

            deferred.resolve([message, data]);
        })
        .catch(reason => {
            let message;
            
            message = {
                title: 'Não foi possível efetuar a solicitação de saque.',
                detail: 'Ocorreu um erro inesperado. Verifique seu saldo e tente novamente.'
            };

            if (/: balance is zero/.test(reason.message)) {
                message = {
                    title: 'Não foi possível efetuar a solicitação de saque.',
                    detail: 'Usuário não possui saldo disponível para saque. Verifica o valor e tente novamente.'
                };
            }
            
            deferred.reject([message, reason]);
        })

    return deferred.promise;
}

export async function onAddOwnerEvent(handle) {
    if (handle instanceof Function) {
        const instance = await contract();

        instance.events.AddOwner().on('data', handle);
    }
}

export async function onRemoveOwnerEvent(handle) {
    if (handle instanceof Function) {
        const instance = await contract();

        instance.events.RemoveOwner().on('data', handle);
    }
}

export async function onDepositEvent(handle) {
    if (handle instanceof Function) {
        const instance = await contract();

        instance.events.Deposit().on('data', handle);
    }
}

export async function onTransferEvent(handle) {
    if (handle instanceof Function) {
        const instance = await contract();

        instance.events.TransferRatio().on('data', handle);
    }
}

export async function onReceiveEvent(handle) {
    if (handle instanceof Function) {
        const instance = await contract();

        instance.events.Receive().on('data', handle);
    }
}

const WadaagService = {
    getContractName,
    isReady,

    getSocialName,
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
    withdrawal,

    onAddOwnerEvent,
    onRemoveOwnerEvent,
    onDepositEvent,
    onTransferEvent,
    onReceiveEvent,
}

export default WadaagService;