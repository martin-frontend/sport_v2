<template>
    <svg class="svg-icon" :class="iconClass" aria-hidden="true">
        <use :xlink:href="iconName" />
        <linearGradient id="myg" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ffa803" />
            <stop offset="100%" stop-color="#ffc500" />
        </linearGradient>
    </svg>
</template>

<style lang="scss" scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    min-width: 1em;
    min-height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
.active {
    fill: url(#myg);
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component
export default class SvgIcon extends Vue {
    @Prop() icon!: string;
    @Prop() iconClass!: string;

    get iconName() {
        return `#icon-${this.icon}`;
    }
}
</script>
