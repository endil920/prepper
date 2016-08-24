var alt = require('../../alt');

class PassageActions {
    clear() {
        return true;
    }
    initializePassage(passage, index) {
        return {passage: passage, index: index};
    }
    toggleNotations() {
        return true;
    }
}

module.exports = alt.createActions(PassageActions);
