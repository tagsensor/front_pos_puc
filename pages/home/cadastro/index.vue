<template>
    <div>
        <h1 class="mb-5">Cadastro</h1>

        <v-row>
            <v-col cols="6">
                <v-card to="/home/cadastro/cliente">
                    <v-card-title>Cliente</v-card-title>
                </v-card>
            </v-col>

            <v-col cols="6">
                <v-card to="/home/cadastro/fornecedor">
                    <v-card-title>Fornecedor</v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    layout: 'home'
}
</script>