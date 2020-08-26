declare module 'vue/types/vue' {
  interface Vue {
    prototype: any;
    $bus: any;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    bus?: any;
  }
}
