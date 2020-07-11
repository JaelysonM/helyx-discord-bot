
module.exports = {
  addListener(listener) {
    try {
      listener.registerListeners();
      return true;
    } catch (err) {
      return false;
    }

  }
}