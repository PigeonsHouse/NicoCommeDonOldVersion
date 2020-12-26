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
    };
    this.rewrite = this.rewrite.bind(this);
    this.getName = this.getName.bind(this);
    this.streamStart = this.streamStart.bind(this);
  }

  mstdnStream(){
    return this.mstdn.stream('streaming/public/local')
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  rewrite(txt){
    txt = txt.replace(/<\/p><p>/g, '　')
    txt = txt.replace(/<p>/g, '')
    txt = txt.replace(/<\/p>/g, '')
    txt = txt.replace(/<br \/>/g,'　')
    txt = txt.replace(/&apos;/g, '\'')
    txt = txt.replace(/&amp;/g, '&')
    txt = txt.replace(/&quot;/g, '"')
    txt = txt.replace(/&lt;/g, '<')
    txt = txt.replace(/&gt;/g, '>')
    const e = document.createElement('span')
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

  escapeHTML(htmlString) {
  }

  streamStart(){
    if(this.state.isStreaming){
      return
    }else{
      console.log('Start streaming')
      this.setState({
        isStreaming: true
      })
      this.mstdnStream().on('message', (msg) => {
        console.log("get new info")
        console.log(msg)
        if (msg.event === "update"){
          if(this.rewrite(msg.data.content).length === 0){
            return
          }else{
            console.log(this.rewrite(msg.data.content))
            let comments = this.state.comments
            let percentRnd = String(this.getRandomInt(8) * 5)
            console.log(percentRnd)
            const comment = (
              <div key={msg.data.id} style={{marginTop: percentRnd + `%`}} className="comment">
                <p>
                  <p id="content"><img src={msg.data.account.avatar} alt="icon" width="35px" height="35px" style={{borderRadius: `5px`}}></img>{this.rewrite(msg.data.content)}</p>
                  <p id="user">{this.getName(msg.data.account)}</p>
                </p>
              </div>
            )
            comments.push(comment)
            this.setState({
              comments: comments
            })
          }
        }
      })
      this.mstdnStream().on('error', (err) => {
        console.log(err)
      })
      this.mstdnStream().on('heartbeat', (msg) => {
        console.log(msg)
      })
    }
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
        <input type='button' value='LTLの監視開始' onClick={this.streamStart} />
      </div>
    );
  }
}

export default withRouter(CommentPage);