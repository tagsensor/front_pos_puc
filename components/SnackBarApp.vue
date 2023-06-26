<style>
#skackbar-app, #skackbar-app * {
    pointer-events: none;
    cursor: default;
}
</style>

<template>
    <v-snackbar 
        v-model="snackBar.state"
        top
        right
        :color="snackBar.color"
        elevation="24"
        id="skackbar-app">
        {{ snackBar.message }}
    </v-snackbar>
</template>

<script>
export default {
    created() {
        this.$adm.$on('openSnackBar', (config) => {
            this.snackBar.state = true;
            this.snackBar.message = config.message;
            if (config.color == 'error') {
                this.snackBar.color = 'red darken-4';
            } else if (config.color == 'success') {
                this.snackBar.color = 'green darken-3';
            } else {
                this.snackBar.color = config.color;
            }
        });
    },
    data() {
        return {
            snackBar: {
                state: false,
                message: '',
                color: ''
            },
        }
    }
}
</script>