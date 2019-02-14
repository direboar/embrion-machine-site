<template>
  <v-dialog v-model="showDialog">
    <v-card>
      <v-card-title>
        <H2>エムブリオマシン 機体作成アプリケーションの利用方法</H2>
      </v-card-title>
      <v-card-text>
        <p>エムブリオマシンのコンストラクションルールに従い、オリジナルの機体作成を行えるアプリケーションです。PCやタブレット、スマートフォンで使用することができます。</p>
        <h3>利用方法</h3>
        <v-divider />
        <h4>1．機体作成</h4>
        <ul>
          <li>画面右上にある「＋」ボタンを押して、機体編集画面を表示してください。</li>
          <li>装甲／サイズおよび、各部位の装備を選択し、保存ボタン（フロッピードライブ画像）を押してください。</li>
        </ul>
        <v-divider />
        <h4>２．機体の参照</h4>
        <ul>
          <li>デフォルトでは、登録日順毎に機体が表示されます。</li>
          <li>画面右上にある虫眼鏡のボタンを押すことで、検索条件を指定できます。</li>
          <li>一覧上の虫眼鏡のボタンを押すことで、機体データを参照できます。</li>
        </ul>
        <v-divider />
        <h4>３．機体の編集・削除</h4>
        <ul>
          <li>機体の一覧画面上で、編集ボタンを押すと期待を編集できます。また編集画面上で、機体の削除ができます。</li>
        </ul>
        <v-divider />
        <h4>４．ログインについて</h4>
        <ul>
          <li>twitterアカウントでログインすることができます。</li>
          <li>その場合、作成した機体を他の人に更新・削除されることはありません。また、検索条件を指定することで、自分が作成した機体だけを見ることができます。</li>
          <li>ログインしないでも使えますが、誰でもそのデータをいじれます。その場合、作成者はanonymousと表示されます</li>
        </ul>
        <v-divider />
        <h4>５．その他</h4>
        <ul>
          <li>ブラウザのリロード押すと、保存してない場合はデータ消えちゃうので気をつけで。あとは雰囲気で使えると思います。</li>
        </ul>
        <v-divider />
        <h3>お問い合わせ先</h3>
        使っていて気がついた点、追加機能のご要望などがあれば<a href="https://twitter.com/minokuba_pub">＠minokuba_pub</a>までご連絡ください。
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          flat
          @click.native="closeDialog"
        >閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
</style>

<script>
export default {
  name: "SpellHelpDialog",
  props: {
    //ダイアログ表示フラグ。
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit("update:showDialog", false);
    }
  }
};
</script>
