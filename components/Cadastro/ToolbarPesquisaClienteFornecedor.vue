<template>
    <div>
        <v-toolbar
            class="mb-5"
            rounded
            dense>
            <v-text-field 
                solo
                dense
                hide-details
                single-line
                append-icon="mdi-magnify"
                :placeholder="`Pesquise por um ${ title } (Mínimo 3 letras)...`"
                v-model="search"
                :loading="searchLoading"
                @click:append="searchClient"></v-text-field>

            <v-toolbar-items>
                <v-dialog
                    v-model="dialogNewClient"
                    persistent
                    scrollable
                    max-width="480">
                    <template v-slot:activator="{ on, attrs}">
                        <v-btn 
                            text
                            small
                            v-bind="attrs"
                            v-on="on"
                            class="ml-3">
                            <v-icon>mdi-account-plus</v-icon>
                            <span class="d-none d-sm-block">&nbsp; Novo {{ title }}</span>
                        </v-btn>
                    </template>

                    <template v-slot:default="dialog">
                        <v-card :loading="loadingNewClient">
                            <v-toolbar dense>
                                <v-toolbar-title>Novo {{ title }}</v-toolbar-title>
                            </v-toolbar>

                            <v-card-text class="pt-5">
                                <v-tabs-items v-model="tabsAddNewClient" touchless>
                                    <v-tab-item>
                                        <v-text-field
                                            outlined
                                            :label="`Nome do cliente ${ title }`"
                                            placeholder="Nome do cliente"
                                            v-model="newClient.nome"></v-text-field>

                                        <div v-if="!newClientNotCPFSwitch">
                                            <v-text-field
                                                v-if="newClientCpfOrCnpj == 'cpf'"
                                                outlined
                                                label="CPF"
                                                v-model="newClient.cpf"
                                                placeholder="CPF do cliente"
                                                v-mask="'###.###.###-##'"></v-text-field>

                                            <v-text-field
                                                v-else
                                                outlined
                                                label="CNPJ"
                                                v-model="newClient.cpf"
                                                placeholder="CNPJ do cliente"
                                                v-mask="'##.###.###/####-##'"
                                                append-icon="mdi-magnify"
                                                @click:append="searchReceitaFed"></v-text-field>

                                            <v-radio-group 
                                                v-model="newClientCpfOrCnpj"
                                                row
                                                class="mt-0">
                                                <v-radio
                                                    label="CPF"
                                                    value="cpf"></v-radio>

                                                <v-radio
                                                    label="CNPJ"
                                                    value="cnpj"></v-radio>
                                            </v-radio-group>
                                        </div>

                                        <v-text-field
                                            v-if="newClientNotCPFSwitch"
                                            outlined
                                            label="Celular"
                                            placeholder="Celular do cliente"
                                            v-model="newClient.cpf"
                                            v-mask="'(##) # ####-####'"></v-text-field>
                                        
                                        <v-switch 
                                            v-model="newClientNotCPFSwitch"
                                            label="Cadastrar sem CPF"></v-switch>
                                    </v-tab-item>
                                    
                                    <!-- Cadastro com cnpj - dados da receita -->
                                    <v-tab-item>
                                        <v-text-field label="CNPJ"
                                            outlined
                                            disabled
                                            class="not-allowed"
                                            :value="newClientWithCNPJ.cpf"></v-text-field>

                                        <v-text-field label="Nome Fantasia"
                                            placeholder="Nome Fantasia"
                                            outlined
                                            v-model="newClientWithCNPJ.nome"></v-text-field>

                                        <v-text-field label="Razão Social"
                                            outlined
                                            disabled
                                            class="not-allowed"
                                            :value="newClientWithCNPJ.nome_razao"></v-text-field>

                                        <v-text-field label="Endereços"
                                            outlined
                                            disabled
                                            class="not-allowed"
                                            :value="formNewClientCNPJ1"></v-text-field>

                                        <v-text-field label="Endereços"
                                            outlined
                                            disabled
                                            class="not-allowed"
                                            :value="formNewClientCNPJ2"></v-text-field>

                                        <v-text-field label="Contato"
                                            outlined
                                            disabled
                                            class="not-allowed"
                                            :value="formNewClientCNPJContato"></v-text-field>
                                    </v-tab-item>
                                </v-tabs-items>

                                <v-overlay :value="loadingNewClient" />
                            </v-card-text>

                            <v-card-actions>
                                <v-btn
                                    text
                                    @click="dialog.value = false">
                                    Cancelar
                                </v-btn>

                                <v-btn
                                    text
                                    @click="addNewClient">
                                    Cadastrar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                </v-dialog>
            </v-toolbar-items>
        </v-toolbar>

        <v-simple-table v-if="searchResult != null">
            <thead>
                <tr>
                    <th>Nome</th>

                    <th>CPF/CNPJ</th>
                </tr>
            </thead>

            <tbody style="pointer-events: auto">
                <tr v-for="(c, i) in searchResult"
                    :key="i"
                    @click="openClienteEFornecedor(c.id)"
                    style="cursor: pointer">
                    <td>{{ c.nome}}</td>

                    <td>{{ c.cpf }}</td>
                </tr>
            </tbody>
        </v-simple-table>

        <div 
            v-else
            style="min-height: 250px"
            class="d-flex justify-center align-center">
            <p class="grey--text">
                Faça sua pesquisa por um {{ title }} no campo acima
                <v-icon>mdi-magnify</v-icon>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'toolbarPesquisaClienteFornecedor',
    props: {
        type: {
            default: 'cliente'
        }
    },
    created() {
        this.$adm.$on('updateListClient', this.searchClient);
    },
    data() {
        return {
            title: this.type,
            search: '',
            searchLoading: false,
            searchResult: null,
            linkSearch: {
                cliente: `${this.$adm.api}/pessoa/clientelike`,
                fornecedor: `${this.$adm.api}/pessoa/fornecedorlike`
            },
            dialogNewClient: false,
            newClient: {
                name: '',
                cpf: ''
            },
            newClientWithCNPJ: {
                cep: "",
                complemento: "",
                cpf: "",
                ddd: "",
                logradouro: "",
                nome: "",
                nome_bairro: "",
                nome_cidade: "",
                nome_razao: "",
                nome_uf: "",
                num: "",
                numero: "",
                tipo_pessoa: this.type
            },
            loadingNewClient: false,
            tabsAddNewClient: 0,
            newClientCpfOrCnpj: 'cpf',
            newClientNotCPFSwitch: false,
            formNewClientCNPJ1: '',
            formNewClientCNPJ2: '',
            formNewClientCNPJContato: ''
        }
    },
    methods: {
        searchClient() {
            if (this.search.trim().length >= 3) {
                this.searchLoading = true;
                var obj_pessoa = {};
                obj_pessoa.nomeCpf = this.search.trim();
                let jsonDta = JSON.stringify(obj_pessoa)
                this.$axios.post(this.linkSearch[this.type], jsonDta)
                .then((response) => {
                    if (!response.data.length) {
                        this.searchResult = null;

                        this.$adm.$emit('openSnackBar', {
                            message: `Nenhum ${this.title} foi encontrado`,
                            color: 'error'
                        });
                    } else {
                        this.searchResult = response.data;
                    }
                })
                .catch((error) => {
                    this.$adm.tokenRefreshRequired(error.response.data);

                    this.searchResult = null;

                    this.$adm.$emit('openSnackBar', {
                        message: error.response.data.message,
                        color: 'error'
                    });
                })
                .finally(() => this.searchLoading = false);
            }
        },
        openClienteEFornecedor(nome) {
            this.$adm.$emit('openNewWindow', {
                title: nome,
                type: this.type,
                nomeCpf: nome,
                start: true
            });
        },
        addNewClient() {
            const client = this.newClient;

            if (this.tabsAddNewClient == 1) {

                this.loadingNewClient = true;

                this.$axios.post(`${this.$adm.api}/pessoa/create/cnpj`, this.newClientWithCNPJ)
                    .then((response) => {
                        let c = response.data;

                        this.openClienteEFornecedor(c.nomeCpf);

                        this.dialogNewClient = false;
                    })
                    .catch((error) => {
                        this.dialogNewClient = false;
                        
                        this.$adm.$emit('openSnackBar', {
                            message: error.response.data.message,
                            color: 'error'
                        });
                    })
                    .finally(() => this.loadingNewClient = false);

            } else {

                if (!client.nome){
                    this.$adm.$emit('openSnackBar', {
                        message: "Informe o Nome",
                        color: 'error'
                    });
                    return;
                }
                if (!client.cpf){
                    this.$adm.$emit('openSnackBar', {
                        message: "Informe o CPF ou CNPJ",
                        color: 'error'
                    });
                    return;
                }


                this.loadingNewClient = true;

                let d = ( this.newClientNotCPFSwitch
                    ? 'semcpf'
                    : this.type
                );
                let cli;
                let forn;
                if (d === 'cliente'){
                    cli = true;
                    forn = false;
                }else{
                    cli = false;
                    forn = true;
                }
                this.$axios.post(`${this.$adm.api}/pessoa`, {
                        nome: client.nome.trim(),
                        cpf: client.cpf.trim(),
                        cliente: cli,
                        fornecedor: forn
                    })
                    .then((response) => {
                        let c = response.data;

                        this.openClienteEFornecedor(c.id);

                        this.dialogNewClient = false;
                    })
                    .catch((error) => {
                        this.dialogNewClient = false;

                        this.$adm.$emit('openSnackBar', {
                            message: error.response.data.message,
                            color: 'error'
                        });
                    })
                    .finally(() => this.loadingNewClient = false);

            }
        },
        searchReceitaFed() {
            let cnpj = this.newClient.cpf;
            cnpj = cnpj.replace(/\D/g, '');

            if (cnpj.length == 14) {
                this.loadingNewClient = true;

                this.jsonp(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`)
                    .then((data) => {
                        if (data.status == 'ERROR') {
                            this.$adm.$emit('openSnackBar', {
                                message: data.message,
                                color: 'error'
                            });
                        } else {
                            this.setDadosCNPJ(data);
                            this.setFormNewClientCNPJ(data);

                            this.tabsAddNewClient = 1;
                        }
                    })
                    .catch((error) => {
                        this.$adm.$emit('openSnackBar', {
                            message: 'Houve um erro ao obter os dados da receita federal',
                            color: 'error'
                        });
                    })
                    .finally(() => this.loadingNewClient = false);

            } else {
                this.$adm.$emit('openSnackBar', {
                    message: 'Busca apenas para CNPJ',
                    color: 'error'
                });
            }
        },
        setDadosCNPJ(data) {
            this.newClientWithCNPJ.cpf = data.cnpj;
            let cnpj_nome_razao = data.nome;
            this.newClientWithCNPJ.nome_razao = cnpj_nome_razao.substring(0, 60);
            //endereco
            this.newClientWithCNPJ.nome_uf = data.uf;
            this.newClientWithCNPJ.nome_cidade = data.municipio;
            this.newClientWithCNPJ.nome_bairro = data.bairro;
            this.newClientWithCNPJ.logradouro = data.logradouro;
            this.newClientWithCNPJ.num = data.numero;
            this.newClientWithCNPJ.complemento = data.complemento;
            var valor = data.cep;
            var cep = valor.replace(/\D/g, '');
            this.newClientWithCNPJ.cep = cep;
            //telefone
            if (data.telefone.length > 0) {
                let fone = data.telefone;
                let ddd = fone.substring(1, 3);
                this.newClientWithCNPJ.ddd = ddd;
                let numero = fone.substring(5, 15);
                this.newClientWithCNPJ.numero = numero.replace(/\D/g, '');
            }
        },
        setFormNewClientCNPJ(obj) {
            this.formNewClientCNPJContato = obj.telefone;

            if (obj.cep) {
                this.formNewClientCNPJ1 = (obj.logradouro + ", " + obj.numero + " " + obj.complemento);
                this.formNewClientCNPJ2 = (obj.municipio + " - " + obj.bairro + " - " + obj.uf + " - CEP " + obj.cep);
            }
        },
        jsonp(url) {
            return new Promise(function (resolve, reject) {
                let script = document.createElement('script')
                const name = "_jsonp_" + Math.round(100000 * Math.random());
                //url formatting
                if (url.match(/\?/)) url += "&callback=" + name
                else url += "?callback=" + name
                script.src = url;

                window[name] = function (data) {
                    resolve(data);
                    document.body.removeChild(script);
                    delete window[name];
                }
                document.body.appendChild(script);
            });
        }
    },
    watch: {
        newClientCpfOrCnpj() {
            setTimeout(() => this.newClient.cpf = '', 100);
        },
        newClientNotCPFSwitch() {
            this.newClient.cpf = '';
        },
        dialogNewClient(e) {
            if (!e) {
                this.newClient.nome = '';
                this.newClient.cpf = '';
                this.newClientCpfOrCnpj = 'cpf';
                this.newClientNotCPFSwitch = false;

                this.tabsAddNewClient = 0;
                this.newClientWithCNPJ = {
                    cep: "",
                    complemento: "",
                    cpf: "",
                    ddd: "",
                    logradouro: "",
                    nome: "",
                    nome_bairro: "",
                    nome_cidade: "",
                    nome_razao: "",
                    nome_uf: "",
                    num: "",
                    numero: "",
                    tipo_pessoa: this.type
                };
                this.formNewClientCNPJ1 = '';
                this.formNewClientCNPJ2 = '';
                this.formNewClientCNPJContato = '';
            }
        },
        search(e) {
            if (e.trim() == '') {
                this.searchResult = null;
            }
        }
    }
}
</script>