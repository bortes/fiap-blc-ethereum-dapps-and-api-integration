import React, { useEffect, useRef, useState } from 'react';
import { 
    Alert, 
    Button, 
    Card,
    Col, 
    Container,
    Form, 
    InputGroup,
    Jumbotron,
    ListGroup,
    Row, 
    Spinner,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Q from 'q';

import { blockUI, unblockUI } from '../actions/BlockerAction';
import { notifySuccess, notifyError } from '../actions/NotifierAction';
import AccountService from '../services/AccountService';
import WadaagService from '../services/WadaagService';

/**
 * Componente responsavel por exibir a pagina para usuarios ja registrados.
 *
 * @author bortes
 */
function OwnerUser(props) {
    const [ready, setReady] = useState(false);

    const [contractName, setContractName] = useState();
    const [accountAddress, setAccountAddress] = useState();
    const [socialName, setSocialName] = useState();
    const [totalRegisteredOwners, setTotalRegisteredOwners] = useState();
    const [totalAllowedOwners, setTotalAllowedOwners] = useState();
    const [registeredOwners, setRegisteredOwners] = useState();
    const [depositedAmount, setDepositedAmount] = useState();
    const [isOwner, setIsOwner] = useState();
    const [balanceOf, setBalanceOf] = useState();
    const [percentageOf, setPercentageOf] = useState();
    const [depositedAmountOf, setDepositedAmountOf] = useState();

    const formDeposit = useRef();
    const formTransfer = useRef();
    const formWithdrawal = useRef();

    const [depositAmountValid, setDepositAmountValid] = useState();
    const [transferRatioValid, setTransferRatioValid] = useState();
    const [transferAddressValid, setTransferAddressValid] = useState();

    const [waitDeposit, setWaitDeposit] = useState();
    const [waitTransfer, setWaitTransfer] = useState();
    const [waitWithdrawal, setWaitWithdrawal] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        WadaagService.onDepositEvent(handleDepositEvent);
        WadaagService.onTransferEvent(handleTransferEvent);

        dispatch(blockUI('carregando dados...'));

        Q.all([
            AccountService.getAccountAddress(),

            WadaagService.getContractName(),
            WadaagService.getSocialName(),
            WadaagService.getTotalRegisteredOwners(),
            WadaagService.getTotalAllowedOwners(),
            WadaagService.getRegisteredOwners(),
            WadaagService.getDepositedAmount(),
            WadaagService.isOwner(),
            WadaagService.getBalanceOf(),
            WadaagService.getPercentageOf(),
            WadaagService.getDepositedAmountOf(),
        ])
            .then((data) => {
                const [
                    accountAddress, 
                    contractName, 
                    socialName, 
                    totalRegisteredOwners, 
                    totalAllowedOwners, 
                    registeredOwners, 
                    depositedAmount, 
                    isOwner, 
                    balanceOf, 
                    percentageOf, 
                    depositedAmountOf
                ] = data;

                setAccountAddress(accountAddress);

                setContractName(contractName);
                setSocialName(socialName);
                setTotalRegisteredOwners(totalRegisteredOwners);
                setTotalAllowedOwners(totalAllowedOwners);
                setRegisteredOwners(registeredOwners);
                setDepositedAmount(depositedAmount);
                setIsOwner(isOwner);
                setBalanceOf(balanceOf);
                setPercentageOf(percentageOf/100);
                setDepositedAmountOf(depositedAmountOf);
            })
            .finally(() => {
                setReady(true)
                dispatch(unblockUI());
            });
    }, []);

    const handleDepositEvent = data => {
        const _value = parseInt(data.returnValues._value, 10);

        dispatch(blockUI('atualizando dados...'));

        Q.all([
            WadaagService.getTotalRegisteredOwners(),
            WadaagService.getBalanceOf(),
            WadaagService.getPercentageOf(),
            WadaagService.getDepositedAmountOf(),
        ])
            .then((data) => {
                const [
                    totalRegisteredOwners,
                    balanceOf, 
                    percentageOf, 
                    depositedAmountOf
                ] = data;

                setTotalRegisteredOwners(totalRegisteredOwners);
                setDepositedAmount(previousDepositedAmount => parseInt(previousDepositedAmount, 10) + _value);
                setBalanceOf(balanceOf);
                setPercentageOf(percentageOf/100);
                setDepositedAmountOf(depositedAmountOf);
            })
            .finally(() => {
                dispatch(unblockUI());
            });
    }

    const handleTransferEvent = data => {
        dispatch(blockUI('atualizando dados...'));

        Q.all([
            WadaagService.getPercentageOf(),
            WadaagService.getDepositedAmountOf(),
        ])
            .then((data) => {
                const [
                    percentageOf, 
                    depositedAmountOf
                ] = data;

                setPercentageOf(percentageOf/100);
                setDepositedAmountOf(depositedAmountOf);
            })
            .finally(() => {
                dispatch(unblockUI());
            });
    }

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 6) return 'Boa madrugada';
        if (hour < 13) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    }

    const handleDeposit = event => {
        event.preventDefault();

        const { depositAmount } = formDeposit.current;
        const errors = [];

        !(/^\d+$/.test(depositAmount.value) && parseInt(depositAmount.value, 10) > 0) && errors.push(null) > 0
            ? setDepositAmountValid(false)
            : setDepositAmountValid(true);

        if (errors.length > 0) return;

        dispatch(blockUI('solicitando depósito...'));
        setWaitDeposit(true);

        WadaagService.deposit(depositAmount.value)
            .then(data => {
                const [ message ] = data;

                depositAmount.form.reset();

                setDepositAmountValid();

                setIsOwner(true);

                dispatch(notifySuccess(message.title, message.detail));
            })
            .catch(reason => {
                const [ message ] = reason instanceof String ? ['Não foi possível efetuar a solicitação', reason] : reason;

                dispatch(notifyError(message.title, message.detail));
            })
            .finally(() => {
                setWaitDeposit(false);

                dispatch(unblockUI());
            });
    };

    const handleTransfer = event => {
        event.preventDefault();

        const { transferRatio, transferAddress } = formTransfer.current;
        const errors = [];

        !(/^(100|\d\d?|\d\d?\.\d\d)$/.test(transferRatio.value) && parseFloat(transferRatio.value, 10) > 0) && errors.push(null) > 0
            ? setTransferRatioValid(false)
            : setTransferRatioValid(true);

        !(/^(0x)?[a-fA-F\d]{40}$/.test(transferAddress.value)) && errors.push(null) > 0
            ? setTransferAddressValid(false)
            : setTransferAddressValid(true);

        if (errors.length > 0) return;

        dispatch(blockUI('solicitando transferência...'));
        setWaitTransfer(true);

        WadaagService.transferTo((/^0x/.test(transferAddress.value) ? '' : '0x') + transferAddress.value, parseFloat(transferRatio.value, 10) * 100)
            .then(data => {
                const [ message ] = data;

                transferRatio.form.reset();

                setTransferRatioValid();
                setTransferAddressValid();

                dispatch(notifySuccess(message.title, message.detail));
            })
            .catch(reason => {
                const [ message ] = reason instanceof String ? ['Não foi possível efetuar a solicitação', reason] : reason;

                dispatch(notifyError(message.title, message.detail));
            })
            .finally(() => {
                setWaitTransfer(false);

                dispatch(unblockUI());
            });
    };

    const handleWithdrawal = event => {
        event.preventDefault();

        dispatch(blockUI('solicitando saque...'));
        setWaitWithdrawal(true);

        WadaagService.withdrawal()
            .then(data => {
                const [ message ] = data;

                setBalanceOf(0);

                dispatch(notifySuccess(message.title, message.detail));
            })
            .catch(reason => {
                const [ message ] = reason;

                dispatch(notifyError(message.title, message.detail));
            })
            .finally(() => {
                setWaitWithdrawal(false);

                dispatch(unblockUI());
            });
    };

    if (!ready) {
        return null;
    }

    const addresses = []

    for (const [index, value] of registeredOwners.entries()) {
        if (index == 0) continue;

        addresses.push(
            <Col lg="4" key={'address-'+ index}>
                <ListGroup>
                    <ListGroup.Item>{value}</ListGroup.Item>
                </ListGroup>
            </Col>
        )
    }

    return (
        <div>
            <Alert variant="danger" className="rounded-0 text-center m-0 o-9" show={!isOwner}>
                <Alert.Heading>
                    <p className="d-lg-inline p-1">Você ainda não é um participante!</p>
                    <p className="d-lg-inline p-1"><span className="alert-link">Faça uma depósito agora</span> para se tornar um membro.</p>
                </Alert.Heading>
            </Alert>

            <Jumbotron fluid className="p-4 o-9">
                <Container>
                    <Row>
                        <Col lg="6" className="text-right text-break">
                            <p>{greeting()}, <span className="text-info lead">{accountAddress}</span>.</p>
                        </Col>
                        <Col lg="6" className="order-lg-first">
                            <h1>Seja bem vindo ao <span className="text-primary">{socialName}</span>.</h1>
                            <p>Uma <span className="text-secondary">economia colaborativa</span> baseada no projeto <span className="text-warning lead">{contractName}</span>.</p>
                        </Col>
                    </Row>
                </Container>
            </Jumbotron>

            <Container>
                <Row className="mb-4" noGutters>
                    <Col lg="3" md="6">
                        <Card bg="dark" className="o-9 h-10">
                            <Card.Body>
                                <h5>Até o momento você já <span className="text-info h3">depositou</span></h5>
                                <p className="text-right">
                                    <span className="text-info h2">{depositedAmountOf}</span> <small className="text-success">WEI</small>
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="3" md="6">
                        <Card bg="dark" className="o-9 h-10">
                            <Card.Body>
                                <h5>O que <span className="text-info h3">representa</span></h5>
                                <p className="text-right">
                                    <span className="text-info h2">{percentageOf}</span> <small className="text-success">%</small>
                                    <span className="d-block">de todo o valor depositado</span>
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="3" md="6">
                        <Card bg="dark" className="o-9 h-10">
                            <Card.Body>
                                <h5>Os <span className="text-info h3">{totalRegisteredOwners} participantes</span> registrados depositaram</h5>
                                <p className="text-right"><span className="text-info h2">{depositedAmount}</span> <small className="text-success">WEI</small></p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="3" md="6">
                        <Card bg="dark" className="o-9 h-10">
                            <Card.Body>
                                <h5>Seu saldo disponível para <span className="text-info h3">saque</span> é de</h5>
                                <p className="text-right"><span className="text-info h2">{balanceOf}</span> <small className="text-success">WEI</small></p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col lg="4">
                        <Card>
                            <Card.Body>
                                <Form ref={formDeposit} autoComplete="off">
                                    <InputGroup size="lg" className="mb-2">
                                        <Form.Control className="rounded-0" placeholder="Valor desejado" name="depositAmount" isValid={depositAmountValid} isInvalid={depositAmountValid === false} />
                                        <InputGroup.Append>
                                            <InputGroup.Text className="bg-dark text-success rounded-0">WEI</InputGroup.Text>
                                        </InputGroup.Append>
                                        <Form.Control.Feedback type="invalid">Informe um valor válido: apenas números, maior que ZERO.</Form.Control.Feedback>
                                    </InputGroup>
                                </Form>

                                <Button variant="secondary" size="lg" block onClick={handleDeposit} disabled={waitDeposit}>
                                    { waitDeposit ? <Spinner as="span" animation="grow" role="status" aria-hidden="true" /> : 'DEPOSITAR' }
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="4" className={isOwner ? '' : 'd-none'}>
                        <Card>
                            <Card.Body>
                                <Form ref={formTransfer} autoComplete="off">
                                    <InputGroup size="lg" className="mb-2">
                                        <Form.Control className="rounded-0" placeholder="Taxa desejada" name="transferRatio" maxLength={5} isValid={transferRatioValid} isInvalid={transferRatioValid === false} />
                                        <InputGroup.Append>
                                            <InputGroup.Text className="bg-dark text-success rounded-0">%</InputGroup.Text>
                                        </InputGroup.Append>
                                        <Form.Control.Feedback type="invalid">Informe uma taxa válida: entre 0.01 e 100%.</Form.Control.Feedback>
                                    </InputGroup>
                                    <InputGroup size="lg" className="mb-2">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text className="bg-dark text-success rounded-0">0x</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control className="rounded-0" placeholder="Endereço de destino" name="transferAddress" maxLength={42} isValid={transferAddressValid} isInvalid={transferAddressValid === false} />
                                        <Form.Control.Feedback type="invalid">Informe um endereço válido.</Form.Control.Feedback>
                                    </InputGroup>
                                </Form>

                                <Button variant="secondary" size="lg" block onClick={handleTransfer} disabled={waitTransfer}>
                                    { waitTransfer ? <Spinner as="span" animation="grow" role="status" aria-hidden="true" /> : 'TRANSFERIR' }
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="4" className={isOwner ? '' : 'd-none'}>
                        <Card>
                            <Card.Body>
                                <Form ref={formWithdrawal} autoComplete="off">
                                    <Form.Group>
                                        <Form.Label >
                                            <span className="text-info h2">{balanceOf}</span> <small className="text-success">WEI</small>
                                        </Form.Label>
                                    </Form.Group>
                                </Form>

                                <Button variant="secondary" size="lg" block onClick={handleWithdrawal} disabled={waitWithdrawal}>
                                    { waitWithdrawal ? <Spinner as="span" animation="grow" role="status" aria-hidden="true" /> : 'SACAR' }
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row noGutters className="mb-4">
                    {addresses}
                </Row>
            </Container>
        </div>
    );
}

export default OwnerUser;