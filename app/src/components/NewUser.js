import React, { useEffect, useState } from 'react';
import { 
    Button, 
    Form, 
    Modal,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Q from 'q';

import { blockUI, unblockUI } from '../actions/BlockerAction';
import { notifySuccess, notifyError } from '../actions/NotifierAction';
import AccountService from '../services/AccountService';
import WadaagService from '../services/WadaagService';

/**
 * Componente responsavel por exibir a pagina para novos usuarios.
 *
 * @author bortes
 */
function NewUser(props) {
    const [ready, setReady] = useState(false);

    const [accountAddress, setAccountAddress] = useState();
    const [contractName, setContractName] = useState();
    const [socialName, setSocialName] = useState();

    const [depositAmout, setDepositAmount] = useState(0);
    const [depositValid, setDepositValid] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(blockUI('carregando dados...'));

        Q.all([
            AccountService.getAccountAddress(),

            WadaagService.getContractName(),
            WadaagService.getSocialName()
        ])
            .then((data) => {
                const [
                    accountAddress, 
                    contractName, 
                    socialName
                ] = data;

                setAccountAddress(accountAddress);

                setContractName(contractName);
                setSocialName(socialName);
            })
            .finally(() => {
                setReady(true)
                dispatch(unblockUI());
            });
    }, []);

    const handleChangeAmount = event => {
        const value = event.target.value;

        setDepositAmount(value);
        setDepositValid(!(parseInt(value, 10) > 0));
    };

    const handleDeposit = event => {
        dispatch(blockUI('solicitando depósito...'));

        WadaagService.deposit(depositAmout)
            .then(data => {
                const [ message ] = data;

                dispatch(notifySuccess(message.title, message.detail));
            })
            .catch(reason => {
                const [ message ] = reason;

                dispatch(notifyError(message.title, message.detail));
            })
            .finally(() => {
                dispatch(unblockUI());
            });
    };

    if (!ready) {
        return null;
    }

    return (
        <Modal centered size="lg" show={true}>
            <Modal.Header>
                <Modal.Title as="h3">
                    Seja bem vindo <span className="text-warning text-break">{accountAddress}</span>!
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="h5 mb-5">
                    Você esta acessando o <span className="text-warning">{socialName}</span>, uma <span className="text-secondary">economia colaborativa</span> baseada no projeto <span className="text-warning">{contractName}</span>.
                </p>

                <p className="h5 mb-5">
                    Sabe o que é <span className="text-secondary">economia colaborativa</span>?
                </p>

                <p className="h5 mb-5 pl-3 border-left font-italic">
                    <span className="text-secondary">Economia colaborativa</span> é um modelo de negócios baseado na ideia de que ao contrário de acumular devemos compartilhar.
                </p>

                <p className="h5 mb-5">
                    Legal né? Que tal fazer parte? Quanto mais compartilharmos mais reduziremos as diferenças sociais.
                </p>

                <p className="h5 mb-5">
                    Para fazer parte do <span className="text-warning">{socialName}</span> é necessário <span className="text-danger">efetuar um depósito com um valor qualquer</span>.
                </p>

                <p className="h5 mb-5">
                    O valor depositado será compartilhado entre todos participantes.
                </p>

                <p className="h5 mb-5">
                    Assim que a transação for processada e um novo bloco gerado você tornará-se um <span className="text-warning">participante</span> e então fará parte do <span className="text-warning">{socialName}</span>.
                </p>
            </Modal.Body>

            <Modal.Footer className="d-block">
                <Form>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Valor do deposíto que deseja compartilhar em WEI" size="lg" onChange={handleChangeAmount} isInvalid={depositValid} id="depositAmount" autoComplete="off" />
                        <Form.Control.Feedback type="invalid">Informe apenas números. Não uso pontos, vírgulas ou qualquer outro caracter não númerico.</Form.Control.Feedback>
                    </Form.Group>
                </Form>

                <Button variant="secondary" size="lg" block onClick={handleDeposit} disabled={depositValid}>DEPOSITAR</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default NewUser;