<template>
    <div>
        <v-progress-linear
            indeterminate
            :active="loading"></v-progress-linear>

        <v-list shaped dense>
            <v-list-item>
                <v-list-item-avatar color="purple">US</v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title>
                        Usuário: {{ $auth.$storage.getUniversal('user') }}
                    </v-list-item-title>

                    <v-list-item-subtitle>
                        Empresa: {{ $auth.$storage.getUniversal('company') }}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-list-group
                v-for="(m, i) in menu"
                :key="i"
                no-action>
                <template v-slot:activator>
                    <v-list-item-icon>
                        <v-icon>mdi-{{ m.nomeIcone }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-title>{{ m.nome }}</v-list-item-title>
                </template>

                <v-list-item
                    v-for="(sb, j) in m.subMenu"
                    :key="j"
                    link
                    @click="openPage(sb.id)">
                    <v-list-item-title>{{ sb.nome }}</v-list-item-title>
                </v-list-item>
            </v-list-group>
        </v-list>

        <v-overlay :value="loading" />
    </div>
</template>

<script>
export default {
    created() {
        this.$adm.$on('refreshMenu', this.getMenu);
    },
    mounted() {
        this.getMenu();
    },
    data() {
        return {
            menu: [],
            loading: false,
        }
    },
    methods: {
        getMenu() {
            this.$axios.defaults.headers.common['company'] = this.$auth.$storage.getUniversal('company');
            this.$axios.get(`${this.$adm.api}/menu`)
                .then((response) => {
                    let menuVisivel = response.data.filter(function (item){
                        let subMenu = item.subMenu.filter(function (s){
                            return s.visivel == true;
                        });
                        item.subMenu = subMenu;
                        return item.visivel == true;
                    });
                
                    this.menu = menuVisivel; //response.data;
                    this.$adm.menu = menuVisivel; //response.data;
                })
                .catch((error) => {
                    this.$adm.tokenRefreshRequired(error.response.data);
                });
        },
        openPage(idSub) {
            this.loading = true;

            this.$axios.get(`${ this.$adm.api }/sisPerItens/pagina/${ idSub }`, {headers: {'company': this.$auth.$storage.getUniversal('company')}})
                .then((response) => {
                    let p = response.data.pagina.replace('.html', '');
                    if (response.data.valor) {
                        this.$router.push(`/home/${p}`);
                    } else {
                        this.$adm.$emit('openSnackBar', {
                            message: 'Sem permissão de acesso',
                            color: 'error'
                        });
                        this.$adm.$emit('closeMenuApp');
                    }
                })
                .catch((error) => {
                    this.$adm.tokenRefreshRequired(error.response.data);
                })
                .finally(() => this.loading = false);
        },
    }
}
</script>
