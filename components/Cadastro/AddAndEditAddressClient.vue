<template>
    <v-row class="mx-auto"
        style="max-width: 800px">
        <v-col cols="12">
            <div class="d-flex justify-space-between align-center mb-2">
                <div>
                    <p class="mb-0">{{ title }} endereço</p>
                </div>

                <div>
                    <v-btn
                        text
                        small
                        @click="changeTab">
                        <v-icon>mdi-close-circle</v-icon>
                        <span class="d-none d-md-block">&ensp;Cancelar</span>
                    </v-btn>

                    <v-btn v-if="type == 'edit'"
                        text
                        small
                        @click="deleteAddress">
                        <v-icon>mdi-delete</v-icon>
                        <span class="d-none d-md-block">&ensp;Excluir</span>
                    </v-btn>

                    <v-btn
                        text
                        small
                        @click="actionButton">
                        <v-icon>mdi-content-save</v-icon>
                        <span class="d-none d-md-block">&ensp;Salvar</span>
                    </v-btn>
                </div>
            </div>

            <v-divider />
        </v-col>

        <v-col cols="12">
            <v-switch v-model="dataAdresses.correspondencia"
                label="Endereço principal"
                hide-details
                class="mt-0" />
        </v-col>

        <v-col cols="12" md="6">
            <v-text-field v-model="dataAdresses.cep"
                label="CEP"
                placeholder="Digite o CEP"
                outlined
                append-icon="mdi-magnify"
                @click:append="viaCep()"></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
            <v-select v-model="dataAdresses.id_tipo_end"
                :items="itemsAdresses"
                item-text="text"
                item-value="value"
                label="Tipo do endereço"
                outlined />
        </v-col>

        <v-col cols="12" md="6">
            <v-select v-model="dataAdresses.id_uf"
                :items="ufAdresses"
                item-text="text"
                item-value="value"
                label="UF"
                outlined />
        </v-col>

        <v-col cols="12" md="6">
            <v-combobox v-model="cidadeEsolhida"
                :search-input.sync="cidade"
                :items="itemsCidades"
                item-text="nome_mun"
                label="Cidade"
                placeholder="Digite o nome da cidade (mínimo 3 letras)"
                outlined
                :disabled="!dataAdresses.id_uf"
                :class="{ 'not-allowed': !dataAdresses.id_uf }"
                :loading="loadingItemsCidades"
                @update:search-input="getCidade"></v-combobox>
        </v-col>

        <v-col cols="12" md="6">
            <!-- <v-text-field v-model="dataAdresses.nome_bairro"
                label="Bairro"
                placeholder="Digite o nome do bairro (mínimo 3 letras)"
                outlined /> -->
            <v-combobox v-model="bairroEsolhido"
                :search-input.sync="bairro"
                :items="itemsBairros"
                item-text="nome_bairro"
                label="Bairro"
                placeholder="Digite o nome do bairro (mínimo 3 letras)"
                outlined
                :disabled="!dataAdresses.nome_cidade"
                :class="{ 'not-allowed': !dataAdresses.nome_cidade }"
                :loading="loadingItemsBairros"
                @update:search-input="getBairro"></v-combobox>
        </v-col>

        <v-col cols="12" md="6">
            <v-text-field v-model="dataAdresses.logradouro"
                label="Logradouro"
                placeholder="Logradouro"
                outlined />
        </v-col>

        <v-col cols="12" md="6">
            <v-text-field v-model="dataAdresses.num"
                label="Número"
                placeholder="Número"
                outlined />
        </v-col>

        <v-col cols="12" md="6">
            <v-text-field v-model="dataAdresses.complemento"
                label="Complemento"
                placeholder="Complemento"
                outlined />
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'addAndEditAddressClient',
    props: ['type', 'address', 'idPessoa', 'value'],
    mounted() {
        if (this.address) {
            let addressEdit = Object.assign({}, this.address);
            this.dataAdresses.cep = addressEdit.cep;
            this.dataAdresses.cod_mun = addressEdit.bairro.municipio.cod_mun;
            this.dataAdresses.complemento = addressEdit.complemento;
            this.dataAdresses.correspondencia = addressEdit.correspondencia;
            this.dataAdresses.id_end = addressEdit.id_end;
            this.dataAdresses.id_tipo_end = addressEdit.tipoEnd.id_tipo_end;
            this.dataAdresses.id_uf = addressEdit.bairro.municipio.uf.id_uf;
            this.dataAdresses.logradouro = addressEdit.logradouro;
            this.dataAdresses.nome_bairro = addressEdit.bairro.nome_bairro;
            this.dataAdresses.nome_cidade = addressEdit.bairro.municipio.nome_mun;
            this.dataAdresses.num = addressEdit.num;
            this.dataAdresses.versao = addressEdit.versao;
            this.dataAdresses.id_municipio = addressEdit.bairro.municipio.id_municipio;
            this.dataAdresses.id_bairro = addressEdit.bairro.id_bairro;
            this.dataAdresses.id_pessoa = addressEdit.pessoa.id;

            //this.cidadeEsolhida = this.address.nome_mun;
            this.cidadeEsolhida = addressEdit.bairro.municipio.nome_mun;
            this.bairroEsolhido = addressEdit.bairro.nome_bairro;

            this.itemsAdresses.forEach((el) => {
                if (el.text == this.address.tipoEnd.descricao) {
                    this.dataAdresses.id_tipo_end = el.value;
                }
            });

            this.ufAdresses.forEach((el) => {
                if (el.text == this.address.bairro.municipio.uf.sigla_uf) {
                    this.dataAdresses.id_uf = el.value;
                }
            });

        }
    },
    data() {
        return {
            loading: false,
            title: (this.type == 'add'
                ? 'Adicionar'
                : 'Editar'),
            dataAdresses: {
                cep: "",
                cod_mun: "",
                complemento: "",
                correspondencia: 0,
                id_end: 0,
                id_tipo_end: 0,
                id_uf: "",
                logradouro: "",
                nome_bairro: "",
                nome_cidade: "",
                num: "",
                versao: 0,
                id_municipio: 0,
                id_bairro: 0,
                id_pessoa: 0
            },
            itemsAdresses: [
                {
                    text:'RESIDENCIAL',
                    value: 1
                },
                {
                    text: 'COMERCIAL',
                    value: 2
                },
                {
                    text: 'COBRANÇA',
                    value: 3
                },
                {
                    text: 'ENTREGA',
                    value: 4
                }
            ],
            ufAdresses: [
                {
                    text: 'AC',
                    value: 1
                },
                {
                    text: 'AL',
                    value: 2
                },
                {
                    text: 'AM',
                    value: 3
                },
                {
                    text: 'AP',
                    value: 4
                },
                {
                    text: 'BA',
                    value: 5
                },
                {
                    text: 'DF',
                    value: 6
                },
                {
                    text: 'CE',
                    value: 7
                },
                {
                    text: 'ES',
                    value: 8
                },
                {
                    text: 'GO',
                    value: 9
                },
                {
                    text: 'MA',
                    value: 10
                },
                {
                    text: 'MT',
                    value: 11
                },
                {
                    text: 'MS',
                    value: 12
                },
                {
                    text: 'MG',
                    value: 13
                },
                {
                    text: 'PA',
                    value: 14
                },
                {
                    text: 'PB',
                    value: 15
                },
                {
                    text: 'PE',
                    value: 16
                },
                {
                    text: 'PR',
                    value: 17
                },
                {
                    text: 'PI',
                    value: 18
                },
                {
                    text: 'RG',
                    value: 19
                },
                {
                    text: 'RN',
                    value: 20
                },
                {
                    text: 'RS',
                    value: 21
                },
                {
                    text: 'RR',
                    value: 22
                },
                {
                    text: 'RO',
                    value: 23
                },
                {
                    text: 'SC',
                    value: 24
                },
                {
                    text: 'SP',
                    value: 25
                },
                {
                    text: 'SE',
                    value: 26
                },
                {
                    text: 'TO',
                    value: 27
                },
            ],
            // cidades
            cidade: '',
            cidadeEsolhida: null,
            itemsCidades: [],
            loadingItemsCidades: false,
            controllUf: null,
            // bairros
            bairro: '',
            bairroEsolhido: null,
            itemsBairros: [],
            loadingItemsBairros: false
        }
    },
    methods: {
        changeTab() {
            this.dataAdresses = {
                cep: "",
                cod_mun: "",
                complemento: "",
                correspondencia: 0,
                id_end: 0,
                id_tipo_end: 0,
                id_uf: "",
                logradouro: "",
                nome_bairro: "",
                nome_cidade: "",
                num: "",
                versao: 0,
                id_municipio: 0,
                id_bairro: 0,
                id_pessoa: 0
            };
            this.cidadeEsolhida = null;

            this.$emit('input', 1);
        },
        actionButton() {
            this.loading = true;

            let data = {};
            data.versao = this.dataAdresses.versao;
            data.pessoa = {"id": this.dataAdresses.id_pessoa};
            data.tipoEnd = {"id_tipo_end": this.dataAdresses.id_tipo_end};
            data.cep = this.dataAdresses.cep;
            data.logradouro =  this.dataAdresses.logradouro;
            data.num =  this.dataAdresses.num;
            data.complemento = this.dataAdresses.complemento;
            data.municipio = {"id_municipio": this.dataAdresses.id_municipio};
            data.uf = {"id_uf": this.dataAdresses.id_uf};
            data.bairro = {"id_bairro": this.dataAdresses.id_bairro};
            data.correspondencia = this.dataAdresses.correspondencia;

            if (!data.cep){
                this.$adm.$emit('openSnackBar', {
                    message: "Informe o CEP",
                    color: 'error'
                });
                return;
            }
            if (data.tipoEnd.id_tipo_end == 0){
                this.$adm.$emit('openSnackBar', {
                    message: "Informe o Tipo de Endereço",
                    color: 'error'
                });
                return;
            }
            if (data.uf.id_uf == ""){
                this.$adm.$emit('openSnackBar', {
                    message: "Informe a UF",
                    color: 'error'
                });
                return;
            }
            if (data.municipio.id_municipio == 0){
                this.$adm.$emit('openSnackBar', {
                    message: "Informe a cidade",
                    color: 'error'
                });
                return;
            }
            if (data.bairro.id_bairro == 0){
                this.$adm.$emit('openSnackBar', {
                    message: "Informe o bairro",
                    color: 'error'
                });
                return;
            }
            if (!data.logradouro){
                this.$adm.$emit('openSnackBar', {
                    message: "Informe o logradouro",
                    color: 'error'
                });
                return;
            }
            if (!data.num){
                this.$adm.$emit('openSnackBar', {
                    message: "Informe o número",
                    color: 'error'
                });
                return;
            }


            if (this.type == 'add') {

                data.pessoa = {"id": this.idPessoa};

                this.$axios.post(`${this.$adm.api}/endereco/`, data)
                    .then((response) => {
                        this.$adm.$emit('updateListAddress', this.idPessoa);

                        this.$adm.$emit('openSnackBar', {
                            message: 'Novo endereço adicionado com sucesso',
                            color: 'success'
                        });

                        this.changeTab();
                    })
                    .catch((error) => {
                        this.$adm.tokenRefreshRequired(error.response.data);

                        this.$adm.$emit('openSnackBar', {
                            message: error.response.data,
                            color: 'error'
                        });
                    })
                    .finally(() => this.loading = false);

            } else if (this.type == 'edit') {
                data.id_end = this.dataAdresses.id_end;
                this.$axios.put(`${this.$adm.api}/endereco/`, data)
                    .then((response) => {
                        this.$adm.$emit('updateListAddress', this.dataAdresses.id_pessoa);

                        this.$adm.$emit('openSnackBar', {
                            message: 'Endereço alterado com sucesso',
                            color: 'success'
                        });

                        this.changeTab();
                    })
                    .catch((error) => {
                        this.$adm.tokenRefreshRequired(error.response.data);

                        this.$adm.$emit('openSnackBar', {
                            message: error.response.data,
                            color: 'error'
                        });
                    })
                    .finally(() => this.loading = false);

            }

        },
        deleteAddress() {
            if (this.type == 'edit') {

                let c = confirm('Tem certeza de que quer deletar este endereço?');

                if (c) {
                    const end = {
                        id_end: this.dataAdresses.id_end.toString(),
                        id_pessoa: this.dataAdresses.id_pessoa.toString(),
                        versao: this.dataAdresses.versao
                    };

                    this.$axios.delete(`${this.$adm.api}/endereco/${this.dataAdresses.id_end}`)
                        .then((response) => {
                            this.$adm.$emit('updateListAddress', this.dataAdresses.id_pessoa);

                            this.$adm.$emit('openSnackBar', {
                                message: 'Endereço deletado com sucesso',
                                color: 'success'
                            });

                            this.changeTab();
                        })
                        .catch((error) => {
                            this.$adm.tokenRefreshRequired(error.response.data);

                            this.$adm.$emit('openSnackBar', {
                                message: error.response.data,
                                color: 'error'
                            });
                        })
                        .finally(() => this.loading = false);
                }

            }
        },
        viaCep() {
             alert("Em construção")
        },
        getCidade() {
            if (this.cidade && this.cidade.length >= 3) {
                this.loadingItemsCidades = true;

                this.$axios.get(`${this.$adm.api}/municipio/uf/${this.dataAdresses.id_uf}`)
                    .then((response) => {
                        this.itemsCidades = response.data;

                        if (response.data.length == 1) {
                            this.dataAdresses.nome_cidade = response.data[0].nome_mun;
                            this.dataAdresses.cod_mun = response.data[0].cod_mun;
                            this.dataAdresses.id_municipio = response.data[0].id_municipio;
                        }
                    })
                    .catch((error) => {
                        this.$adm.tokenRefreshRequired(error.response.data);

                        this.$adm.$emit('openSnackBar', {
                            message: error.response.data,
                            color: 'error'
                        });
                    })
                    .finally(() => this.loadingItemsCidades = false);
            }
        },
        getBairro() {
            if (this.bairro && this.bairro.length >= 3) {
                this.loadingItemsBairros = true;

                this.$axios.get(`${this.$adm.api}/bairro/municipio/${this.dataAdresses.id_municipio}`)
                    .then((response) => {
                        this.itemsBairros = response.data;

                        if (response.data.length == 1) {
                            this.dataAdresses.id_bairro = response.data[0].id_bairro;
                            this.dataAdresses.nome_bairro = response.data[0].nome_bairro;
                        }
                    })
                    .catch((error) => {
                        this.$adm.tokenRefreshRequired(error.response.data);

                        this.$adm.$emit('openSnackBar', {
                            message: error.response.data,
                            color: 'error'
                        });
                    })
                    .finally(() => this.loadingItemsBairros = false);
            }
        },
    },
    watch: {

        cidadeEsolhida(e) {
            if (typeof e == 'string') {
                this.dataAdresses.nome_cidade = e;
            } else if (e) {
                this.dataAdresses.nome_cidade = e.nome_mun;
                this.dataAdresses.cod_mun = e.cod_mun;
                this.dataAdresses.id_municipio = e.id_municipio;
            }
        },
        bairroEsolhido(e) {
            if (typeof e == 'string') {
                this.dataAdresses.nome_bairro = e;
            } else if (e) {
                this.dataAdresses.id_bairro = e.id_bairro;
                this.dataAdresses.nome_bairro = e.nome_bairro;
            }
        },
        address(e) {
          this.dataAdresses.cep = e.cep;
          this.dataAdresses.cod_mun = e.bairro.municipio.cod_mun;
          this.dataAdresses.complemento = e.complemento;
          this.dataAdresses.correspondencia = e.correspondencia;
          this.dataAdresses.id_end = e.id_end;
          this.dataAdresses.id_tipo_end = e.tipoEnd.id_tipo_end;
          this.dataAdresses.id_uf = e.bairro.municipio.uf.id_uf;
          this.dataAdresses.logradouro = e.logradouro;
          this.dataAdresses.nome_bairro = e.bairro.nome_bairro;
          this.dataAdresses.nome_cidade = e.bairro.municipio.nome_mun;
          this.dataAdresses.num = e.num;
          this.dataAdresses.versao = e.versao;
          this.dataAdresses.id_municipio = e.bairro.municipio.id_municipio;
          this.dataAdresses.id_bairro = e.bairro.id_bairro;
          this.dataAdresses.id_pessoa = e.pessoa.id;

          this.dataAdresses.id_uf = e.bairro.municipio.uf.id_uf;
          this.cidadeEsolhida = e.bairro.municipio;
        },
        dataAdresses: {
            handler(e) {
                if (e.id_uf != this.controllUf) {
                    this.controllUf = e.id_uf;
                    e.id_uf && this.getCidade();
                }
            },
            deep: true
        }
    }
}
</script>
