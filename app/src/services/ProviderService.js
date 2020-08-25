import Web3 from 'web3'

const SOCKET_PROVIDER = process.env.REACT_APP_SOCKET_PROVIDER_ || 'ws://localhost:8545';
const HTTP_PROVIDER   = process.env.REACT_APP_HTTP_PROVIDER_ || 'http://localhost:8545';
const CACHE           = {};

export async function getProvider() {
    return new Promise(async (resolve, reject) => {
        if (CACHE.web3) {
            resolve(CACHE.web3);
        }

        if (window.ethereum) {
            window.ethereum.enable()
                .then(() => {
                    CACHE.web3 = new Web3(window.ethereum);
                    resolve(CACHE.web3);
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
            CACHE.web3 = new Web3(window.web3.currentProvider);
        } else {
            if (SOCKET_PROVIDER) {
                CACHE.web3 = new Web3(new Web3.providers.WebsocketProvider(SOCKET_PROVIDER));
            } else {
                CACHE.web3 = new Web3(new Web3.providers.HttpProvider(HTTP_PROVIDER));
            }
        }

        resolve(CACHE.web3);
    });
}

const ProviderService = {
    getProvider
}

export default ProviderService;