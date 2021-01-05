# NicoCommeDon v0.5.0

## NicoCommeDonとは？
グリーンバック上にMastodonのトゥートがニコニコのコメントみたいに流れていくElectronアプリ()です．<br>
Mastodonに流れるトゥートをLTやゲーム中に配信画面上にニコ生のコメント風に載せられたらいいなという個人的願いを叶えるために作りました．<br>
もし修正点が見つかった場合は何とかして私に連絡いただけると幸いです．<br>
超低クオプレリリースなのであまり期待しないで…()

## 起動方法
1. このリポジトリ内で`npm start`でlocalhost:3000にアプリを建てる．
2. `electron .`でElectronアプリとして起動する．

## コメント画面の開き方
1. インスタンスのURL(MastodonのURL)を入力して認証コードを発行する．
2. 発行した認証コードを貼り付けてコメント画面に移る．(認証コードが一致しない場合のエラーを取り除けてないのでElectronアプリを再起動してもう一度やり直してください．)(インスタンスによってはストリーミングを許可していない場合もありますのでご了承ください．)
3. 右下のヒントを参考にコメントを取得する．(起動してすぐの一つ目のトゥートが取得できないバグを観測していますのでご容赦ください．)

## 使用例
OBS StudioのウインドウキャプチャでNicoCommeDonを選択し，クロマキーフィルタをかけて配信映像の上に載っけるとニコニコのコメントっぽくトゥートが流れていきます．アイコンが透ける場合はクロマキーの度合いを調整するのをおすすめします．
