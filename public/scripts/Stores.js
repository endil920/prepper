var alt = require('../../alt');
var PassageActions = require('./Actions');

class PassageStore {
    constructor() {
        this.passages = [];

        this.bindListeners({
            handleInit: PassageActions.INITIALIZE_PASSAGE,
            handleToggleNotations: PassageActions.TOGGLE_NOTATIONS,
            handleClear: PassageActions.CLEAR
        });
    }

    handleClear() {
        this.passages = [];
    }

    handleInit(passageObj) {
        let passage = passageObj.passage;
        let index = passageObj.index;
        this.passages[index] = passage;
    }
    handleToggleNotations() {

    }
}

module.exports = alt.createStore(PassageStore, 'PassageStore');
