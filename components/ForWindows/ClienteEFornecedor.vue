<template>
    <div>
        <v-tabs
            v-model="tabs"
            fixed-tabs
            show-arrows
            :background-color="$vuetify.theme.dark? '#272727': '#ffffff'"
            class="elevation-5 mb-2">
            <v-tab>Dados</v-tab>

            <v-tab>Endereços</v-tab>

            <v-tab>Contatos</v-tab>

            <v-tab>Pedidos</v-tab>

            <v-tab>Financeiro</v-tab>
        </v-tabs>

        <v-card-text
            class="mx-auto"
            v-if="client != null">
            <v-tabs-items v-model="tabs" touchless>
                <!-- Dados e ediçao de cliente -->
                <v-tab-item>
                    <v-tabs-items v-model="editClient" touchless>
                        <v-tab-item>
                            <div class="d-flex justify-space-between align-center mx-auto mb-2"
                                style="max-width: 800px">
                                <div>
                                    <p class="mb-0">
                                        Cadastrado em {{ client.dt_cadastro }}
                                        <span v-if="client.usuario">por {{ client.usuario }}</span>
                                    </p>
                                </div>

                                <div>
                                    <v-btn
                                        text
                                        small
                                        @click="editClient = 1">
                                        <v-icon>mdi-account-edit</v-icon>
                                        <span class="d-none d-sm-block">&nbsp; Editar</span>
                                    </v-btn>
                                </div>
                            </div>

                            <v-divider dark
                                class="mx-auto"
                                style="max-width: 800px"></v-divider>

                            <v-simple-table class="mx-auto"
                                style="max-width: 800px">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th>Campos</th>

                                            <th>Dados</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>Nome:</td>

                                            <td>{{ client.nome }}</td>
                                        </tr>

                                        <tr>
                                            <td>CPF:</td>

                                            <td>{{ client.cpf }}</td>
                                        </tr>

                                        <tr>
                                            <td>Email:</td>

                                            <td>{{ client.email }}</td>
                                        </tr>

                                        <tr v-if="!clientIsCNPJ">
                                            <td>RG:</td>

                                            <td>{{ client.identitidade }}</td>
                                        </tr>

                                        <tr v-if="!clientIsCNPJ">
                                            <td>Orgão emissor:</td>

                                            <td>{{ client.ident_emissor }}</td>
                                        </tr>

                                        <tr v-if="clientIsCNPJ">
                                            <td>Razão social:</td>

                                            <td>{{ client.nome_razao }}</td>
                                        </tr>

                                        <tr v-if="clientIsCNPJ">
                                            <td>Insc. Estadual:</td>

                                            <td>{{ client.is_est }}</td>
                                        </tr>

                                        <tr v-if="clientIsCNPJ">
                                            <td>Insc. Municipal:</td>

                                            <td>{{ client.is_mun }}</td>
                                        </tr>

                                        <tr v-if="cliFor">
                                            <td>Limite de crédito:</td>

                                            <td>R$ {{ client.credito }}</td>
                                        </tr>

                                        <tr v-if="cliFor">
                                            <td>Crédito disponivel:</td>

                                            <td>R$ {{ client.credito_pg }}</td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-tab-item>

                        <v-tab-item class="pt-5">
                            <v-row class="mx-auto"
                                style="max-width: 800px">
                                <v-col cols="12">
                                    <div class="d-flex justify-space-between align-center mb-2">
                                        <div>
                                            <p class="mb-0">
                                                Editar informações
                                            </p>
                                        </div>

                                        <div>
                                            <v-btn
                                                text
                                                small
                                                @click="cancelEditClient">
                                                <v-icon>mdi-close-circle</v-icon>
                                                <span class="d-none d-sm-block">&nbsp; Cancelar</span>
                                            </v-btn>

                                            <v-btn
                                                text
                                                small
                                                @click="sendEditClient">
                                                <v-icon>mdi-account-check</v-icon>
                                                <span class="d-none d-sm-block">&nbsp; Salvar</span>
                                            </v-btn>
                                        </div>
                                    </div>

                                    <v-divider dark></v-divider>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field
                                        v-model="dataEditClient.cpf"
                                        label="CPF"
                                        placeholder="CPF do cliente"
                                        outlined />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field
                                        v-model="dataEditClient.nome"
                                        label="Nome"
                                        placeholder="Nome do cliente"
                                        outlined />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field
                                        v-model="dataEditClient.email"
                                        label="Email (NFe)"
                                        placeholder="Email do cliente"
                                        outlined />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-if="clientIsCNPJ"
                                        v-model="dataEditClient.nome_razao"
                                        label="Razão social"
                                        placeholder="Razão social"
                                        outlined />

                                    <v-row v-else>
                                        <v-col>
                                            <v-text-field
                                                v-model="dataEditClient.identitidade"
                                                label="RG"
                                                placeholder="RG do cliente"
                                                outlined />
                                        </v-col>

                                        <v-col>
                                            <v-text-field
                                                v-model="dataEditClient.ident_emissor"
                                                label="Emissor"
                                                placeholder="Emissor"
                                                outlined />
                                        </v-col>
                                    </v-row>
                                </v-col>

                                <v-col cols="12" md="6" v-if="clientIsCNPJ">
                                    <v-text-field
                                        v-model="dataEditClient.is_est"
                                        label="Insc. Estadual"
                                        placeholder="Insc. Estadual"
                                        outlined />
                                </v-col>

                                <v-col cols="12" md="6" v-if="clientIsCNPJ">
                                    <v-text-field
                                        v-model="dataEditClient.is_mun"
                                        label="Insc. Municipal"
                                        placeholder="Crédito disponivel"
                                        outlined />
                                </v-col>

                                <v-col cols="12" md="6" v-if="cliFor">
                                    <v-text-field
                                        v-model="dataEditClient.credito"
                                        label="Limite de crédito"
                                        placeholder="Limite de crédito"
                                        outlined
                                        prepend-inner-icon="mdi-currency-brl" />
                                </v-col>

                                <v-col cols="12" md="6" v-if="cliFor">
                                    <v-text-field
                                        v-model="dataEditClient.credito_pg"
                                        disabled
                                        class="not-allowed"
                                        readonly
                                        label="Crédito disponivel"
                                        placeholder="Crédito disponivel"
                                        outlined
                                        prepend-inner-icon="mdi-currency-brl" />
                                </v-col>
                            </v-row>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tab-item>

                <!-- Gerenciar endereços -->
                <v-tab-item>
                    <v-tabs-items v-model="tabAdresses" touchless>
                        <!-- Adicionar endereço -->
                        <v-tab-item>
                            <add-and-edit-address-client v-model="tabAdresses"
                                type="add"
                                :id-pessoa="client.id" />
                        </v-tab-item>

                        <!-- Lista de endereços -->
                        <v-tab-item>
                            <div>
                                <v-btn
                                    text
                                    small
                                    @click="tabAdresses = 0">
                                    <v-icon>mdi-home-plus</v-icon>
                                    <span class="d-none d-md-block">&ensp;Novo endereço</span>
                                </v-btn>
                            </div>

                            <v-divider class="my-2" />

                            <v-simple-table>
                                <thead>
                                    <tr>
                                        <th>CEP</th>

                                        <th>Logradouro</th>

                                        <th>Nº</th>

                                        <th>Complemento</th>

                                        <th>Bairro</th>

                                        <th>Cidade</th>

                                        <th>UF</th>

                                        <th>Tipo</th>

                                        <th>Pr.</th>
                                    </tr>
                                </thead>

                                <tbody style="pointer-events: auto">
                                    <tr v-for="(a, i) in adresses"
                                        :key="i"
                                        @click="openEditAddress(a)"
                                        style="cursor: pointer">
                                        <td>{{ a.cep }}</td>

                                        <td>{{ a.logradouro}}</td>

                                        <td>{{ a.num }}</td>

                                        <td>{{ a.complemento }}</td>

                                        <td>{{ a.bairro.nome_bairro }}</td>

                                        <td>{{ a.bairro.municipio.nome_mun }}</td>

                                        <td>{{ a.bairro.municipio.uf.sigla_uf }}</td>

                                        <td>{{ a.tipoEnd.descricao }}</td>

                                        <td>
                                            <v-icon v-if="a.correspondencia">mdi-check-outline</v-icon>

                                            <v-icon v-else>mdi-close-outline</v-icon>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-simple-table>

                            <div v-if="adresses.length == 0"
                                style="min-height: 250px"
                                class="d-flex justify-center align-center">
                                <p>
                                    Nenhum endereço adicionado <v-icon small>mdi-map-marker</v-icon>
                                </p>
                            </div>
                        </v-tab-item>

                        <!-- Editar endereço -->
                        <v-tab-item>
                            <add-and-edit-address-client v-model="tabAdresses"
                                type="edit"
                                :address="dataEditAdresses" />
                        </v-tab-item>
                    </v-tabs-items>
                </v-tab-item>

                <!-- Gerenciar contatos -->
                <v-tab-item>
                    <v-tabs-items v-model="tabContacts" touchless>
                        <v-tab-item>
                            <add-and-edit-contact-client v-model="tabContacts"
                                type="add"
                                :id-pessoa="client.id" />
                        </v-tab-item>

                        <v-tab-item>
                            <div class="mb-2">
                                <v-btn
                                    text
                                    small
                                    @click="tabContacts = 0">
                                    <v-icon>mdi-phone-plus</v-icon>
                                    <span class="d-none d-md-block">&ensp;Novo contato</span>
                                </v-btn>
                            </div>

                            <v-divider />

                            <v-simple-table>
                                <thead>
                                    <tr>
                                        <th>DDD</th>

                                        <th>Número</th>

                                        <th>Contato</th>

                                        <th>Tipo</th>

                                        <th>Email</th>

                                        <th>Pr.</th>
                                    </tr>
                                </thead>

                                <tbody style="pointer-events: auto">
                                    <tr v-for="(c, i) in contacts"
                                        :key="i"
                                        @click="openEditContact(c)"
                                        style="cursor: pointer">
                                        <td>{{ c.ddd }}</td>

                                        <td>{{ c.numero }}</td>

                                        <td>{{ c.contato }}</td>

                                        <td>{{ c.tipoFone.descricao }}</td>

                                        <td>{{ c.email }}</td>

                                        <td>
                                            <v-icon v-if="c.principal">mdi-check-outline</v-icon>

                                            <v-icon v-else>mdi-close-outline</v-icon>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-simple-table>

                            <div v-if="contacts.length == 0"
                                style="min-height: 250px"
                                class="d-flex justify-center align-center">
                                <p>
                                    Nenhum contato adicionado <v-icon small>mdi-phone</v-icon>
                                </p>
                            </div>
                        </v-tab-item>

                        <v-tab-item>
                            <add-and-edit-contact-client v-model="tabContacts"
                                type="edit" :contact="dataEditContact" />
                        </v-tab-item>
                    </v-tabs-items>
                </v-tab-item>

                <!-- Dados de pedidos -->
                <v-tab-item>
                    <v-tabs-items v-model="tabOrders" touchless>
                        <v-tab-item>
                            <v-simple-table style="max-width: 800px;"
                                class="mx-auto">
                                <thead>
                                    <tr>
                                        <th>Documento</th>

                                        <th>NFe</th>

                                        <th>Data</th>

                                        <th>Valor</th>
                                    </tr>
                                </thead>

                                <tbody style="pointer-events: auto">
                                    <tr v-for="(o, i) in orders"
                                        :key="i"
                                        @click="openOrder(o)"
                                        style="cursor: pointer">
                                        <td>{{ o.cod_mov }}</td>

                                        <td>{{ o.notafiscal }}</td>

                                        <td>{{ o.dt_cadastro }}</td>

                                        <td class="text-right">{{ $adm.localeString(o.tot_mov) }}</td>
                                    </tr>
                                </tbody>
                            </v-simple-table>

                            <div v-if="orders.length == 0"
                                style="min-height: 250px"
                                class="d-flex justify-center align-center">
                                <p>
                                    Nenhum pedido adicionado <v-icon small>mdi-archive</v-icon>
                                </p>
                            </div>
                        </v-tab-item>

                        <v-tab-item>
                            <div class="mb-2">
                                <v-btn
                                    text
                                    small
                                    @click="tabOrders = 0">
                                    <v-icon>mdi-arrow-left-circle</v-icon>
                                    <span class="d-none d-sm-block">&nbsp; Voltar</span>
                                </v-btn>
                            </div>

                            <v-divider />

                            <v-simple-table>
                                <thead>
                                    <tr>
                                        <th>Produto</th>

                                        <th>Qtd.</th>

                                        <th>Und.</th>

                                        <th>Valor</th>

                                        <th>Desc.</th>

                                        <th>Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="(o, i) in itemsOrder"
                                        :key="i">
                                        <td>{{ o.descricao_prod }}</td>

                                        <td>{{ $adm.localeString(o.qtd_sai) }}</td>

                                        <td>{{ o.und_unidade }}</td>

                                        <td class="text-right">{{ $adm.localeString(o.val_unit) }}</td>

                                        <td class="text-right">{{ $adm.localeString(o.tot_desc) }}</td>

                                        <td class="text-right">{{ $adm.localeString(o.sub_tot) }}</td>
                                    </tr>
                                </tbody>
                            </v-simple-table>

                            <div v-if="itemsOrder.length == 0"
                                style="min-height: 250px"
                                class="d-flex justify-center align-center">
                                <p>
                                    Nenhum pedido adicionado <v-icon small>mdi-archive</v-icon>
                                </p>
                            </div>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tab-item>

                <!-- Dados financeiro -->
                <v-tab-item>
                    <v-simple-table style="max-width: 800px"
                        class="mx-auto">
                        <thead>
                            <tr>
                                <th>Documento</th>

                                <th>NFe</th>

                                <th>Data</th>

                                <th>Pago</th>

                                <th>A pagar</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(f, i) in financial"
                                :key="i">
                                <td>{{ f.doc }}</td>

                                <td>{{ f.notafiscal }}</td>

                                <td>{{ f.dt_lanc }}</td>

                                <td class="text-right">{{ $adm.localeString(f.tot_pago) }}</td>

                                <td class="text-right">{{ $adm.localeString(f.tot_pagar) }}</td>
                            </tr>
                        </tbody>
                    </v-simple-table>

                    <div v-if="financial.length == 0"
                        style="min-height: 250px"
                        class="d-flex justify-center align-center">
                        <p>
                            Nenhum financeiro adicionado <v-icon small>mdi-archive</v-icon>
                        </p>
                    </div>
                </v-tab-item>
            </v-tabs-items>
        </v-card-text>

        <app-window-item-error v-if="error" />

        <v-overlay :value="loading">
            <v-progress-circular indeterminate></v-progress-circular>
        </v-overlay>
    </div>
