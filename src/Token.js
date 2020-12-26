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
      key: '',
      token: '',
    };
    this.hundleURLChange = this.hundleURLChange.bind(this);
    this.hundleKeyChange = this.hundleKeyChange.bind(this);
    this.hundleSubmitInstance = this.hundleSubmitInstance.bind(this);
    this.hundleSubmitKey = this.hundleSubmitKey.bind(this);
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
      window.open(url, "てすと");
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
      this.props.history.push({
        pathname: "/main",
        state: {
          token: this.state.token,
          url: this.state.instanceURL,
        }
      })
    })
  }

  hundleURLChange(e){
    this.setState({instanceURL: e.target.value});
  }

  hundleKeyChange(e){
    this.setState({key: e.target.value});
    if(e.target.value.length === 0){
      document.getElementById("jumpCommentPage").style.pointerEvents="none"
    }else{
      document.getElementById("jumpCommentPage").style.pointerEvents="auto"
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.hundleSubmitInstance}>
          <label>
            インスタンスURL : <input type="text" value={this.state.instanceURL} onChange={this.hundleURLChange} />
          </label>
          <input type="submit" value="認証コードを発行"/>
        </form>
        <form onSubmit={this.hundleSubmitKey}>
          <label>
            認証コード :　　　<input type="text" value={this.state.key} onChange={this.hundleKeyChange} placeholder="ここに貼る" />
          </label>
          <input type="submit" id="jumpCommentPage" style={{pointerEvents: `none`}} value="コメント画面に移動"/>
        </form>
      </div>
    );
  }
}

export default withRouter(Token);
