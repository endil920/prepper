var alt = require('../../alt');
var PassageActions = require('./Actions');

let verseTags =/\<((sup)|(b))+[^><]*\>[^<>]+\<\/((sup)|(b))+\>/g;
let spans = /\<b[^><]*\>[^<>]*\<span[^><]*\>[^<>]*\<\/span\>[^<>]*\<\/b\>/g;

//let titles=/\n.*\n/g;
let parens=/\[\d*\]/g;

let verseMarkers = /\[\d+\]/g;
let footNoteMarkers = /\(\d+\)/g;
let footNotes = /Footnotes.*/;
let titles = /\n\n(\w+\ ?)+\n\n/g;

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
        console.log("calle me maybe");
        let passage = passageObj.passage;
        let index = passageObj.index;
        this.passages[index] = passage;
        this.withNotations[index] = passage;
        //this.readerVersion[index] = passage.replace(spans, '').replace(verseTags, ' ').replace('  ', ' ').replace('\n ', '\n');
        //this.readerVersion[index] = passage.replace(titles, '').replace(parens, ' ').replace('  ', ' ').replace('\n ', '\n');
        this.readerVersion[index] = passage
        .replace(verseMarkers, '')
        .replace(footNoteMarkers, '')
        .replace('(ESV)','')
        .split("Footnotes")[0].replace(titles, '');
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
