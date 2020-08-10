# fiap-blc-ethereum-dapps-and-api-integration

Repositório para o projeto de _Ethereum Dapps and API integrations_.

## 1. integrantes

+ Leonardo Santos,
+ Carlos Ulysses,
+ Eduardo Borges,
+ Sergio Henrique

## 2. sobre o repositório

O repositório possui a seguinte estrutura:

+ [LICENSE](./LICENSE), licença aplicado ao projeto
+ [README.md](./README.md), documentação básica sobre o repositório

A estrutura básica foi criada utilizando os commandos `npm init`, `truffle init` e `npx create-react-app app`.

### 2.1 configuração ambiente

Tanto para codificação quanto execução precisamos apenas do:

+ [NodeJS](https://nodejs.org/) 10.17.0 ou superior
+ [Node.js Package Manager](https://www.npmjs.com/) 6.11.3 ou superior
+ [Node.js Package Runner](https://github.com/npm/npx/) 6.11.3 ou superior
+ [Truffle](https://www.trufflesuite.com/truffle/) 5.0.38 ou superior
+ [Solidity](https://solidity.readthedocs.io/en/latest/) 0.5.4 ou superior
+ [Ganache](https://www.trufflesuite.com/ganache/) 6.7.0 ou superior
+ [Solidity Compiler](https://solidity.readthedocs.io/en/latest/installing-solidity.html) 0.5.16+commit.9c3226ce ou superior
+ registro na [Infura](https://infura.io/) para acessar os nós da rede de testes `ropsten`
+ _demais dependências em [package.json](./contract/package.json)_

Parte das variáveis de ambiente são carregadas via arquivo **.env**. Segue lista das variáveis utilizadas:

|Nome|Descrição|
|---|---|
|**SEED_MNEMONIC**|frase/semente utilizada para recuperar a chave privada|
|**INFURA_PROJECT_ENDPOINT**|endereço de acesso ao projeto da _Infura_|
|**REACT_APP_CONTRACT_ADDRESS**|endereço/ENS para acesso ao contrato|
|**REACT_APP_HTTP_PROVIDER**|endereço do servidor para acesso a rede via HTTPS|

## 3. commandos

Abaixo os comandos utilizados para o desenvolvimento.

### 3.1 compilar o contrato

Para compilar o contrato, utilize o comando:

```bash
$ truffle compile
```

>
> os ABI serão gerados no diretório [app/src/contracts](./app/src/contracts), conforme definido nas configurações do _Truffle_.
>

### 3.2 testar o contrato

Antes de executar os testes, será necessário iniciar _Ganache_ com o seguinte comando: 

```bash
$ ganache-cli
```

Em seguida, para testar o contrato, execute:

```bash
$ truffle test
```

O contrato será compilado e publicado na rede padrão `development`, configurada para acessar a instância do _Ganache_.

### 3.3 publicar o contrato na `ropsten`

Para publicar o contrato na rede de teste `ropsten` utilize o seguinte comando:

```bash
$ truffle migrate --network ropsten
```

Este comando irá publicar via os nós da `Infura`, utilizando a chave privada e o projeto especificado por meios das váriaveis `SEED_MNEMONIC` e `INFURA_PROJECT_ENDPOINT`.

## 4. sobre os requisitos

> Faça um frontend para interagir com este smart contract.
> 
> O frontend pode ser baseado em qualquer um dos exemplos de frontend apresentados em aula, que se encontram neste link:
> 
> dapp-register
> 
> O frontend deve ter chamadas para todas as funções e variáveis públicas do smart contract.
> 
> O frontend será avaliado pelos critérios:
> 
> design
> tratamento de erros
> atende às especificações listadas acima
> Tratamento de erros
> Por tratamento de erros, será avaliado qual o retorno quando tentamos interagir de forma errada com o token
