import Vue from 'vue';

// EventHub para emitir eventos
export default ({app}, inject) => {
    const adm = new Vue({
        data() {
            return {
                //api: 'http://localhost:8080/v1',
                api: 'https://erpapi.admdigital.com.br/v1',
                version: 'v. 1.0.2',
                menu: [],
                listVendedor: [],
                listLoja: [],
                listFPags: [],
                listOrigensAtiva: [],
                listCCReceita: [],
                listCCDespeza: [],
                listCCAtiva: [],
                listCCorrente: [],
                listUsuario: [],
                listPerfil: [],
                listSupUsuario: [],
                listEstoqClasse: [],
                listEstoqUnidades: [],
                listEstoqMarcas: [],
                listEstoqGrupos: [],
                listGrupoCTesouraria: []
            }
        },
        methods: {
            tokenRefreshRequired(errorRequest) {
                if (errorRequest === 'Token Inválido' || errorRequest === 'Tempo expirado') {
                    this.$emit('refreshToken');
    
                    return true;
                }
    
                return false;
            },
            localeString(e, min = 2, max = 2) {
                return Number(e).toLocaleString('pt-br', {
                    minimumFractionDigits: min,
                    maximumFractionDigits: max
                });
            },
            getListFPag() {
                if (!window.sessionStorage.getItem('fpags')) {
                    app.$axios.get(`${this.api}/financeiro/list_formpag/`)
                        .then((response) => {
                            window.sessionStorage.setItem('fpags', JSON.stringify(response.data));

                            this.listFPags = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });
                } else {

                    this.listFPags = JSON.parse(window.sessionStorage.getItem('fpags'));

                }
            },
            // lista vendedores
            getListVendedor() {
                if (!window.sessionStorage.getItem('seller')) {
                    app.$axios.get(`${this.api}/estoque/list_vendedores/`)
                        .then((response) => {
                            window.sessionStorage.setItem('seller', JSON.stringify(response.data));

                            this.listVendedor = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    this.listVendedor = JSON.parse(window.sessionStorage.getItem('seller'));

                }
            },
            // lista loja
            getListLoja() {
                if (!window.sessionStorage.getItem('store')) {
                    app.$axios.get(`${this.api}/estoque/list_lojas/`)
                        .then((response) => {
                            window.sessionStorage.setItem('store', JSON.stringify(response.data));

                            this.listLoja = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    this.listLoja = JSON.parse(window.sessionStorage.getItem('store'));

                }
            },
            getListOrigemAtiva() {
                if (!window.sessionStorage.getItem('origens')) {
                    app.$axios.get(`${this.api}/financeiro/list_origem_ativa/`)
                        .then((response) => {
                            window.sessionStorage.setItem('origens', JSON.stringify(response.data));

                            this.listOrigensAtiva = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    this.listOrigensAtiva = JSON.parse(window.sessionStorage.getItem('origens'));

                }
            },
            getListCCReceita() {
                if (!window.sessionStorage.getItem('ccreceita')) {
                    app.$axios.get(`${this.api}/financeiro/list_ccreceita`)
                        .then((response) => {
                            window.sessionStorage.setItem('ccreceita', JSON.stringify(response.data));

                            this.listCCReceita = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    this.listCCReceita = JSON.parse(window.sessionStorage.getItem('ccreceita'));

                }
            },
            getListCCDespeza() {
                if (!window.sessionStorage.getItem('ccdespeza')) {
                    app.$axios.get(`${this.api}/financeiro/list_ccdespesa`)
                        .then((response) => {
                            window.sessionStorage.setItem('ccdespeza', JSON.stringify(response.data));

                            this.listCCDespeza = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    this.listCCDespeza = JSON.parse(window.sessionStorage.getItem('ccdespeza'));

                }
            },
            getListCCAtiva() {
                if (!window.sessionStorage.getItem('ccativa')) {
                    app.$axios.get(`${this.api}/financeiro/list_ccativa/`)
                        .then((response) => {
                            window.sessionStorage.setItem('ccativa', JSON.stringify(response.data));

                            this.listCCAtiva = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    this.listCCAtiva = JSON.parse(window.sessionStorage.getItem('ccativa'));

                }
            },
            getListCCorrente(force = false) {
                if (!window.sessionStorage.getItem('ccorrente') || force) {
                    app.$axios.get(`${this.api}/financeiro/list_ccorrente/`)
                        .then((response) => {
                            window.sessionStorage.setItem('ccorrente', JSON.stringify(response.data));

                            this.listCCorrente = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    this.listCCorrente = JSON.parse(window.sessionStorage.getItem('ccorrente'));

                }
            },
            getListUsuario() {
                if (!window.sessionStorage.getItem('listusuario')) {
                    app.$axios.get(`${this.api}/usuario/list_usuarios/`)
                        .then((response) => {
                            window.sessionStorage.setItem('listusuario', JSON.stringify(response.data));

                            this.listUsuario = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    this.listUsuario = JSON.parse(window.sessionStorage.getItem('listusuario'));

                }
            },
            getListPerfil() {
                if (!window.sessionStorage.getItem('listperfil')) {
                    app.$axios.get(`${this.api}/suporte/lista_perfil/`)
                        .then((response) => {
                            window.sessionStorage.setItem('listperfil', JSON.stringify(response.data));

                            this.listPerfil = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    this.listPerfil = JSON.parse(window.sessionStorage.getItem('listperfil'));

                }
            },
            getListSupUsuario(force = false) {
                if (!window.sessionStorage.getItem('listsupusuario') || force) {
                    app.$axios.get(`${this.api}/suporte/lista_usuario/`)
                        .then((response) => {
                            window.sessionStorage.setItem('listsupusuario', JSON.stringify(response.data));

                            this.listSupUsuario = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    this.listSupUsuario = JSON.parse(window.sessionStorage.getItem('listsupusuario'));

                }
            },
            getListEstoqClasse() {
                if (!window.sessionStorage.getItem('list_classe')) {
                    app.$axios.get(`${this.api}/estoque/list_classe/`)
                        .then((response) => {
                            window.sessionStorage.setItem('list_classe', JSON.stringify(response.data));

                            this.listEstoqClasse = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    this.listEstoqClasse = JSON.parse(window.sessionStorage.getItem('list_classe'));

                }
            },
            getListEstoqUnidades() {
                if (!window.sessionStorage.getItem('list_unidades')) {
                    app.$axios.get(`${this.api}/estoque/list_unidades/`)
                        .then((response) => {
                            window.sessionStorage.setItem('list_unidades', JSON.stringify(response.data));

                            this.listEstoqUnidades = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    this.listEstoqUnidades = JSON.parse(window.sessionStorage.getItem('list_unidades'));

                }
            },
            getListEstoqMarcas(cat = 1) {
                if (!window.sessionStorage.getItem('list_marcas')) {
                    app.$axios.get(`${this.api}/estoque/list_marcas/${cat}`)
                        .then((response) => {
                            window.sessionStorage.setItem('list_marcas', JSON.stringify(response.data));

                            let o = response.data;
                            let l = [];
                            o.forEach((el) => {
                                l.concat(el);
                            });

                            this.listEstoqMarcas = o;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    let o = JSON.parse(window.sessionStorage.getItem('list_marcas'));
                    let l = [];
                    o.forEach((el) => {
                        l.concat(el);
                    });

                    this.listEstoqMarcas = o;

                }
            },
            getListEstoqGrupos(cat = 1) {
                if (!window.sessionStorage.getItem('list_grupos')) {
                    app.$axios.get(`${this.api}/estoque/list_grupos/${cat}`)
                        .then((response) => {
                            window.sessionStorage.setItem('list_grupos', JSON.stringify(response.data));

                            this.listEstoqGrupos = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    this.listEstoqGrupos = JSON.parse(window.sessionStorage.getItem('list_grupos'));

                }
            },
            getListGrupoCTesouraria() {
                if (!window.sessionStorage.getItem('grupo_ctesouraria')) {
                    app.$axios.get(`${this.api}/financeiro/ccgrupo/`)
                        .then((response) => {
                            window.sessionStorage.setItem('grupo_ctesouraria', JSON.stringify(response.data));

                            this.listGrupoCTesouraria = response.data;
                        })
                        .catch((error) => {
                            this.tokenRefreshRequired(error.response.data);
        
                            this.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        });

                } else {

                    this.listGrupoCTesouraria = JSON.parse(window.sessionStorage.getItem('grupo_ctesouraria'));

                }
            },
        }
    });

    inject('adm', adm);
}

// Vue.prototype.$adm = 