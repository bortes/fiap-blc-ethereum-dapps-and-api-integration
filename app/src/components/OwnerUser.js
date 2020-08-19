import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Q from 'q';

import { blockUI, unblockUI } from '../actions/BlockerAction';
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
    const [socialContractName, setSocialContractName] = useState();
    const [totalRegisteredOwners, setTotalRegisteredOwners] = useState();
    const [totalAllowedOwners, setTotalAllowedOwners] = useState();
    const [registeredOwners, setRegisteredOwners] = useState();
    const [depositedAmount, setDepositedAmount] = useState();
    const [balanceOf, setBalanceOf] = useState();
    const [percentageOf, setPercentageOf] = useState();
    const [depositedAmountOf, setDepositedAmountOf] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(blockUI('carregando dados...'));

        Q.all([
            WadaagService.getContractName(),
            WadaagService.getAccountAddress(),
            WadaagService.getSocialContractName(),
            WadaagService.getTotalRegisteredOwners(),
            WadaagService.getTotalAllowedOwners(),
            WadaagService.getRegisteredOwners(),
            WadaagService.getDepositedAmount(),
            WadaagService.getBalanceOf(),
            WadaagService.getPercentageOf(),
            WadaagService.getDepositedAmountOf(),
        ])
            .then((data) => {
                const [contractName, accountAddress, socialContractName, totalRegisteredOwners, totalAllowedOwners, registeredOwners, depositedAmount, balanceOf, percentageOf, depositedAmountOf] = data;

                setContractName(contractName);
                setAccountAddress(accountAddress);
                setSocialContractName(socialContractName);
                setTotalRegisteredOwners(totalRegisteredOwners);
                setTotalAllowedOwners(totalAllowedOwners);
                setRegisteredOwners(registeredOwners);
                setDepositedAmount(depositedAmount);
                setBalanceOf(balanceOf);
                setPercentageOf(percentageOf);
                setDepositedAmountOf(depositedAmountOf);

            })
            .finally(() => {
                setReady(true)
                dispatch(unblockUI());
            });
    }, []);

    if (!ready) {
        return (<div></div>);
    }

    return (
        <Form>
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    nome do contrato
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={contractName} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    seu endereço
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={accountAddress} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    nome do grupo
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={socialContractName} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    total de participantes registrados
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={totalRegisteredOwners} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    total de participantes permitidos
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={totalAllowedOwners} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    participantes
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={registeredOwners} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    total compartilhado
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={depositedAmount} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    saldo
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={balanceOf} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    percentual do total compartilhado
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={percentageOf} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    depositedAmountOf
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={depositedAmountOf} />
                </Col>
            </Form.Group>
        </Form>
    );
}

export default OwnerUser;