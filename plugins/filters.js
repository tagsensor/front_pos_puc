import Vue from 'vue';

/*
    Pega somente o nome do cliente das paginas de
    cadastro/clientes e cadastro/fornecedores, separando cliente de cpf/cnpj
*/
Vue.filter('onlyNameClient', (e) => {
    return e.toString().split(' - ')[0].trim();
});

/*
    Pega somente o cpf/cnpj do cliente das paginas de
    cadastro/clientes e cadastro/fornecedores, separando cpf/cnpj do nome
    retornando o ultimo item 
*/
Vue.filter('onlyCPFClient', (e) => {
    let c = e.toString().split(' - ');
    return c[c.length - 1].trim();
});
