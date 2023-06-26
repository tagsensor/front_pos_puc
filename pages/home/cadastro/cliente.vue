<template>
    <div>
        <div v-if="authorized">
            <h1 class="mb-5">Cadastrar cliente</h1>

            <toolbar-pesquisa-cliente-fornecedor />
        </div>

        <div v-else>
            <h1 class="mb-5">Sem permissão de acesso</h1>

            <p>Redirecionando para página principal em {{ seconds }} segundos</p>
        </div>
    </div>
</template>

<script>
import ToolbarPesquisaClienteFornecedor from '~/components/Cadastro/ToolbarPesquisaClienteFornecedor.vue';

export default {
    components: {
        ToolbarPesquisaClienteFornecedor
    },
    created() {
        this.$adm.$on('unauthorizedPage', () => {
            this.authorized = false;

            if (process.client) {
                setInterval(() => {
                    this.seconds -= 1;
    
                    if (this.seconds == 0) {
                        this.$router.push('/home');
                    }
                }, 1000);
            }
        });
    },
    data() {
        return {
            authorized: true,
            seconds: 10
        }
    }
}
</script>