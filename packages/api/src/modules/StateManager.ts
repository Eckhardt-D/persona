export class StateManager {
  private states: string[];

  constructor() {
    this.states = [];
  }

  add(state: string) {
    this.states.push(state);
  }

  del(state: string) {
    this.states.filter(s => s !== state);
  }

  verify(state: string) {
    return this.states.some(s => s === state);
  }
}
