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
    this.helptext = (
      <div key="123" className="helptext">
        <small>Ctrl+Alt+P: 公開タイムラインの監視</small><br />
        <small>Ctrl+Alt+U: ホームタイムラインの監視</small><br />
        <small>Ctrl+Alt+L: ローカルタイムラインの監視</small><br />
        <small>Ctrl+Alt+H: ヒントの表示/非表示</small><br />
      </div>
    )
    this.state = {
      comments: [],
      isStreaming: false,
      listener: null,
      isdisplayhint: true,
      hintpocket: [this.helptext],
      timelinename: [(
        <small key="456" className="timelinename">Timeline: none</small>
      )],
      tlname: "none",
    };
    this.rewrite = this.rewrite.bind(this);
    this.getName = this.getName.bind(this);
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  rewrite(txt){
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
      this.setState({
        tlname: "local"
      })
      if(this.state.isdisplayhint){
        this.setState({
          timelinename: [(
            <small key="456" className="timelinename">Timeline: local</small>
          )]
        })
      }
    }
    if(e.ctrlKey && e.altKey && e.code === 'KeyP'){
      alert("パブリックタイムラインの監視を開始します")
      this.streamStart('streaming/public')
      this.setState({
        tlname: "public"
      })
      if(this.state.isdisplayhint){
        this.setState({
          timelinename: [(
            <small key="456" className="timelinename">Timeline: public</small>
          )]
        })
      }
    }
    if(e.ctrlKey && e.altKey && e.code === 'KeyU'){
      alert("ホームタイムラインの監視を開始します")
      this.streamStart('streaming/user')
      this.setState({
        tlname: "user"
      })
      if(this.state.isdisplayhint){
        this.setState({
          timelinename: [(
            <small key="456" className="timelinename">Timeline: user</small>
          )]
        })
      }
    }
    if(e.ctrlKey && e.altKey && e.code === 'KeyH'){
      if(this.state.isdisplayhint){
        this.setState({
          isdisplayhint: false,
          hintpocket: [],
          timelinename: [],
        })
      }else{
        this.setState({
          isdisplayhint: true,
          hintpocket: [this.helptext]
        })
        if(this.state.tlname === "local"){
          this.setState({
            timelinename: [(
              <small key="456" className="timelinename">Timeline: local</small>
            )],
          })
        }else if(this.state.tlname === "public"){
          this.setState({
            timelinename: [(
              <small key="456" className="timelinename">Timeline: public</small>
            )],
          })
        }else if(this.state.tlname === "user"){
          this.setState({
            timelinename: [(
              <small key="456" className="timelinename">Timeline: user</small>
            )],
          })
        }else if(this.state.tlname === "none"){
          this.setState({
            timelinename: [(
              <small key="456" className="timelinename">Timeline: none</small>
            )],
          })
        }else{
          this.setState({
            timelinename: [(
              <small key="456" className="timelinename">Timeline: error</small>
            )],
          })
        }
      }
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
      <div className='screen'>
        {
          this.state.comments.map((comment) => {
            return comment
          })
        }{
          this.state.timelinename.map((timelinename) => {
            return timelinename
          })
        }{
          this.state.hintpocket.map((comment) => {
            return comment
          })
        }
      </div>
    );
  }
}

export default withRouter(CommentPage);