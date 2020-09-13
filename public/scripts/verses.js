var React = require('react');
var PassageStore = require('./Stores');
var Actions = require('./Actions');

var InputBox = React.createClass({
    getInitialState: function() {
                         return {value: "Please input verses/passages here. Separate by comma - e.g. rev15:4,jn17:1,gen1"};
                     },
    handleChange: function(event) {
                      this.setState({value: event.target.value});
                  },
    onFocus: function(event) {
                 event.target.select();
             },
    onKeyPress: function(event) {
                    if (event.key === 'Enter') {
                        showVerse(this.state.value);
                    }
                },
    render: function() {
                return (
                    <div>
                    <textarea
                    rows="8"
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                    onFocus={this.onFocus}
                    onKeyPress={this.onKeyPress}
                    />
                    <br/>
                    Press Enter to Display 
                    </div>
                    );
            }
});
var ToggleNotationsButton = React.createClass({
    onClick: function() {
                 Actions.toggleNotations();
             },
    render: function() {
                return (
                    <button type="button" onClick={this.onClick}>Toggle Notations</button>
                    );
            }

});
var CopyButton = React.createClass({
    render: function() {
                return (
                    <button className="cbutton" type="button" data-clipboard-target="#verses">Copy</button>
                    );
            }

});
var ClearButton = React.createClass({
    onClick: function() {
        Actions.clear();
    },
    render: function() {
                return (
                    <button className="button" onClick={this.onClick}>Clear</button>
                    );
    }
});


var Verses = React.createClass({
    getInitialState: function() {
                         return {passage: ''};
                     },
    stripText: function() {
                   //this.state.data = this.state.data.replace(/\<sup.*\/sup\>/g, '');
                   this.state.data = this.state.data.replace(/\[\d*\]/g,'').replace('/\n.*\n/g','');
               },
    componentDidMount: function() {
                           var that = this;
                           PassageStore.listen(function(state) {
                               console.log(that.state.data);

                            that.setState({passage: state.passages[that.props.index]});
                           });
                           $.ajax({
                               url: this.props.url,
                           dataType: 'json',
                           success: function(data) {
                               Actions.initializePassage(data, that.props.index);
                           }.bind(this),
                           error: function(xhr, status, err) {
                                      console.error(this.props.url, status, err.toString());
                                  }.bind(this)
                           });
                       },
    render: function() {
                return (

                        <div className="verse">
                        <div dangerouslySetInnerHTML={{__html: this.state.passage}}/>
                        </div>
                       );
            }
});

var quickMatcher = function(regex) {
    return function(inputPassage) {
        let matching = inputPassage.match(regex);
        if (matching == null) return matching;
        return matching[0];
    }
}

var getBook = quickMatcher(/[a-zA-Z]+/);
var getChappy = quickMatcher(/[^:a-zA-Z][\d]+/);

var parseVerses = function(inputText) {
    console.log('parse verses function called');
    let result = [];
    let initSplit = inputText.split(/[,\n;]+/);
    let curBook = getBook(initSplit[0]);
    let curChappy = getChappy(initSplit[0]);
    console.log("input length: " + initSplit.length);
    console.log("last input: " + initSplit[initSplit.length - 1]);
    for (var i in initSplit) {
        let pass = initSplit[i];
        if (pass.length == 0) {
            console.log("passage is empty. Continuing.");
            continue;
        }

        let tmpChappy = getChappy(pass);
        if (tmpChappy != null) {
            console.log("chappy is " + curChappy);
            curChappy = tmpChappy;
        } else {
            pass = curChappy + ":" + pass;
            console.log("passage is " + pass + " now");
        }

        let tmpBook = getBook(pass);
        if (tmpBook != null) {
            curBook = tmpBook; 
            // just add the passage as-is
            console.log("will process passage" + pass);
        } else {
            // concatenate the passage together and add it
            console.log("will process passage " + curBook + pass);
            pass = curBook + pass;
        }

        result.push(pass);
    }
    return result;
}

ReactDOM.render(<InputBox/>, document.getElementById('input'));
function showVerse(input) {
    $("#outputContainer").empty();
    Actions.clear();
    // let verses = input.split(/[,\n;]+/);
    let verses = parseVerses(input);
    let verseComponents = verses.map(function(vrs, i) {
        return <div key={i}><Verses url={"/verse/" + vrs} index={i}/><br /></div>
    });
    ReactDOM.render(<div><ToggleNotationsButton/>
            <CopyButton/>
            <ClearButton/>
            <div id="output">
            <div id="verses">{verseComponents}</div></div></div>, document.getElementById('outputContainer'));
    new Clipboard('.cbutton');
}
