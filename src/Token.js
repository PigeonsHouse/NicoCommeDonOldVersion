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
