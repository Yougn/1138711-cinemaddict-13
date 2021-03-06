import Abstract from "../view/abstract.js";
import dayjs from "dayjs";

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  WATCHED: `watched`,
  FAVORITES: `favorites`
};

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export const MenuItem = {
  CARDS: `CARDS`,
  STATISTICS: `STATISTICS`
};

export const UserAction = {
  UPDATE_CARD: `UPDATE_CARD`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

export const Rank = {
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};

export const SpecialName = {
  SYMBOLS_COUNT: 139,
  ONE: 1,
  TEN: 10,
  ELEVEN: 11,
  TWENTY: 20,
  TWENTY_ONE: 21
};

export const render = (container, child, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }
  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortCardUp = (cardA, cardB) => {
  return dayjs(cardB.date).diff(dayjs(cardA.date));
};

export const sortCardRating = (cardA, cardB) => {
  const weight = getWeightForNullDate(cardA.rating, cardB.rating);

  if (weight !== null) {
    return weight;
  }

  return cardB.rating - cardA.rating;
};

export const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;
  return hours + `h ` + minutes + `m`;
};

export const getRankOfUser = (cards) => {
  const cardsLength = cards.filter((card) => card.isWatched).length;
  let rank = ``;
  if (cardsLength >= SpecialName.ONE && cardsLength <= SpecialName.TEN) {
    rank = Rank.NOVICE;
  } else if (cardsLength >= SpecialName.ELEVEN && cardsLength <= SpecialName.TWENTY) {
    rank = Rank.FAN;
  } else if (cardsLength >= SpecialName.TWENTY_ONE) {
    rank = Rank.MOVIE_BUFF;
  }
  return rank;
};

export const renderTemplate = (container, template, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

