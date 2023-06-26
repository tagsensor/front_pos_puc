<template>
    <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay>
        <template v-slot:activator="{on, attrs}">
            <div class="d-flex">
                <v-btn
                    text
                    small
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    class="mr-2">
                    <v-tooltip bottom>
                        <template v-slot:activator="{on, attrs}">
                            <span
                                v-bind="attrs"
                                v-on="on">
                                {{ data.type }} - W{{ data.id }}
                            </span>
                        </template>
                        <span>{{ data.title }}</span>
                    </v-tooltip>
                </v-btn>

                <v-btn
                    icon
                    small
                    @click="closeWindow">
                    <v-icon small>mdi-close-circle</v-icon>
                </v-btn>

                <v-divider 
                    vertical
                    class="mx-2" />
            </div>
        </template>

        <v-card>
            <v-toolbar dense
                class="rounded-0">
                <v-toolbar-title class="subtitle-2">
                    {{ data.title }}
                </v-toolbar-title>

                <v-spacer />

                <v-toolbar-items>
                    <v-btn icon
                        @click="dialog = false">
                        <v-icon>mdi-minus-circle</v-icon>
                    </v-btn>

                    <v-btn icon
                        @click="closeWindow">
                        <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <!-- Cliente e fornecedor -->
            <cliente-e-fornecedor
                v-if="data.type == 'cliente' || data.type == 'fornecedor'"
                :type="data.type"
                :nome-cpf="data.nomeCpf" />


        </v-card>
    </v-dialog>
</template>

<script>
import ClienteEFornecedor from '~/components/ForWindows/ClienteEFornecedor.vue';

export default {
    props: ['data'],
    components: {
        ClienteEFornecedor
    },
    created() {
        if (this.data.start == true) {
            this.dialog = true;
        }
    },
    data() {
        return {
            dialog: false
        }
    },
    methods: {
        closeWindow() {
            this.$adm.$emit('closeWindow', this.data.id);
        }
    }
}
</script>