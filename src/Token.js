import React, {Component} from 'react';
import Mastodon from 'mastodon-api';
import './App.css';
import { withRouter } from 'react-router-dom';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

class Token extends Component {
  constructor(props){
    super(props);
    this.state = {
      instanceURL: 'https://mastodon.compositecomputer.club',
      client_id: '',
      client_secret: '',
      key: '',
      token: '',
      isHealth: true,
    };
    this.hundleURLChange = this.hundleURLChange.bind(this);
    this.hundleKeyChange = this.hundleKeyChange.bind(this);
    this.hundleSubmitInstance = this.hundleSubmitInstance.bind(this);
    this.hundleSubmitKey = this.hundleSubmitKey.bind(this);
    this.mstdn = null;
  }

  hundleSubmitInstance(e){
    e.preventDefault()
    let instanceURL = this.state.instanceURL;
    if(instanceURL.substr(-1) === '/'){
      instanceURL = instanceURL.substr(0, instanceURL.length-1)
      this.setState({instanceURL: instanceURL})
    }
    Mastodon.createOAuthApp(instanceURL + '/api/v1/apps', 'NicoCommeDon')
    .catch(err => console.error(err))
    .then((res) => {
      try{
        this.setState({client_id: res.client_id})
        this.setState({client_secret: res.client_secret})
      }catch(err){
        alert("URLが間違っている可能性があります。");
        return null;
      }
      return Mastodon.getAuthorizationUrl(this.state.client_id, this.state.client_secret, instanceURL);
    })
    .then(url => {
      if(url === null)
        return;
      let request = require('request');
      let info = {
        url: instanceURL + '/api/v1/streaming/health'
      }
      let callback = (error, response, body) => {
        if (!error && response.statusCode === 200){
          if(body === 'OK')
            this.setState({isHealth: true});
            return;
        }
        this.setState({isHealth: false});
      }
      request(info, callback);
      window.open(url, "てすと");
    })
  }

  hundleSubmitKey(e){
    e.preventDefault()
    Mastodon.getAccessToken(this.state.client_id, this.state.client_secret, this.state.key, this.state.instanceURL)
    .catch(err => console.error(err))
    .then(accessToken => {
      if(!this.state.isHealth){
        alert("インスタンスがNicoCommeDonに対応していない可能性があります。");
        return;
      }
      try {
        this.setState({
          token: accessToken, 
        })
        this.mstdn = new Mastodon({
          access_token: this.state.token,
          api_url: this.state.instanceURL + '/api/v1/',
        })
        this.props.history.push({
          pathname: "/main",
          state: {
            token: this.state.token,
            url: this.state.instanceURL,
          }
        })
      } catch (err) {
        alert("認証コードが間違っている可能性があります。");
        return;
      }
    })
  }

  hundleURLChange(e){
    this.setState({instanceURL: e.target.value});
  }

  hundleKeyChange(e){
    this.setState({key: e.target.value});
  }

  render() {
    return (
      <div id="tokenPage" className="bg-light px-lg-5 vh-100">
        <h1 className="font-weight-bold pt-4 text-dark text-center">
          NicoCommeDon
        </h1>
        <p className="text-center">
          Mastodonに流れるタイムラインのトゥートをニコニコ動画のコメントみたいに流すアプリです。<br />
          グリーンバック上に流れるのでOBSなどでクロマキー抜きしてコメントを配信画面に乗っけてみてね。
          </p>
        <form onSubmit={this.hundleSubmitInstance} className="px-2 px-lg-5">
          <InputGroup className="px-md-5 pt-4 w-100 cannotDrag">
            <InputGroup.Text className="basic-addon3 w-auto d-inline">
              インスタンスURL
            </InputGroup.Text>
            <FormControl
              placeholder="Prease input InstanceURL"
              aria-label="Prease input InstanceURL"
              aria-describedby="basic-addon3"
              value={this.state.instanceURL}
              onChange={this.hundleURLChange}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary" type="submit">認証コードを発行</Button>
            </InputGroup.Append>
          </InputGroup>
        </form>
        <form onSubmit={this.hundleSubmitKey} className="px-2 px-lg-5">
          <InputGroup className="px-md-5 pt-4 w-100 cannotDrag">
            <InputGroup.Text className="basic-addon3 w-auto d-inline">
              認証コード
            </InputGroup.Text>
            <FormControl
              placeholder="ここに貼る"
              aria-label="Paste Authentication-Code"
              aria-describedby="basic-addon3"
              value={this.state.key}
              onChange={this.hundleKeyChange}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary" type="submit" id="jumpCommentPage">コメント画面に移動</Button>
            </InputGroup.Append>
          </InputGroup>
        </form>
      </div>
    );
  }
}

export default withRouter(Token);
