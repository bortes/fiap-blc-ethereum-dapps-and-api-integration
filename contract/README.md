# sobre o contrato

> Wadaag é um projeto de economia colaborativa. Quando uma pessoa fize>r um depósito em Ether utilizando a função deposit, o valor depositado será dividido proporcionalmente pelas pessoas que já fizeram depósitos antes. Quando uma nova pessoa fizer depósito, a pessoa anterior vai receber a sua parte também.

O contrato criado por **SOLANGE GUEIROS** disponível [aqui](https://github.com/solangegueiros/fiap-blc-ethereum-dapps-and-api-integration/blob/master/grupo_5/Wadaag.sol).

O objetivo do contrato é apresentar um exemplo de uma economia colaborativa.

Quando um endereço efetua um depósito ou recebe uma transferência ele automáticamente torna-se participante da economia colaborativa.

Depósitos efetuados são distribuídos entre os participantes já registrados.

Cada participante registrado possui uma fração da economia colaborativa.

Ao realizar um depósito o valor será distribuído proporcionalmente entre os endereços já participantes.

## 1. funcionalidades

As funcionalidades **públicas** estão acessíveis por meio do **ABI** do [contrato](./contracts/Wadaag.sol).

Qualquer endereço pode se auto registrar por meio da funcionalidade **deposit**.

Também é possível registrar endereços por meio da funcionalidade **transferRatio**.

### 1.1 balanceOf

Recupera o saldo atual disponível para o endereço informado.

#### 1.1.1 parâmetros

1. `account`: `ADDRESS`, 20 Bytes - endereço para consulta

#### 1.1.2 retorno

1. `QUANTITY`, 32 Bytes - valor total depositado

### 1.2 countOwners

Retorna a quantidade de participantes registrados.

#### 1.2.1 parâmetros

#### 1.2.2 retorno

1. `QUANTITY`, 32 Bytes - quantidade de participantes registrados

### 1.3 deposit

Efetua um depósito/aplicação no valor informado para o endereço informado.

#### 1.3.1 parâmetros

1. `from`, `ADDRESS`, 20 Bytes - endereço para depósito
2. `value`, `QUANTITY`, 32 Bytes - valor que será depositado

#### 1.3.2 retorno

### 1.4 isOwner

Verifica se o endereço informado esta registrado como participante.

#### 1.4.1 parâmetros

1. `_address`: `ADDRESS`, 20 Bytes - endereço para verificação

#### 1.4.2 retorno

1. `BOOLEAN` - `true` quando o endereço informado estiver registrado, caso contrário `false`

### 1.5 listOwners

Recupera a lista de endereços registrados como participantes.

#### 1.5.1 parâmetros

#### 1.5.2 retorno

1. `ARRAY of ADDRESS`, 20 Bytes - endereço dos participantes registrados

### 1.6 maxOwners

Retorna a quantidade máxima de participantes aceitos pela micro economia.

#### 1.6.1 parâmetros

#### 1.6.2 retorno

1. `QUANTITY`, 8 Bytes - quantidade máxima de participantes aceitos

### 1.7 name

Retorna o nome atribuído à micro economia.

#### 1.7.1 parâmetros

#### 1.7.2 retorno

1. `STRING` - nome da micro economia

### 1.8 percOf

Recupera o percentual de participação do endereço informado em relação ao valor total depositado e compartilhado por todos os endereços participantes.

#### 1.8.1 parâmetros

1. `account`: `ADDRESS`, 20 Bytes - endereço para consulta

#### 1.8.2 retorno

1. `QUANTITY`, 32 Bytes - percentual de participação do endereço informado

### 1.9 totalDeposited

Recupera o valor total depositado e compartilhado por todos os endereços participantes.

#### 1.9.1 parâmetros

#### 1.9.2 retorno

1. `QUANTITY`, 32 Bytes - valor total depositado

### 1.10 totalOwner

Recupera o valor total depositado pelo endereço informado.

#### 1.10.1 parâmetros

1. `ADDRESS`, 20 Bytes - endereço para consulta

#### 1.10.2 retorno

1. `QUANTITY`, 32 Bytes - valor total depositado pelo endereço

### 1.11 transferRatio

Transfere um percentual do valor total depositado por um endereço participante para um outro endereço.

#### 1.11.1 parâmetros

1. `account`: `ADDRESS`, 20 Bytes - endereço de destino da transferência
2. `per`, `QUANTITY`, 32 Bytes - percentual que será transferido

#### 1.11.2 retorno

### 1.12 withdrawal

Efetua o saque/resgate do saldo total disponível para o endereço informado.

#### 1.12.1 parâmetros

1. `from`, `ADDRESS`, 20 Bytes - endereço para saque

#### 1.12.2 retorno
