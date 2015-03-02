;(function(){
    window.d = jsnox(React);

    // var searchText = 'Kenny Chesney'
    
    // $.get(url).then(function(data){
    //     console.log(data)
    //     // debugger
    // });

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
            
            player.loadTrack(model.id)
            var thumbNode = this.refs['thumb'+model.id].getDOMNode()
            var audioNode = this.refs['track'+model.id].getDOMNode()

            $('.controls').addClass('hidden').attr('src','')
            $('.thumbs').addClass('hidden')
            $(thumbNode).removeClass('hidden')
            $(audioNode).removeClass('hidden')

            audioNode.src = ['http://api.soundcloud.com/tracks/',
                model.id,
                '/stream' ,
                '?client_id=f88b5e0c067373ed7a07c3a0a3e4d588'].join('')
            // debugger
            // $.get(model.stream_url+'?client_id=f88b5e0c067373ed7a07c3a0a3e4d588')
            // debugger

        },
        render: function() {
            var self = this;
            return d('ul', null, this.props.results.map(function(track , index) {
                return d('li#index'+index, {onClick:self._selectTrack,key:track.id}, [
                    d('div', {key:'userName'+track.id},'author:'+track.user.username),
                    d('div', {key:'title'+track.id},'title:'+track.title),

                    d('div', {key:'played'+track.id},'played:'+track.playback_count),
                    d('div', {key:'favorited'+track.id},'favorited:'+track.favoritings_count),

                    // d('div' + track.id , track.artwork_url),
                    d('img[src='+track.artwork_url+'].thumbs.hidden@thumb' + track.id),
                    d('audio[controls=true].controls.hidden@track' + track.id)
                ]
                );
            }));
        }
    });

    // "playback_count": 10,
    // "download_count": 6,
    // "favoritings_count": 1,

    var searcher = React.createClass({
       
        // // creates the state object when a component is first created
        getInitialState: function() {
            return { results: []}
        },

        // // called when a component is attached to the DOM
        // componentDidMount: function(data) {
        //     // debugger;
        // },
        // // called when a component is detached from the DOM
        // componentWillUnmount: function() {
        //     // debugger;
        // },
        _showResults:function() {

            // var 
            // $(this.refs.results.getDOMNode()).html(function(){


            // })

        },
        _submit:function(e){
    
            e.preventDefault()
            var searchbox = $(this.refs.searchbox.getDOMNode())
                                .addClass('top');

            var self = this;
            this.props.model.setURL( { searchText:searchbox.val() } )
                .fetch()
                .then(function(data) {
                    self.setState({results:data})
                    // debugger
                    // self._showResults()
                });
        },

        // called whenever the state changes
        render: function() {

            return d('form' , {onSubmit: this._submit} , [

                    d('input[type=text].search.centerit@searchbox' , {placeholder:'search'}) ,
                    d(searchResults, {results: this.state.results})
                    // d('div.results@results')
                ]
            );

        }
    });


// var context = new webkitAudioContext(),
//     audio = new Audio(),
//     source,
//     // `stream_url` you'd get from 
//     // requesting http://api.soundcloud.com/tracks/6981096.json
//     url = 'http://api.soundcloud.com/tracks/6981096/stream' +
//           '?client_id=f88b5e0c067373ed7a07c3a0a3e4d588';

// audio.src = url;
// audio.controls = true
// source = context.createMediaElementSource(audio);
// source.connect(context.destination);
// source.mediaElement.play();



    // SC.initialize({
    //     client_id: "f88b5e0c067373ed7a07c3a0a3e4d588",
    //     redirect_uri: "./callback.html",
    // });

    // SC.connect(function(){
    //     SC.put("/me/followings/3207", function(user, error){
    //         if(error){
    //             alert("Error: " + error.message);
    //         }else{
    //             alert("You are now following " + user.username);
    //         }
    //     });
    // });
    var search = new searched
    // var player = new player

    
    var el = React.createElement(searcher, {model:search});
    React.render(el, $('.app-container')[0]);

})();










