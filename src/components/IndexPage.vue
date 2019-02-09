<template>
  <v-container
    fluid
    grid-list-md
  >
    <v-layout
      row
      wrap
    >
      <v-flex xs12>
        <v-card hover>
          <v-card-text>
            当サイトは、エムブリオマシンボードゲームの支援ツールを提供します。
            <p />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card
          to="embrioMachine/MachineList"
          height="300px"
        >
          <v-card-title>
            <H3>機体作成（コンストラクション）機能</H3>
          </v-card-title>
          <v-card-media
            v-bind:src="require('@/assets/construction.png')"
            contain
            height="200px"
          />
          <v-card-text>機体の作成機能を提供します。作成した機体はデータベースに登録されるため参照可能です。</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <H3>当サイトに掲載されている広告について</H3>
          </v-card-title>
          <v-card-text>
            当サイトは第三者配信の広告サービス「
            <a href="http://www.google.com/adsense/start/">Google Adsense グーグルアドセンス」</a>を利用しています。
            <p /> 広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookie（クッキー）を使用することがあります。 Cookie（クッキー）を無効にする設定およびGoogleアドセンスに関する詳細は「
            <a href="http://www.google.co.jp/policies/technologies/ads/">広告 – ポリシーと規約 – Google</a>」をご覧ください。
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <ins
            class="adsbygoogle"
            style="display:block"
            data-ad-client="ca-pub-9097509632200457"
            data-ad-slot="5985300299"
            data-ad-format="auto"
          ></ins>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style>
</style>

<script>
export default {
  mounted() {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }
};
</script>
