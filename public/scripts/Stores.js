var alt = require('../../alt');
var PassageActions = require('./Actions');

let reg =/\<((sup)|(b))+[^><]*\>[^<>]+\<\/((sup)|(b))+\>/g;
let spans = /\<b[^><]*\>[^<>]*\<span[^><]*\>[^<>]*\<\/span\>[^<>]*\<\/b\>/g;

class PassageStore {
    constructor() {
        this.passages = [];
        this.withNotations = [];
        this.readerVersion = [];
        this.showNotations = true;

        this.bindListeners({
            handleInit: PassageActions.INITIALIZE_PASSAGE,
            handleToggleNotations: PassageActions.TOGGLE_NOTATIONS,
            handleClear: PassageActions.CLEAR
        });
    }

    handleClear() {
        this.passages = [];
        this.withNotations = [];
        this.readerVersion = [];
    }

    handleInit(passageObj) {
        let passage = passageObj.passage;
        let index = passageObj.index;
        this.passages[index] = passage;
        this.withNotations[index] = passage;
        this.readerVersion[index] = passage.replace(spans, '').replace(reg, '');
    }
    handleToggleNotations() {
        if (this.showNotations) {
            this.passages = this.readerVersion;
        } else {
            this.passages = this.withNotations;
        }
        this.showNotations = !this.showNotations;
    }
}

module.exports = alt.createStore(PassageStore, 'PassageStore');
