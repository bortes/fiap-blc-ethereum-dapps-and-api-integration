const Wadaag = artifacts.require('Wadaag.sol'); 

contract('Wadaag', async (accounts) => {

    const EVENT_ADD_OWNER = 'AddOwner';
    const EVENT_REMOVE_OWNER = 'RemoveOwner';
    const EVENT_DEPOSIT = 'Deposit';
    const EVENT_RECEIVE = 'Receive';
    const EVENT_TRANSFER_RATIO = 'TransferRatio';

    it('deve consultar nome da economia colaborativa', async() => {
        // valores esperados
        const expectedName = 'TESTE_NOME';

        // referencia para o contrato
        let wadaag = await Wadaag.new(expectedName);

        // verificacoes
        assert.equal(await wadaag.name(), expectedName, 'nao foi possivel recuperar o nome da economia colaborativa');
    });

    it('deve consultar a quantidade maximo de participantes', async() => {
        // valores esperados
        const expectedMaxOwners = 201;

        // referencia para o contrato
        let wadaag = await Wadaag.new('');

        // verificacoes
        assert.equal(await wadaag.maxOwners(), expectedMaxOwners, 'nao foi possivel recuperar o maximo de participantes permitidos');
    });

    it('deve verificar endereco participantes', async() => {
        // valores esperados
        const expectedAccountAddress = accounts[0];
        const expectedAccountValue = 100;

        // referencia para o contrato
        let wadaag = await Wadaag.new('');

        // verificacoes
        assert.isNotOk(await wadaag.isOwner(expectedAccountAddress), 'nao foi possivel validar o participante');

        // efetua depositos
        await wadaag.deposit({from: expectedAccountAddress, value: expectedAccountValue});

        // verificacoes
        assert.isOk(await wadaag.isOwner(expectedAccountAddress), 'nao foi possivel validar o participante');
    });

    it('deve consultar a quantidade de participantes registrados', async() => {
        // valores esperados
        const expectedAccountAddress_1 = accounts[0];
        const expectedAccountValue_1 = 100;
        const expectedAccountAddress_2 = accounts[1];
        const expectedAccountValue_2 = 100;

        // referencia para o contrato
        let wadaag = await Wadaag.new('');

        let result;

        // efetua depositos
        await wadaag.deposit({from: expectedAccountAddress_1, value: expectedAccountValue_2});
        await wadaag.deposit({from: expectedAccountAddress_2, value: expectedAccountValue_2});

        // consulta os participantes registrados
        result = await wadaag.listOwners();

        // verificacoes
        assert.equal((await wadaag.countOwners()).toNumber(), 2, 'nao foi possivel recuperar a quantidade de participantes registrados');
        assert.isOk(result.includes(expectedAccountAddress_1), 'nao foi possivel recuperar a lista de participantes registrados');
        assert.isOk(result.includes(expectedAccountAddress_2), 'nao foi possivel recuperar a lista de participantes registrados');
    });

    it('deve efetuar um depósito', async() => {
        // valores esperados
        const expectedAccountAddress_1 = accounts[0];
        const expectedAccountValue_1 = 100;
        const expectedAccountAddress_2 = accounts[1];
        const expectedAccountValue_2 = 100;
        const expectedAccountAddress_3 = accounts[2];
        const expectedAccountValue_3 = 100;

        // referencia para o contrato
        let wadaag = await Wadaag.new('');

        let result, event;

        // efetua depositos
        result = await wadaag.deposit({from: expectedAccountAddress_1, value: expectedAccountValue_1});

        // verificacoes
        assert.equal((await wadaag.balanceOf(expectedAccountAddress_1)).toNumber(), expectedAccountValue_1, 'nao foi possivel recuperar o saldo atual disponível para o endereco #1');
        assert.equal(await wadaag.totalOwner(expectedAccountAddress_1), expectedAccountValue_1, 'nao foi possivel recuperar o total depositado pelo endereco #1');
        event = result.logs.find( log => log.event == EVENT_ADD_OWNER );
        assert.equal(event.args.shareRatio.toNumber(), expectedAccountValue_1, 'nao foi possivel recuperar o valor depositado pelo endereco #1');

        // efetua depositos
        result = await wadaag.deposit({from: expectedAccountAddress_2, value: expectedAccountValue_2});

        // verificacoes
        assert.equal((await wadaag.balanceOf(expectedAccountAddress_2)).toNumber(), 0, 'nao foi possivel recuperar o saldo atual disponível para o endereco #2');
        assert.equal(await wadaag.totalOwner(expectedAccountAddress_2), expectedAccountValue_2, 'nao foi possivel recuperar o total depositado pelo endereco #2');
        event = result.logs.find( log => log.event == EVENT_ADD_OWNER );
        assert.equal(event.args.shareRatio.toNumber(), expectedAccountValue_2, 'nao foi possivel recuperar o valor depositado pelo endereco #2');

        // efetua depositos
        result = await wadaag.deposit({from: expectedAccountAddress_3, value: expectedAccountValue_3});

        // verificacoes
        assert.equal((await wadaag.balanceOf(expectedAccountAddress_3)).toNumber(), 0, 'nao foi possivel recuperar o saldo atual disponível para o endereco #3');
        assert.equal(await wadaag.totalOwner(expectedAccountAddress_3), expectedAccountValue_3, 'nao foi possivel recuperar o total depositado pelo endereco #3');
        event = result.logs.find( log => log.event == EVENT_ADD_OWNER );
        assert.equal(event.args.shareRatio.toNumber(), expectedAccountValue_3, 'nao foi possivel recuperar o valor depositado pelo endereco #3');

        // verificacoes
        assert.equal((await wadaag.totalDeposited()).toNumber(), expectedAccountValue_1 + expectedAccountValue_2 + expectedAccountValue_3, 'nao foi possivel recuperar o valor total depositado/compartilhado');
    });

    it('deve efetuar um saque', async() => {
        // valores esperados
        const expectedAccountAddress_1 = accounts[0];
        const expectedAccountValue_1 = 100;
        const expectedAccountAddress_2 = accounts[1];
        const expectedAccountValue_2 = 100;
        const expectedAccountAddress_3 = accounts[2];
        const expectedAccountValue_3 = 100;

        // referencia para o contrato
        let wadaag = await Wadaag.new('');

        let result;

        // efetua depositos
        await wadaag.deposit({from: expectedAccountAddress_1, value: expectedAccountValue_1});
        await wadaag.deposit({from: expectedAccountAddress_2, value: expectedAccountValue_2});
        await wadaag.deposit({from: expectedAccountAddress_3, value: expectedAccountValue_3});

        // consulta saldo da conta economia colaborativa
        let balanceBeforeWithdrawal = await wadaag.balanceOf(expectedAccountAddress_2);

        // consulta saldo da conta
        let oldBalance = web3.utils.toBN(await web3.eth.getBalance(expectedAccountAddress_2));

        // efetua saque
        await wadaag.withdrawal({from: expectedAccountAddress_2});
        
        // consulta saldo da conta economia colaborativa
        let balanceAfterWithdrawal = await wadaag.balanceOf(expectedAccountAddress_2);

        // consulta saldo da conta
        let newBalance = web3.utils.toBN(await web3.eth.getBalance(expectedAccountAddress_2));

        // verificacoes
        assert.equal(balanceAfterWithdrawal.toNumber(), 0, 'nao foi possivel recuperar o saldo atual disponível para o endereco #2');
        // assert.equal(balanceBeforeWithdrawal.plus(oldBalance).toNumber(), newBalance, 'nao foi possivel validar o saldo do endereco #2');
    });

    it('deve efetuar uma transferência', async() => {
        // nome esperado
        const expectedName = 'TESTE_TRANSFERENCIA';

        // referencia para o contrato
        let wadaag = await Wadaag.new(expectedName);
    });
});