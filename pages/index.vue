<style lang="scss" scoped>
#page-login-box-row {
  min-height: 100vh;
}
</style>

<template>
  <v-container>
    <v-row id="page-login-box-row" align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card :loading="loadingLogin">
          <v-card-title>
            Autenticação
          </v-card-title>

          <v-card-text>
            <v-alert text dense transition="scale-transition" :value="errorLogin" type="error">
              {{ messageErrorLogin }}
            </v-alert>

            <v-form>
              <v-text-field v-model="login.usuario" label="Usuário" placeholder="Usuário" outlined></v-text-field>

              <v-text-field v-model="login.senha" type="password" label="Senha" placeholder="Senha"
                outlined></v-text-field>

              <v-btn block @click="sendLogin">
                Entrar
              </v-btn>
            </v-form>

            <v-overlay :value="loadingLogin"></v-overlay>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Axios from 'axios';

export default {
  layout: 'index',
  middleware: ['authLogin'],
  created() {
    if (this.$auth.loggedIn) {
      this.$router.push('/home');
    }
  },
  data() {
    return {
      loadingLogin: false,
      login: {
        empresa: '',
        usuario: '',
        senha: ''
      },
      errorLogin: false,
      messageErrorLogin: ''
    }
  },
  methods: {
    sendLogin() {
      let login = this.login;

      if (login.usuario.trim() != '' && login.senha.trim() != '') {
        this.loadingLogin = true;

        let data = `username=${login.usuario.trim()}&password=${login.senha.trim()}&grant_type=password`;

        //Axios.post('http://localhost:8081/oauth/token', data, {
        Axios.post('https://nodeapi.admdigital.com.br/oauth/token', data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic YWRtOnd4cDk='
          }
        })
          .then((res) => {
            this.$auth.$storage.setUniversal('company', res.data.empresa);
            this.$auth.$storage.setUniversal('user', res.data.Nome);

            this.$auth.setUserToken(res.data.access_token);

            this.$router.push('/home');
          })
          .catch((err) => {
            this.errorLogin = true;
            this.messageErrorLogin = err.response.data.error_description;

            setTimeout(() => this.errorLogin = false, 5000);

          })
          .finally(() => this.loadingLogin = false);
      }
    }
  }
}
</script>
