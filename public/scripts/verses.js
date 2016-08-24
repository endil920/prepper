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
                    <textarea
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                    onFocus={this.onFocus}
                    onKeyPress={this.onKeyPress}
                    />
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
    $("#output").empty();
    Actions.clear();
    let verses = input.split(/[,\n;]+/);
    let verseComponents = verses.map(function(vrs, i) {
        return <div key={i}><Verses url={"/verse/" + vrs} index={i}/></div>
    });
    ReactDOM.render(<div>{verseComponents}</div>, document.getElementById('output'));
}
