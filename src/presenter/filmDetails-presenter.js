import FilmDetailsContent from "../view/film-details.js";
import {render, RenderPosition, replace, remove, UserAction, UpdateType} from "../utils/common.js";

const body = document.querySelector(`body`);
const State = {
  BLOCKED: `BLOCKED`,
  UNBLOCKED: `UNBLOCKED`,
  DELETED: `DELETED`,
  ABORTING: `ABORTING`
};

export default class FilmDetailsPresenter {
  constructor(filmDetailsContainer, cardsModel, changeData, api) {
    this._filmDetailsContainer = filmDetailsContainer;
    this._cardsModel = cardsModel;
    this._changeData = changeData;
    this._api = api;

    this._filmDetailsComponent = null;

    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleAddCommentClick = this._handleAddCommentClick.bind(this);

    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(card) {
    this._card = card;
    const prevfilmDetailsComponent = this._filmDetailsComponent;
    this._filmDetailsComponent = new FilmDetailsContent(card);

    this._filmDetailsComponent.setWatchListClicHandler(this._handleAddToWatchListClick);
    this._filmDetailsComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsComponent.setDeleteCommentHandler(this._handleDeleteCommentClick);
    this._filmDetailsComponent.setAddCommentHandler(this._handleAddCommentClick);

    this._filmDetailsComponent.setClickHandler(this._closeFilmDetails);
    document.addEventListener(`keydown`, this._onEscKeyDown);

    if (!prevfilmDetailsComponent) {
      render(this._filmDetailsContainer, this._filmDetailsComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmDetailsContainer.contains(prevfilmDetailsComponent.getElement())) {
      replace(this._filmDetailsComponent, prevfilmDetailsComponent);
    }

    remove(prevfilmDetailsComponent);
  }

  destroy() {
    remove(this._filmDetailsComponent);
  }

  updatePopUp(card) {
    this._card = card;
    this._filmDetailsComponent.updateData(card);
  }

  _handleAddToWatchListClick() {
    const card = Object.assign(this._card,
        {
          isAddToWatchList: !this._card.isAddToWatchList
        });
    this._changeData(
        UserAction.UPDATE_CARD,
        UpdateType.MINOR,
        card
    );
  }

  _handleWatchedClick() {
    const card = Object.assign(this._card,
        {
          isWatched: !this._card.isWatched
        });
    this._changeData(
        UserAction.UPDATE_CARD,
        UpdateType.MINOR,
        card
    );
  }

  _handleFavoriteClick() {
    const card = Object.assign(this._card,
        {
          isFavorite: !this._card.isFavorite
        });
    this._changeData(
        UserAction.UPDATE_CARD,
        UpdateType.MINOR,
        card
    );
  }

  _handleDeleteCommentClick(commentId) {
    const cardId = this._card.id;
    this._api.deleteComment(commentId).then(() => {
      this.setStateForm(State.DELETED);
      this._cardsModel.deleteComment(UpdateType.MINOR, commentId, cardId);
    })
    .catch(() => {
      this.setStateForm(State.ABORTING);
    });
  }

  _handleAddCommentClick(commentValue, commentEmotion, commentDate) {
    const newComment = {};
    newComment.comment = commentValue;
    newComment.emotion = commentEmotion;
    newComment.date = commentDate;
    const cardId = this._card.id;
    this.setStateForm(State.BLOCKED);
    this._api.addComment(this._card, newComment).then((response) => {
      this.setStateForm(State.UNBLOCKED);
      this._cardsModel.addComment(UpdateType.MINOR, response, cardId);
    })
    .catch(() => {
      this.setStateForm(State.ABORTING);
    });
  }

  setStateForm(state) {
    const resetFormState = () => {
      this._filmDetailsComponent.updateData({
        isBlocked: false,
        isDisabled: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.DELETED:
        this._filmDetailsComponent.updateData({
          isDisabled: false,
          isDeleting: false
        });
        break;
      case State.BLOCKED:
        this._filmDetailsComponent.updateData({
          isBlocked: true
        });
        break;
      case State.UNBLOCKED:
        this._filmDetailsComponent.updateData({
          isBlocked: false
        });
        break;
      case State.ABORTING:
        this._filmDetailsComponent.shake(resetFormState);
        break;
    }
  }

  _closeFilmDetails() {
    remove(this._filmDetailsComponent);
    body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._closeFilmDetails();
    }
  }
}
