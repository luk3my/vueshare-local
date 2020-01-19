<template>

        <b-alert style="margin-top: 20px;" show variant="warning" dismissible>
            <h5>{{message}}</h5>
        </b-alert>

</template>

<script>
    export default {
        props: ['message']     
    }
</script>