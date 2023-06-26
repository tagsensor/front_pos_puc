<template>
    <v-row class="mx-auto"
        style="max-width: 800px">
        <v-col cols="12">
            <div class="d-flex justify-space-between align-center mb-2">
                <div>
                    <p class="mb-0">{{ title }} contato</p>
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
                        @click="deleteContact">
                        <v-icon>mdi-delete</v-icon>
                        <span class="d-none d-md-block">&ensp; Excluir</span>
                    </v-btn>

                    <v-btn
                        text
                        small
                        @click="actionButton">
                        <v-icon v-if="type == 'add'">mdi-phone-plus</v-icon>
                        <v-icon v-else>mdi-content-save</v-icon>
                        <span class="d-none d-md-block">&ensp; Salvar</span>
                    </v-btn>
                </div>
            </div>

            <v-divider />
        </v-col>

        <v-col cols="12">
            <v-switch v-model="dataContact.principal"
                label="Contato principal"
                hide-details
                class="mt-0" />
        </v-col>

        <v-col cols="12" md="6">
            <v-row>
                <v-col cols="3">
                    <v-text-field v-model="dataContact.ddd"
                        label="DDD"
                        placeholder="DDD"
                        outlined />
                </v-col>

                <v-col>
                    <v-text-field v-model="dataContact.numero"
                        label="Número"
                        placeholder="Digite o número"
                        outlined />
                </v-col>
            </v-row>
        </v-col>

        <v-col cols="12" md="6">
            <v-select v-model="dataContact.id_tipo_fone"
                label="Tipo de contato"
                :items="itemsTypeContact"
                item-text="text"
                item-value="value"
                outlined />
        </v-col>

        <v-col cols="12" md="6">
            <v-text-field v-model="dataContact.contato"
                label="Nome contato"
                placeholder="Nome de contato"
                outlined />
        </v-col>

        <v-col cols="12" md="6">
            <v-text-field v-model="dataContact.email"
                label="Email"
                placeholder="Email de contato"
                outlined />
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'addAndEditContactClient',
    props: ['type', 'idPessoa', 'contact', 'value'],
    mounted() {
        if (this.contact) {
            this.dataContact = this.contact;

            this.itemsTypeContact.forEach((el) => {
                if (el.text == this.contact.tipoFone.descricao) {
                    this.dataContact.id_tipo_fone = el.value;
                }
            });
        }
    },
    data() {
        return {
            title: ( this.type == 'add'
                ? 'Adicionar'
                : 'Editar'
            ),
            itemsTypeContact: [
                {
                    text: 'RESIDENCIAL',
                    value: 1
                },
                {
                    text: 'COMERCIAL',
                    value: 2
                },
                {
                    text: 'CELULAR',
                    value: 3
                },
                {
                    text: 'REFERÊNCIA',
                    value: 4
                },
                {
                    text: 'SMS',
                    value: 5
                }
            ],
            dataContact: {
                contato: "",
                ddd: "",
                email: "",
                id_telefone: 0,
                id_tipo_fone: "0",
                numero: "",
                principal: 0,
                versao: 0
            }
        }
    },
    methods: {
        changeTab() {
            this.dataContact = {
                contato: "",
                ddd: "",
                email: "",
                id_telefone: 0,
                id_tipo_fone: "0",
                numero: "",
                principal: 0,
                versao: 0
            };

            this.$emit('input', 1);
        },
        actionButton() {

            let data = {};
            data.versao = this.dataContact.versao;
            data.tipoFone = {"id_tipo_fone": this.dataContact.id_tipo_fone};
            data.ddd = this.dataContact.ddd;
            data.numero =  this.dataContact.numero;
            data.contato =  this.dataContact.contato;
            data.email = this.dataContact.email;
            data.principal = this.dataContact.principal

            if (!data.ddd){
                this.$adm.$emit('openSnackBar', {
                    message: "Informe o DDD",
                    color: 'error'
                });
                return;
            }
            if (!data.numero){
                this.$adm.$emit('openSnackBar', {
                    message: "Informe o número",
                    color: 'error'
                });
                return;
            }
            if (data.tipoFone.id_tipo_fone == 0){
                this.$adm.$emit('openSnackBar', {
                    message: "Informe o tipo do contato",
                    color: 'error'
                });
                return;
            }
            if (!data.contato){
                this.$adm.$emit('openSnackBar', {
                    message: "Informe o nome do contato",
                    color: 'error'
                });
                return;
            }

            if (this.type == 'add') {

                data.pessoa = {"id": this.idPessoa};

                this.$axios.post(`${this.$adm.api}/contato/`, data)
                    .then((response) => {
                        this.$adm.$emit('updateListContact', this.idPessoa);

                        this.$adm.$emit('openSnackBar', {
                            message: 'Contato adicionado com sucesso',
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

            } else if (this.type == 'edit') {
                data.pessoa = {"id": this.dataContact.pessoa.id};
                data.id_telefone = this.dataContact.id_telefone
                this.$axios.put(`${this.$adm.api}/contato/`, data)
                    .then((response) => {
                        this.$adm.$emit('updateListContact', this.dataContact.pessoa.id);

                        this.$adm.$emit('openSnackBar', {
                            message: 'Alterações feitas com sucesso',
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

            }
        },
        deleteContact() {
            let c = confirm('Tem certeza de que quer apagar este contato?');

            if (c) {

                let d = {
                    id_telefone: this.dataContact.id_telefone,
                    versao: this.dataContact.versao
                };

                this.$axios.delete(`${this.$adm.api}/contato/${this.dataContact.id_telefone}`, {
                    data: d
                })
                    .then((response) => {
                        this.$adm.$emit('updateListContact', this.dataContact.pessoa.id);

                        this.$adm.$emit('openSnackBar', {
                            message: 'Contato excluido com sucesso',
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
            }
        }
    },
    watch: {
        contact(e) {
            if (e) {
                this.dataContact = e;

                this.itemsTypeContact.forEach((el) => {
                    if (el.text == e.tipoFone.descricao) {
                        this.dataContact.id_tipo_fone = el.value;
                    }
                });
            }
        }
    }
}
</script>