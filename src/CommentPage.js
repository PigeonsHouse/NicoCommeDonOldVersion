import Mastodon from 'mastodon-api';
import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import anime from 'animejs';
import './Comment.css';

class CommentPage extends Component {
  constructor(props){
    super(props);
    this.mstdn = new Mastodon({
      access_token: this.props.location.state.token,
      api_url: this.props.location.state.url + '/api/v1/',
    })
    this.moveComment = anime({
      targets: ['.comment'],
      translateX: '100vw',
      autoplay: true
    });
    this.state = {
      account: 'アルティメッ鳩',
      content: 'アニメーション微塵も思いつかなくて草',
    };
    this.rewrite = this.rewrite.bind(this);
    this.getName = this.getName.bind(this);
    this.streamStart = this.streamStart.bind(this);
  }

  rewrite(txt){
    txt = txt.replace('</p><p>', '　')
    txt = txt.replace('<p>', '')
    txt = txt.replace('</p>', '')
    txt = txt.replace('<br />','　')
    txt = txt.replace('&apos;', '\'')
    txt = txt.replace('&amp;', '&')
    txt = txt.replace('&quot;', '\"')
    return txt
  }

  getName(account){
    if(account.display_name.length){
      return account.display_name;
    } else {
      return account.username;
    }
  }

  streamStart(){
    this.mstdn.stream('streaming/public/local').on('message', (msg) => {
      if (msg.event === "update"){
        this.setState({
          account: this.getName(msg.data.account),
          content: this.rewrite(msg.data.content),
        })
        this.moveComment.play();
        console.log(this.moveComment);
      }
    })
  }

  render() {
    return (
      <div>
        <div class='screen'>
          <div class="comment">
            <p id="content">{this.state.content}</p>
            <p id="user">{this.state.account}</p>
          </div>
        </div>
        <input type='button' value='LTLの監視開始' onClick={this.streamStart()} />
      </div>
    );
  }
}

export default withRouter(CommentPage);