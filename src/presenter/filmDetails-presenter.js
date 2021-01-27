import FilmDetails from "../view/film-details.js";
import {render, RenderPosition, replace, remove, UserAction, UpdateType} from "../utils.js";

const body = document.querySelector(`body`);

export const State = {
  BLOCKED: `BLOCKED`,
  UNBLOCKED: `UNBLOCKED`,
  DELETING: `DELETING`,
  DELETED: `DELETED`,
  ABORTING: `ABORTING`
};

export default class FilmDetailsPresenter {
  constructor(filmDetailsContainer, changeData) {

    this._filmDetailsContainer = filmDetailsContainer;
    this._changeData = changeData;

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

    this._filmDetailsComponent = new FilmDetails(card);
    this._filmDetailsComponent.setWatchListHandler(this._handleAddToWatchListClick);
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

  updatePopUp(card) {
    this._card = card;
  }

  destroy() {
    remove(this._filmDetailsComponent);
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

  _handleAddCommentClick(commentsCopies) {
    const card = Object.assign(this._card,
        {
          comments: commentsCopies
        });
    this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.MINOR,
        card
    );
  }

  _handleDeleteCommentClick(commentsCopies, commentId) {
    const card = Object.assign(this._card,
        {
          comments: commentsCopies,
          deleteCommentId: commentId
        });
    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.MINOR,
        card
    );
  }

  setStateForm(state) {
    const resetFormState = () => {
      this._filmDetailsComponent.updateData({
        isBlocked: false,
      });
    };

    switch (state) {
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

  setStateButton(state) {
    // const deletingBtnId = this._card.deleteCommentId;
    // const deleteBtn = document.getElementById(deletingBtnId);
    // console.log(this._card);
    // console.log(deleteBtn);

    const resetFormState = () => {
      this._filmDetailsComponent.updateData({
        isDisabled: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.DELETING:
        this._filmDetailsComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.DELETED:
        this._filmDetailsComponent.updateData({
          isDisabled: false,
          isDeleting: false
        });
        break;
      case State.ABORTING:
        this._filmDetailsComponent.shake(resetFormState);
        break;
    }
  }
}
