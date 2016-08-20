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
                        console.log('canoli');
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
                         return {data: ''};
                     },
    componentDidMount: function() {
                           $.ajax({
                               url: this.props.url,
                           dataType: 'json',
                           success: function(data) {
                               this.setState({data: data});
                           }.bind(this),
                           error: function(xhr, status, err) {
                                      console.error(this.props.url, status, err.toString());
                                  }.bind(this)
                           });
                       },
    render: function() {
                return (
                    <div className="verse">
                    <div dangerouslySetInnerHTML={{__html: this.state.data}} />
                    </div>
                    );
            }
});
ReactDOM.render(<InputBox/>, document.getElementById('input'));
function showVerse(input) {
    $("#output").empty();
    console.log('attempting to show');
    console.log(input);
    let verses = input.split(/[,\n;]+/);
    let verseComponents = verses.map(function(vrs, i) {
        return <div key={i}><Verses url={"/verse/" + vrs}/></div>
    });
    ReactDOM.render(<div>{verseComponents}</div>, document.getElementById('output'));
}
