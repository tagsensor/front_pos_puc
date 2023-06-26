<template>
    <div>
        <div v-if="error.statusCode === 404">
            <h1>Página não encontrada</h1>
        </div>

        <div v-if="error.statusCode === 500">
            <h1>Desculpe, houve um erro inesperado</h1>
        </div>
    </div>
</template>

<script>
export default {
    props: ['error']
}
</script>