import {createElement} from "../utils.js";

const createNoCard = () => {
  return `<h2 class="films-list__title">There are no movies in our database</h2>`;
};

export default class NoCard {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoCard();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}