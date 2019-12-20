export default {
  changeServer({ LocalState }, lastAccount) {
    LocalState.set('lastAccount', lastAccount)
  }
};
