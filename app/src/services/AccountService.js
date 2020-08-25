import ProviderService from './ProviderService.js';

export async function getAccountAddress() {
    const web3 = await ProviderService.getProvider();

    const result = (await web3.eth.getAccounts())[0];

    return result;
}

const AccountService = {
    getAccountAddress
}

export default AccountService;