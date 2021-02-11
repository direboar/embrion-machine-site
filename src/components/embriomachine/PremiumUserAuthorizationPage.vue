<template>
  <div>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-layout row wrap>
            <v-flex xs12>
              <v-alert :value="validateerror != null" type="error"
                >{{ validateerror }}
              </v-alert>
            </v-flex>
            <v-flex xs12>
              <v-card-text v-if="!this.premiumUser.isPremiumUser()">
                以下のの機能を利用するためには、プレミアムコードの入力が必要です。
                <ul>
                  <li>PDF印刷機能</li>
                  <li>拡張セットの武装</li>
                </ul>
                プレミアムコードを入力してください。<br />
                プレミアムコードを所有していない方は、<a
                  href="https://minokuba.fanbox.cc/"
                  >Pixiv Fanbox</a
                >で支援プランの申し込みを行ってください。<br />
                <br />
              </v-card-text>
              <v-card-text v-if="this.premiumUser.isPremiumUser()">
                プレミアムコードの入力が完了しました。追加機能を利用できます。
                <br />
              </v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-form>
                <v-text-field
                  v-model="premiumCode"
                  label="プレミアムコード"
                ></v-text-field>
              </v-form>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs6 />
            <v-flex xs3>
              <v-btn
                color="green darken-1"
                flat
                @click.native="enter"
                :disabled="this.premiumUser.isPremiumUser()"
                >入力する</v-btn
              >
            </v-flex>
            <v-flex xs3>
              <v-btn color="green darken-1" flat @click.native="clear"
                >クリア</v-btn
              >
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<style></style>

<script>
import MessgeDialog from "@/components/common/MessgeDialog";
import PremiumUser from "@/model/embriomachine/premiumUser";

export default {
  name: "PremiumUserAuthorizationPage",
  components: {
    MessgeDialog: MessgeDialog
  },
  data() {
    return {
      premiumCode: null,
      validateerror: null,
      premiumUser: new PremiumUser()
    };
  },
  watch: {},
  computed: {},
  methods: {
    search() {
      this.showFilterConditionDialog = true;
    },
    enter() {
      if (this.premiumUser.checkPremiumUser(this.premiumCode)) {
        this.premiumUser.setPremiumUser();
        this.validateerror = null;
      } else {
        this.validateerror = "プレミアムコードの入力が誤っています。";
      }
    },
    clear() {
      this.premiumCode = null;
    }
  }
};
</script>
