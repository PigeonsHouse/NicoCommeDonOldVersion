import Mastodon from 'mastodon-api';
import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import './Comment.css';

class CommentPage extends Component {
  constructor(props){
    super(props);
    this.mstdn = new Mastodon({
      access_token: this.props.location.state.token,
      api_url: this.props.location.state.url + '/api/v1/',
    })
    this.state = {
      comments: [],
      isStreaming: false,
      listener: null
    };
    this.rewrite = this.rewrite.bind(this);
    this.getName = this.getName.bind(this);
  }

  mstdnStream(){
    return 
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  rewrite(txt){
    txt = txt.replace(/<br \/>/g,'　')
    txt = txt.replace(/&apos;/g, '\'')
    txt = txt.replace(/&amp;/g, '&')
    txt = txt.replace(/&quot;/g, '"')
    txt = txt.replace(/&lt;/g, '<')
    txt = txt.replace(/&gt;/g, '>')
    txt = txt.replace(/<br \/>/g,'\n')
    const e = document.createElement('div')
    e.innerHTML = txt
    return e.innerText
  }

  getName(account){
    if(account.display_name.length){
      return account.display_name;
    } else {
      return account.username;
    }
  }

  componentDidMount(){
    window.addEventListener('keydown', this.chooseTimeLIne.bind(this))
  }

  chooseTimeLIne(e){
    if(e.ctrlKey && e.altKey && e.code === 'KeyL'){
      alert("ローカルタイムラインの監視を開始します")
      this.streamStart('streaming/public/local')
    }
    if(e.ctrlKey && e.altKey && e.code === 'KeyU'){
      alert("ホームタイムラインの監視を開始します")
      this.streamStart('streaming/user')
    }
  }

  streamStart(streamURL){
    if(this.state.isStreaming){
      console.log('Stop streaming')
      this.state.listener.stop()
    }
    console.log('Start streaming')
    let listener = this.mstdn.stream(streamURL)
    this.setState({
      listener: listener,
      isStreaming: true
    })
    listener.on('message', (msg) => {
      console.log("get new info")
      console.log(msg)
      if (msg.event === "update"){
        if(this.rewrite(msg.data.content).length === 0){
          return
        }else{
          let newtoot = this.rewrite(msg.data.content)
          let account = this.getName(msg.data.account)
          let comments = this.state.comments
          const comment = (
            <div key={msg.data.id} style={{marginTop: String(this.getRandomInt(11) * 5)+`%`}} className="comment">
              <p id="content">
                <img src={msg.data.account.avatar} alt="icon" width="35px" height="35px" style={{borderRadius: `5px`}}></img>{newtoot}
              </p>
              <p id="user">{account}</p>
            </div>
          )
          comments.push(comment)
          this.setState({
            comments: comments
          })
        }
      }
    })
  }

  render() {
    return (
      <div>
        <div className='screen'>
          {
            this.state.comments.map((comment) => {
              return comment
            })
          }
        </div>
      </div>
    );
  }
}

export default withRouter(CommentPage);