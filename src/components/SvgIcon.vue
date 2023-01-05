<template>
  <svg class="svg-icon" :class="iconClass" aria-hidden="true">
      <use :xlink:href="iconName" />
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
