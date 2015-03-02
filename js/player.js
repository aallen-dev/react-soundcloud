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


    var searchResults = React.createClass({
        // displayName: 'TodoList',
        _selectTrack:function(e){
            
            var model = this.props.results[e.currentTarget.id.toString().replace(/[a-z]/gi,'')]
            
            // player.loadTrack(model.id)
            var playerNode = this.refs['player'+model.id].getDOMNode()
            var audioNode  = this.refs['track'+model.id].getDOMNode()

            $('.controls').attr('src','');
            $('.player').addClass('hidden');
            $(playerNode).removeClass('hidden');

            audioNode.src = ['http://api.soundcloud.com/tracks/',
                model.id,
                '/stream' ,
                '?client_id=f88b5e0c067373ed7a07c3a0a3e4d588'].join('');
            
        },
        render: function() {
            var self = this;

            var listItems = this.props.results.map(function(track , index) {
                    
                return  d('li#index'+index , {onClick:self._selectTrack,key:'userName' + track.id} , track.user.username)
                        


            })
            var players = this.props.results.map(function(track , index) {

                return d('div.player.hidden@player' + track.id , [
                    d('h3', {key:'userName' + track.id} ,  track.user.username) ,
                    d('img[src=' + (track.artwork_url||'./pics/notfound.jpg') + '].thumbs') ,

                    d('audio[controls=true].controls@track' + track.id),

                    d('div', {key:'title' + track.id} , track.title),

                    d('span[title='+track.playback_count+']', {key:'played' + track.id},'played') ,
                    d('span[title='+track.favoritings_count+']', {key:'favorited' + track.id} , 'Fav\'ed')

                ]);

            });

            return d('div', null, [d('ul.grid.grid-4-600.grid-2-400' , null , listItems) , players]);
        }
    });

    var searcher = React.createClass({
       
        getInitialState: function() {
            return { results: []}
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

        render: function() {

            return d('form' , {onSubmit: this._submit} , [

                d('input[type=text].search.centerit@searchbox' , {placeholder:'search'}) ,
                
                d(searchResults, {results: this.state.results})
            ]);

        }
    });


    var search = new searched
    
    var el = React.createElement(searcher, {model:search});
    React.render(el, $('.app-container')[0]);

})();










