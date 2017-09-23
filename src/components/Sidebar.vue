<template>
    <div class="wrapper">
        <div class="ui sidebar visible right inverted vertical menu">
            <slot name="sidebar"></slot>
        </div>
        <div class="pusher">
            <slot name="pusher"></slot>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.wrapper,
.pusher{
    height: 100%
}
</style>


