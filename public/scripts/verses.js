var React = require('react');
var PassageStore = require('./Stores');
var Actions = require('./Actions');

var InputBox = React.createClass({
    getInitialState: function() {
                         return {value: "Please input verses/passages here. Separate by comma"};
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
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                    onFocus={this.onFocus}
                    onKeyPress={this.onKeyPress}
                    />
                    <br/>
                    Press Enter to Display Verse Text
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

var Verses = React.createClass({
    getInitialState: function() {
                         return {passage: ''};
                     },
    stripText: function() {
                   this.state.data = this.state.data.replace(/\<sup.*\/sup\>/g, '');
               },
    componentDidMount: function() {
                           var that = this;
                           PassageStore.listen(function(state) {
                               console.log("i heaar" + that.props.index);

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

ReactDOM.render(<InputBox/>, document.getElementById('input'));
function showVerse(input) {
    $("#outputContainer").empty();
    Actions.clear();
    let verses = input.split(/[,\n;]+/);
    let verseComponents = verses.map(function(vrs, i) {
        return <div key={i}><Verses url={"/verse/" + vrs} index={i}/></div>
    });
    ReactDOM.render(<div><ToggleNotationsButton/>
            <CopyButton/>
            <div id="output">
            <div id="verses">{verseComponents}</div></div></div>, document.getElementById('outputContainer'));
    new Clipboard('.cbutton');
}
