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
      comments: [],
      isStreaming: false,
      streaming: null
    };
    this.moveComment.play()
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
    txt = txt.replace('&quot;', '"')
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
    console.log('Start streaming')
    this.mstdn.stream('streaming/public/local').on('message', (msg) => {
      if (msg.event === "update"){
        console.log(msg.data.content)
        this.setState({
          account: this.getName(msg.data.account),
          content: this.rewrite(msg.data.content),
        })
        let { comments } = this.state
        const comment = (
          <div className="comment">
            <p id="content">{ this.getName(msg.data.content)}</p>
            <p id="user">{ this.rewrite(msg.data.account )}</p>
          </div>
        )
        comments.push(comment)
        this.setState({comments})
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
        <input type='button' value='LTLの監視開始' onClick={this.streamStart()} />
      </div>
    );
  }
}

export default withRouter(CommentPage);