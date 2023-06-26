<template>
    <v-combobox v-model="clientEscolhido"
        :search-input.sync="client"
        :items="clientItems"
        item-text="nome"
        item-value="nome"
        :label="label"
        :placeholder="label"
        outlined
        hide-details
        :loading="loadingClient"
        @update:search-input="getClient" />
</template>

<script>
export default {
    props: ['value', 'type', 'itemValue', 'inputVal'],
    data() {
        return {
            client: null,
            clientEscolhido: '',
            clientItems: [],
            loadingClient: false,
        }
    },
    methods: {
        getClient() {
            if (this.client && this.client.length >= 3) {
                this.loadingClient = true;

                let l = `${this.$adm.api}/pessoa/`;
                
                if (this.type == 'fornecedor') {
                    l += 'fornecedorlike';
                } else {
                    l += 'clientelike';
                }

                this.$axios.post(l, this.client.trim())
                    .then((response) => {
                        this.clientItems = response.data;
                    })
                    .catch((error) => {
                        this.$adm.tokenRefreshRequired(error.response.data);
        
                        this.$adm.$emit('openSnackBar', {
                            message: error.response.data,
                            color: 'error'
                        });
                    })
                    .finally(() => this.loadingClient = false);
            }
        },
    },
    computed: {
        label() {
            if (this.type) {
                return this.type.charAt(0).toUpperCase() + this.type.slice(1);
            }
        }
    },
    watch: {
        clientEscolhido(e) {
            let c = typeof e == 'string'
                ? e
                : e.nome;
            
            this.$axios.post(`${this.$adm.api}/pessoa/nome_cpf/`, c)
                .then((response) => {
                    if (response.data.id_pessoa) {
                        let r = response.data;

                        if (this.itemValue) {
                            r = response.data[this.itemValue];
                        }

                        this.$emit('input', r);
                    }
                })
                .catch((error) => {
                    this.$adm.tokenRefreshRequired(error.response.data);
        
                    this.$adm.$emit('openSnackBar', {
                        message: error.response.data,
                        color: 'error'
                    });
                });

        },
        value(e) {
            if (!e) {
                this.client = null;
                this.clientEscolhido = '';
            } else {
                this.clientEscolhido = e;
            }
        },
    }
}
</script>