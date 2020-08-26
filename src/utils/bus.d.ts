import Vue from 'vue'

export declare class SelfPlug extends Vue {
  static install(vue: typeof Vue): void;
}

export declare class Bus extends SelfPlug {
  getReals: (id: number[]) => Promise<any>;
}
