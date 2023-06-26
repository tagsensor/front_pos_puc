<style>
.breadcrumb-item:nth-last-child(1) span {
    display: none;
}

.breadcrumb-item:nth-last-child(1) a {
    color: dimgray;
    pointer-events: none;
}
</style>

<template>
    <v-app>
        <client-only>
            <v-app-bar
                app
                dense
                :extension-height="(isWindows ? 48 : 0)">
                <v-app-bar-nav-icon
                    @click="drawerHome = !drawerHome"></v-app-bar-nav-icon>

                <v-toolbar-title>
                    <nuxt-link to="/home"
                        :class="['text-decoration-none', ( temaDark ? 'white--text': 'black--text' )]">
                        SysCom
                    </nuxt-link>
                </v-toolbar-title>

                <v-spacer />

                <v-toolbar-items>
                    <v-btn
                        text
                        :icon="$mq != 'lg'"
                        @click="logout">
                        <v-icon>mdi-logout</v-icon>
                        <span class="d-none d-md-block">&nbsp; Sair</span>
                    </v-btn>
                </v-toolbar-items>
    
                <template v-slot:extension>
                    <app-window-bar v-model="isWindows" />
                </template>
            </v-app-bar>

            <v-navigation-drawer
                app
                v-model="drawerHome">
                
                <menu-app />

                <template v-slot:append>
                    <div class="pa-5 pb-0">
                        <v-switch v-model="temaDark"
                            @change="mudarTema">
                            <template v-slot:label>
                                Tema escuro&ensp;
                                <v-icon>mdi-weather-night</v-icon>
                            </template>
                        </v-switch>
                    </div>
                </template>
            </v-navigation-drawer>

            <v-main class="pa-5">
                <v-main>
                    <!-- breadcrump -->
                    <div class="d-flex pa-2">
                        <div v-for="(b, i) in breadcrumbs"
                            :key="i"
                            class="breadcrumb-item">
                            <nuxt-link :to="b.to"
                                class="caption text-decoration-none pa-3">
                                {{ b.text }}
                            </nuxt-link>

                            <span>></span>
                        </div>
                    </div>

                    <Nuxt />

                    <v-btn v-if="fabToUp"
                        fab
                        bottom
                        right
                        fixed
                        @click="toTheTop">
                        <v-icon>mdi-arrow-up</v-icon>
                    </v-btn>
                </v-main>
            </v-main>

            <v-footer padless>
                <v-col cols="12">
                    <v-main tag="div"
                        class="pa-0">
                        <v-main tag="div"
                            class="py-0">
                            <p class="mb-0">SysCom {{ $adm.version }}</p>
                        </v-main>
                    </v-main>
                </v-col>
            </v-footer>

            <v-dialog
                v-model="refreshToken.state"
                persistent
                transition="dialog-bottom-transition"
                max-width="380">
                <v-card
                    :loading="refreshToken.loadingLogin">
                    <v-toolbar dense
                        class="mb-5">
                        <v-toolbar-title>Autentique-se</v-toolbar-title>
                    </v-toolbar>

                    <v-card-text>
                        <v-alert
                            dense
                            text
                            :value="refreshToken.errorLogin"
                            transition="scale-transition"
                            type="error">
                            {{ refreshToken.messageErrorLogin }}
                        </v-alert>

                        <v-form>
                            <v-text-field
                                disabled
                                class="not-allowed"
                                v-model="refreshToken.login.usuario"
                                label="Usuário"
                                readonly
                                placeholder="Usuário"
                                outlined></v-text-field>

                            <v-text-field
                                v-model="refreshToken.login.senha"
                                type="password"
                                label="Senha"
                                placeholder="Senha"
                                outlined></v-text-field>

                            <v-text-field
                                disabled
                                class="not-allowed"
                                v-model="refreshToken.login.empresa"
                                label="Empresa"
                                readonly
                                placeholder="Empresa"
                                outlined></v-text-field>

                            <div class="d-flex justify-space-between align-center">
                                <v-btn
                                    @click="logout"
                                    small
                                    text
                                    class="pl-0">
                                    Sair
                                </v-btn>

                                <v-btn 
                                    @click="sendRefreshToken">
                                    Entrar
                                </v-btn>
                            </div>
                        </v-form>

                        <v-overlay :value="refreshToken.loadingLogin" absolute></v-overlay>
                    </v-card-text>
                </v-card>
            </v-dialog>

             <snack-bar-app />
        </client-only>
    </v-app>
</template>

<script>

export default {
    middleware: ['authentication'],
    created() {
        this.$adm.$on('refreshToken', () => this.refreshToken.state = true);

        this.$adm.$on('closeMenuApp', () => this.drawerHome = false);

    },
    mounted() {
        if (typeof this.$auth.$storage.getUniversal('themeDark') == 'boolean') {
            this.$vuetify.theme.dark = this.$auth.$storage.getUniversal('themeDark');
        }

        this.temaDark = this.$vuetify.theme.dark;

        window.onscroll = () => {
            this.fabToUp = (window.scrollY >= 200);
        };

        if (this.$mq == 'lg') {
            this.drawerHome = true;
        }
    },
    data() {
        return {
            drawerHome: false,
            refreshToken: {
                state: false,
                errorLogin: true,
                messageErrorLogin: 'Sua sessão expirou',
                loadingLogin: false,
                login: {
                    empresa: this.$auth.$storage.getUniversal('company'),
                    usuario: this.$auth.$storage.getUniversal('user'),
                    senha: ''
                }
            },
            isWindows: false,
            fabToUp: false,
            novaSenha: false,
            temaDark: false
        }
    },
    methods: {
        toTheTop() {
            window.scrollTo(0, 0);
        },
        logout() {
            this.$auth.$storage.removeUniversal('company');
            this.$auth.$storage.removeUniversal('user');

            window.localStorage.clear();
            window.sessionStorage.clear();

            this.$auth.logout('local');
        },
        sendRefreshToken() {
            let login = this.refreshToken.login;

            if (login.empresa.trim() != '' && login.usuario.trim() != '' && login.senha.trim() != '') {
                this.refreshToken.loadingLogin = true;

                let data = `${login.usuario};${login.senha};${login.empresa};`;

                this.$axios.post(`${this.$adm.api}/usuario/login`, data)
                    .then((response) => {
                        this.$auth.setUserToken(response.data);

                        this.$auth.$storage.setUniversal('company', login.empresa);
                        this.$auth.$storage.setUniversal('user', login.usuario);

                        this.$adm.$emit('refreshMenu');

                        this.refreshToken.state = false;
                        // this.$router.go(this.$router.currentRoute);
                    })
                    .catch((error) => {
                        this.refreshToken.errorLogin = true;
                        this.refreshToken.messageErrorLogin = error.response.data;

                        if (error.response.data === 'Senha Expirada. Digite uma nova senha para ter acesso ao sistema') {
                            this.novaSenha = true;
                        }
                    })
                    .finally(() => this.refreshToken.loadingLogin = false);

            }
        },
        mudarTema() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            this.$auth.$storage.setUniversal('themeDark', this.$vuetify.theme.dark);
        }
    },
    computed: {
        breadcrumbs() {
            let routers = this.$route.path.substr(1);
            routers = routers[routers.length - 1] == '/'
                ? routers.substr(0, routers.length - 1)
                : routers;
            let items = [];
            let beforeRouter = '';

            routers.split('/').forEach(element => {
                beforeRouter += `/${element}`;

                items.push({
                    text: element,
                    disabled: false,
                    to: beforeRouter
                });
            });

            items[items.length -1].disabled = true;

            return items;
        }
    },
}
</script>