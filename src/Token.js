import React, {Component} from 'react';
import Mastodon from 'mastodon-api';
import './App.css';
import { withRouter } from 'react-router-dom';

class Token extends Component {
  constructor(props){
    super(props);
    this.state = {
      instanceURL: 'https://mastodon.compositecomputer.club',
      client_id: '',
      client_secret: '',
      authURL: '',
      key: '',
      token: '',
    };
    this.hundleURLChange = this.hundleURLChange.bind(this);
    this.hundleKeyChange = this.hundleKeyChange.bind(this);
    this.hundleSubmitInstance = this.hundleSubmitInstance.bind(this);
    this.hundleSubmitKey = this.hundleSubmitKey.bind(this);
    this.keyGetJump = this.keyGetJump.bind(this);
    this.jumpCommentPage = this.jumpCommentPage.bind(this);
  }

  hundleSubmitInstance(e){
    e.preventDefault()
    Mastodon.createOAuthApp(this.state.instanceURL + '/api/v1/apps', 'NicoCommeDon')
    .catch(err => console.error(err))
    .then((res) => {
      this.setState({client_id: res.client_id})
      this.setState({client_secret: res.client_secret})
      return Mastodon.getAuthorizationUrl(this.state.client_id, this.state.client_secret, this.state.instanceURL)
    })
    .then(url => {
      this.setState({authURL: url})
    })
  }

  hundleSubmitKey(e){
    e.preventDefault()
    Mastodon.getAccessToken(this.state.client_id, this.state.client_secret, this.state.key, this.state.instanceURL)
    .catch(err => console.error(err))
    .then(accessToken => {
      this.setState({
        token: accessToken, 
      })
      document.getElementById("jumpCommentPage").style.visibility="visible";
    })
  }

  keyGetJump(){
    window.open(this.state.authURL, "てすと");
  }

  hundleURLChange(e){
    this.setState({instanceURL: e.target.value});
  }

  hundleKeyChange(e){
    this.setState({key: e.target.value});
  }

  jumpCommentPage(){
    this.props.history.push({
      pathname: "/main",
      state: {
        token: this.state.token,
        url: this.state.instanceURL,
      }
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.hundleSubmitInstance}>
          <label>
            インスタンスURL : 　　<input type="text" value={this.state.instanceURL} onChange={this.hundleURLChange} />
          </label>
          <input type="submit" value="認可URLを発行"/>
        </form>
        <label>
          ここで認可キーをGET : <input type="text" value={this.state.authURL} placeholder="未発行" />
          <input type='button' value='GETしに行く' onClick={this.keyGetJump} />
        </label>
        <form onSubmit={this.hundleSubmitKey}>
          <label>
            認可キー : 　　　　　　<input type="text" value={this.state.key} onChange={this.hundleKeyChange} placeholder="ここに貼る" />
          </label>
          <input type="submit" value="アクセストークンの発行"/>
        </form>
        <div>
          アクセストークン : 　<input type="text" value={this.state.token} placeholder="未発行" />
        </div>
        <input type='button' id="jumpCommentPage" value='コメント画面に飛ぶ' style={{visibility: `hidden`}} onClick={this.jumpCommentPage} />
      </div>
    );
  }
}

export default withRouter(Token);
