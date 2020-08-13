import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Q from 'q';

import { blockUI, unblockUI } from '../actions/BlockerAction';
import WadaagService from '../services/WadaagService';

/**
 * Componente responsavel por exibir as interfaces do contrato.
 *
 * @author bortes
 */
class Wadaag extends Component {
    state = {
        accountAddress: '',
        contractName: '',
        socialContractName: '',
        isOwner: false
    };

    componentDidMount() {
        const { blockUI, unblockUI } = this.props;

        blockUI('carregando dados...');

        Q.all([
            WadaagService.getAccountAddress(),
            WadaagService.getContractName(),
            WadaagService.getSocialContractName(),
            WadaagService.isOwner(),
        ])
            .then((data) => {
                const [accountAddress, contractName, socialContractName, isOwner] = data;

                this.setState({
                    accountAddress,
                    contractName,
                    socialContractName,
                    isOwner,
                });
            })
            .finally(() => {
                unblockUI();
            });
    }

    /**
     * Renderiza o componente.
     *
     * @author bortes
     */
    render() {
        const {
            accountAddress,
            contractName,
            socialContractName,
        } = this.state;

        return (
            <Modal centered size="lg" show={true}>
                <Modal.Header>
                    <Modal.Title>
                        Seja bem vindo ao <span className="text-warning">{accountAddress}</span>!
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p className="h5 mb-3">
                        Você esta acessando o <span className="text-warning">{socialContractName}</span>, uma economia colaborativa do projeto <span className="text-warning">{contractName}</span>.
                    </p>

                    <p className="h5 mb-3">
                        Você sabe o que é economia colaborativa?
                    </p>

                    <p className="h5 mb-3 pl-3 border-left font-italic">
                        Economia colaborativa se baseia no fato de que para reduzir as diferenças sociais precisamos compartilhar ao contrário de acumular.
                    </p>

                    <p className="h5 mb-3">
                        Faça um depósito agora mesmo para começar a investir nesta ideia.
                    </p>
                </Modal.Body>
            </Modal>
        );
    }
}


/**
 * Mapeia o estado da aplicacao na propriedade ".props" disponibilizadas dentro dos componentes.
 *
 * @author bortes
 */
const mapStateToProps = (state) => ({
})

/**
 * Mapeia os eventos na propriedade ".props" disponibilizadas dentro dos componentes.
 *
 * @author bortes
 */
const mapDispatchToProps = { blockUI, unblockUI };

export default connect(mapStateToProps, mapDispatchToProps)(Wadaag);