</template>

<script>
import AppWindowItemError from '~/components/AppWindowItemError.vue';
import AddAndEditAddressClient from '~/components/Cadastro/AddAndEditAddressClient.vue';
import AddAndEditContactClient from '~/components/Cadastro/AddAndEditContactClient.vue';

export default {
    components: {
        AddAndEditAddressClient,
        AddAndEditContactClient,
        AppWindowItemError
    },
    props: ['nomeCpf', 'type'],
    created() {
        if (this.type === 'cliente'){
            this.cliFor = true;
        }
        this.$adm.$on('updateListAddress', (idPessoa) => {
            if (this.client.id == idPessoa) {
                this.isGetAddress = false;
                this.getAddress();
            }
        });

        this.$adm.$on('updateListContact', (idPessoa) => {
            if (this.client.id == idPessoa) {
                this.isGetContacts = false;
                this.getContacts();
            }
        });
    },
    mounted() {
        this.sendNomeCpf();
    },
    data() {
        return {
            cliFor: false,
            loading: false,
            tabs: null,
            client: null,
            editClient: 0,
            dataEditClient: null,
            error: false,
            // adresses
            adresses: [],
            dataEditAdresses: {},
            isGetAddress: false,
            tabAdresses: 1,
            // contacts
            contacts: [],
            isGetContacts: false,
            dataEditContact: {},
            tabContacts: 1,
            // orders
            orders: [],
            itemsOrder: [],
            isGetOrders: false,
            tabOrders: 0,
            // financial
            financial: [],
            isGetFinancial: false
        }
    },
    computed: {
        clientIsCNPJ() {
            let isCNPJ = new RegExp('^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}$');

            return isCNPJ.test(this.client.cpf);
        }
    },
    methods: {
        sendNomeCpf(idPessoa) {
            this.loading = true;

            /*
            let link = idPessoa
                ? `${ this.$adm.api }/pessoa/id`
                : `${ this.$adm.api }/pessoa/nomeCpf`;
            */
            let link = `${ this.$adm.api }/pessoa/`

            let data = idPessoa
                ? idPessoa
                : this.nomeCpf;

            this.$axios.get(link + data)
            .then((response) => {
                this.client = response.data;
                this.dataEditClient = Object.assign({}, response.data);

                if (this.editClient) {
                    this.editClient = 0;
                }
            })
            .catch((error) => {
                this.$adm.tokenRefreshRequired(error.response.data);

                this.error = true;

                this.$adm.$emit('openSnackBar', {
                    message: error.response.data.message,
                    color: 'error'
                });
            })
            .finally(() => this.loading = false);
        },
        sendEditClient() {
            this.loading = true;

            this.$axios.put(`${ this.$adm.api }/pessoa`, this.dataEditClient)
                .then((response) => {
                    this.sendNomeCpf(this.client.id);

                    this.$adm.$emit('updateListClient');

                    this.$adm.$emit('openSnackBar', {
                        message: 'Alterações salvas com sucesso',
                        color: 'success'
                    });
                })
                .catch((error) => {
                    this.$adm.tokenRefreshRequired(error.response.data.message);
                    let errorMsg;
                    if (error.response.data.errors) {
                            errorMsg = error.response.data.errors[0].defaultMessage;
                    }else{
                            errorMsg = error.response.data.message
                    }
                    this.$adm.$emit('openSnackBar', {
                        message: errorMsg, //error.response.data.message,
                        color: 'error'
                    });
                })
                .finally(() => this.loading = false);
        },
        cancelEditClient() {
            this.dataEditClient = Object.assign({}, this.client);
            this.editClient = 0;
        },
        // -- adresses --
        getAddress() {
            if (this.client && !this.isGetAddress) {
                this.loading = true;

                this.$axios.get(`${this.$adm.api}/endereco/pessoa/${this.client.id}`)
                    .then((response) => {
                        this.adresses = response.data;

                        this.isGetAddress = true;
                    })
                    .catch((error) => {
                        this.$adm.tokenRefreshRequired(error.response.data);

                        this.$adm.$emit('openSnackBar', {
                            message: error.response.data.message,
                            color: 'error'
                        });
                    })
                    .finally(() => this.loading = false);
            }
        },
        openEditAddress(a) {
            this.dataEditAdresses = Object.assign({}, a);

            this.tabAdresses = 2;
        },
        // -- contacts --
        getContacts() {
            if (this.client && !this.isGetContacts) {
                this.loading = true;

                //this.$axios.get(`${this.$adm.api}/pessoa/contatos/${this.client.id_pessoa}`)
                this.$axios.get(`${this.$adm.api}/contato/pessoa/${this.client.id}`)
                    .then((response) => {
                        this.contacts = response.data;

                        this.isGetContacts = true;
                    })
                    .catch((error) => {
                        this.$adm.tokenRefreshRequired(error.response.data);

                        this.$adm.$emit('openSnackBar', {
                            message: error.response.data.message,
                            color: 'error'
                        });
                    })
                    .finally(() => this.loading = false);

            }
        },
        openEditContact(c) {
            this.dataEditContact = Object.assign({}, c);

            this.tabContacts = 2;
        },
        // -- orders --
        getOrders() {
            if (this.client && !this.isGetOrders) {
                this.loading = true;

                this.$axios.get(`${this.$adm.api}/pessoa/pedidos/${this.client.id_pessoa}`)
                    .then((response) => {
                        this.orders = response.data;

                        this.isGetOrders = true;
                    })
                    .catch((error) => {
                        this.$adm.tokenRefreshRequired(error.response.data);

                        this.$adm.$emit('openSnackBar', {
                            message: error.response.data.message,
                            color: 'error'
                        });
                    })
                    .finally(() => this.loading = false);
            }
        },
        openOrder(e) {
            this.loading = true;

            this.$axios.get(`${this.$adm.api}/estoque/listaitens/${e.id_mov}`)
                .then((response) => {
                    this.itemsOrder = response.data;

                    this.tabOrders = 1;
                })
                .catch((error) => {
                    this.$adm.tokenRefreshRequired(error.response.data);

                    this.$adm.$emit('openSnackBar', {
                        message: error.response.data.message,
                        color: 'error'
                    });
                })
                .finally(()=> this.loading = false);
        },
        // financial
        getFinancial() {
            if (this.client && !this.isGetFinancial) {
                this.loading = true;

                let form = this.type == 'fornecedor';

                this.$axios.get(`${this.$adm.api}/pessoa/financeiro/${this.client.id_pessoa}/${form}`)
                    .then((response) => {
                        this.financial = response.data;

                        this.isGetFinancial = true;
                    })
                    .catch((error) => {
                        this.$adm.tokenRefreshRequired(error.response.data);

                        this.$adm.$emit('openSnackBar', {
                            message: error.response.data.message,
                            color: 'error'
                        });
                    })
                    .finally(() => this.loading = false);
            }
        },
    },
    watch: {
        tabs(e) {
            if (e == 1 && !this.isGetAddress) {

                this.getAddress();

            } else if (e == 2 && !this.isGetContacts) {

                this.getContacts();

            } else if (e == 3 && !this.isGetOrders) {

                this.getOrders();

            } else if (e == 4 && !this.isGetFinancial) {

                this.getFinancial();

            }
        }
    }
}
</script>
