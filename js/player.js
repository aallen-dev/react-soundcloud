;(function(){
    window.d = jsnox(React);

    Backbone.Router.extend({

        initialize:function(){

        } ,
        routes:{
            '*default' : 'home' ,
            'search/:searchText' : 'search'


        },
        home:function(){

        },
        search:function(){

        }

    });

    var searched = Backbone.Model.extend({
        
        setURL:function(options){
            
            this.url = [
                'https://api.soundcloud.com/tracks?',
                'client_id=f88b5e0c067373ed7a07c3a0a3e4d588',
                options.searchText ? '&q=' + options.searchText : '' ,
                options.limit ? '&limit=' + options.limit : '&limit=3'
            ].join('');

            return this;

        }

    });

    var player = {

        stream:null,

        loadTrack:function(id){


            // $('#player').html([
            //     '<audio controls src="http://api.soundcloud.com/tracks/',
            //     id,
            //     '/stream' ,
            //     '?client_id=f88b5e0c067373ed7a07c3a0a3e4d588"></audio>'
            //     ].join(''));
            // var self = this;
            // var onReady = $.Deferred();

            // SC.stream('/tracks/' + id , function(sound){
                
            //     self.stream = sound;

            //     onReady.resolve()

            // });
            // onReady.then(function(){

            //     self.stream.onload = function(){alert()}
            //     self.stream.play();

            //     soundManager
            //     // debugger
            //     // .whileplaying(function() {
            //     //     console.log(this);
            //     // });
            // })
            // this
            // debugger
            // this.stream.play()
        }

    }

    var player = React.createClass({

        // componentDidMount: function(data) {
        //     this._setStream()
        // },

        _setStream:function(){

            var track = this.props.track;

            this.refs['player'].getDOMNode().src = [
                'http://api.soundcloud.com/tracks/' ,
                track.id ,
                '/stream' ,
                '?client_id=f88b5e0c067373ed7a07c3a0a3e4d588'
            ].join('');

        },

        render: function() {

            var track = this.props.track;
            
            try {    // won't work on the first pass
                this._setStream();
            }catch(e){}
// debugger
            if(!track.user)return d('div@player')
           

            return d('div.player' , [
                d('h3', {key:'userName'} ,  track.user.username) ,
                d('img[src=' + (track.artwork_url||'./pics/notfound.jpg') + '].thumbs') ,

                d('audio[controls=true].controls@player') ,

                d('div', {key:'title'} , track.title) ,

                d('span[title='+track.playback_count+']', {key:'played'},'played') ,
                d('span[title='+track.favoritings_count+']', {key:'favorited'} , 'Fav\'ed')

            ]);

        }
    });
    
        React.createElement(player,{track:{}})
            // React.render(el, $('#player')[0]);
    var searchResults = React.createClass({

        getInitialState: function() {
            return { track: {}};
        },
        _selectTrack:function(e){
            
            var track = this.props.results[e.currentTarget.id.toString().replace(/[a-z]/gi,'')]

            // var el = React.createElement(player,{track:track})
            // React.render(el, $('#player')[0]);
            this.setState({track:track});
            
        },

        render: function() {

            var self = this;

            return d('div', null, d('ul.grid.grid-4-600.grid-2-400' , null , [

                this.props.results.map(function(track , index) {
                    
                    return  d('li#index'+index , {onClick:self._selectTrack,key:'userName' + track.id} , track.user.username)

                }) ,

                d(player, {track: this.state.track})
            ]));
        }
    });

    var searcher = React.createClass({
       
        getInitialState: function() {
            return { results: []};
        },

        _submit:function(e){
    
            e.preventDefault()
            var searchbox = $(this.refs.searchbox.getDOMNode())
                                .addClass('top');

            var self = this;
            this.props.model.setURL( { searchText:searchbox.val() , limit:12 } )
                .fetch()
                .then(function(data) {
                    
                    self.setState({results:data});
                    
                });
        },

        _search:function(e){
            console.log(e.target.value)
        },

        render: function() {

            return d('form' , {onSubmit: this._submit} , [

                d('input[type=text].search.centerit@searchbox' , {onKeyUp:this._search , placeholder:'search'}) ,
                
                d(searchResults, {results: this.state.results})
            ]);

        }
    });
    
    var el = React.createElement(searcher, {model:new searched});
    React.render(el, $('.app-container')[0]);

})();










