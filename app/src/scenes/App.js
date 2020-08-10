import React, { Component } from 'react';
import { connect } from 'react-redux';
import UIBlocker from 'react-ui-blocker';
import Modal from 'react-bootstrap/Modal';

import { blockUI, unblockUI } from '../actions/BlockerAction';
import Wadaag from '../components/Wadaag';
import WadaagService from '../services/WadaagService';

/**
 * Componente responsavel por exibir a pagina principal.
 *
 * @author bortes
 */
class App extends Component {
    state = {
        hasError: false,
        socialContractName: '-',
    };

    componentDidMount() {
        const { blockUI, unblockUI } = this.props;

        blockUI('conectando-se a rede...');

        WadaagService.getSocialContractName()
            .then(data => {
                this.setState({
                    socialContractName: data,
                });
            })
            .catch(reason => {
                this.setState({
                    hasError: true,
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
        const { blocked, blockMessage } = this.props;

        const { 
            hasError,
            socialContractName,
        } = this.state;

        return (
            <main role="main">
                <div className="jumbotron">
                    <div className="container">
                        <h1 className="display-3"><span className="text-danger">Olá</span>, {socialContractName}!!</h1>
                        <p>Esta é uma página exemplo construída em <a className="text-danger" href="https://reactjs.org/">React</a> e <a className="text-danger" href="https://getbootstrap.com/">Bootstrap</a>.</p>
                    </div>
                </div>

                {!hasError && <Wadaag />}

                <Modal show={hasError}>
                    <Modal.Header>
                        <div className="modal-title h4 text-danger">Ops!!</div>
                    </Modal.Header>

                    <Modal.Body>
                        <p>
                            Não foi possível se conectar à rede blockchain.
                        </p>
                        <p>
                            Por favor, verifique sua conexão com a rede e se o contrato esta publicado. Tente novamente.
                        </p>
                    </Modal.Body>
                </Modal>

                <UIBlocker
                    theme="bounce"
                    isVisible={blocked}
                    message={blockMessage}
                />
            </main>
        );
    }
}

/**
 * Mapeia os estados na propriedade ".props" disponibilizadas dentro dos componentes.
 *
 * @author bortes
 */
const mapStateToProps = (store) => ({
    blocked: store.blockerState.blocked,
    blockMessage: store.blockerState.blockMessage
});


/**
 * Mapeia os eventos na propriedade ".props" disponibilizadas dentro dos componentes.
 *
 * @author bortes
 */
const mapDispatchToProps = { blockUI, unblockUI };

export default connect(mapStateToProps, mapDispatchToProps)(App);