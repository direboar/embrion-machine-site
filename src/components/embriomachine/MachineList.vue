<template>
  <div>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-toolbar>
            <v-tooltip top>
              <v-btn
                v-if="user ==null"
                slot="activator"
                dark
                @click.native="login()"
              >
                login<v-icon
                  right
                  dark
                >fab fa-twitter-square</v-icon>
              </v-btn>
              <span>ログインします。</span>
            </v-tooltip>
            <v-tooltip>
              <v-btn
                v-if="user !=null"
                slot="activator"
                dark
                @click.native="logout()"
              >
                logout<v-icon
                  right
                  dark
                >fab fas fa-sign-out-alt</v-icon>
              </v-btn>
              <span>ログアウトします。</span>
            </v-tooltip>
            <img
              v-if="user != null"
              :src="user.photoURL"
            />
            <v-spacer></v-spacer>
            <v-tooltip>
              <v-btn
                slot="activator"
                icon
                @click.native="search()"
              >
                <v-icon>search</v-icon>
              </v-btn>
              <span>機体の絞り込み条件を入力します</span>
            </v-tooltip>
            <v-tooltip>
              <v-btn
                slot="activator"
                icon
                :disabled="!loggedIn"
                @click.native="addMachine()"
              >
                <v-icon>add</v-icon>
              </v-btn>
              <span>機体を追加します(twitter認証が必須です)。</span>
            </v-tooltip>
            <v-tooltip>
              <v-btn
                slot="activator"
                icon
                @click.native="showHelpDialog = true"
              >
                <v-icon>help</v-icon>
              </v-btn>
              <span>ヘルプを表示します。</span>
            </v-tooltip>
          </v-toolbar>
          <v-list
            two-line
            subheader
          >
            <v-list-tile
              avatar
              v-for="(item,index) in machines"
              :key="index"
            >
              <v-list-tile-avatar>
                <v-icon class="grey lighten-1 white--text">folder</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                <v-list-tile-sub-title>作成者：{{item.userName}}</v-list-tile-sub-title>
                <v-list-tile-sub-title>最終更新日時: {{ item.lastUpdateTime }} </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-tooltip top>
                  <v-btn
                    slot="activator"
                    icon
                    ripple
                    @click="editMachine(item)"
                    :disabled="!isEditable(item)"
                  >
                    <v-icon color="green lighten-1">edit</v-icon>
                  </v-btn>
                  <span>機体を編集します(twitter認証が必須です)。</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn
                    slot="activator"
                    icon
                    ripple
                    @click="showMachine(item)"
                  >
                    <v-icon color="green lighten-1">zoom_in</v-icon>
                  </v-btn>
                  <span>機体を参照します。</span>
                </v-tooltip>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider inset></v-divider>
          </v-list>
          <v-card-actions class="justify-center">
            <v-btn
              class="text-xs-center"
              flat
              icon
              color="green lighten-1"
              @click="showNextPage()"
              :disabled="!hasNextPage"
            >
              <v-icon>fas fa-angle-double-down</v-icon>
              　もっと見る
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card>
          <ins
            class="adsbygoogle"
            style="display:block"
            data-ad-client="ca-pub-9097509632200457"
            data-ad-slot="5985300299"
            data-ad-format="auto"
          ></ins>
        </v-card>
        <!--FIXME machine-filter-conditin-dialogが正しいのでは？-->
        <equipment-filter-condition-dialog
          :show-dialog.sync="showFilterConditionDialog"
          :userName.sync="filterCondition.userName"
          :machineName.sync="filterCondition.machineName"
          :showOwner.sync="filterCondition.showOwner"
          :showOwnerEnabled.sync="this.user !== null"
          @select="searchConditionSelected"
        />
        <help-dialog :showDialog.sync="showHelpDialog" />
        <messge-dialog
          :showDialog.sync="showErrorMessage"
          :message="errorMessage"
        />
      </v-flex>
    </v-layout>

  </div>
</template>

<style>
</style>

<script>
import EquipmentFilterConditionDialog from "@/components/embriomachine/EquipmentFilterConditionDialog";
import MachineConstructPanel from "@/components/embriomachine/MachineConstructPanel";
import HelpDialog from "@/components/embriomachine/HelpDialog";
import MessgeDialog from "@/components/common/MessgeDialog";
import firebase from "firebase";

import FirebaseStorage from "@/model/embriomachine/FirebaseStorage";

export default {
  components: {
    MachineConstructPanel,
    EquipmentFilterConditionDialog,
    HelpDialog: HelpDialog,
    MessgeDialog: MessgeDialog
  },
  created() {
    //1.検索条件をセッションストレージから復元。（一覧画面に戻ってきた際のため。将来的にはvuex+session storageの連携に変えたい）
    //what is sessionStorage? https://developer.mozilla.org/ja/docs/Web/API/Window/sessionStorage
    let filterConditionOfThisSession = sessionStorage.getItem(
      "embriomachine.filterCondition"
    );
    if (filterConditionOfThisSession != null) {
      this.filterCondition = JSON.parse(filterConditionOfThisSession);
    }
  },
  mounted() {
    let user = firebase.auth().currentUser;
    //1/認証していない場合はこの時点で、firebaseのデータを読み込む
    if (user === null) {
      this.load();
    }
    //2.認証状態のフックを設定。状態が変わったら再度読み込む。
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        this.load();
      }
    });
    //3.google adsenceのサイズ調整
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  },
  data() {
    return {
      //検索条件
      showFilterConditionDialog: false,
      filterCondition: {
        userName: "",
        machineName: "",
        showOwner: false
      },
      hasNextPage: false,

      machines: [],
      find: "",
      user: null,

      storage: new FirebaseStorage(),

      //help
      showHelpDialog: false,

      //error
      showErrorMessage: false,
      errorMessage: ""
    };
  },
  watch: {},
  computed: {
    loggedIn() {
      return this.user;
    }
  },
  methods: {
    search() {
      this.showFilterConditionDialog = true;
    },
    //新しい機体を追加
    addMachine() {
      this.$router.push({ name: "createMachine" });
    },
    editMachine(header) {
      this.$router.push({ name: "editMachine", params: { id: header.id } });
    },
    showMachine(header) {
      this.$router.push({ name: "showMachine", params: { id: header.id } });
    },

    searchConditionSelected() {
      //1.検索条件をセッションストレージに保存（一覧画面に戻ってきた際のため。将来的にはvuex+session storageの連携に変えたい）
      sessionStorage.setItem(
        "embriomachine.filterCondition",
        JSON.stringify(this.filterCondition)
      );
      //2.再検索する
      this.load();
    },

    isEditable(machine) {
      if (!this.loggedIn) {
        return false;
      }
      if (machine.userId === undefined || machine.userId === "anonymous") {
        return true;
      }
      if (this.user === null) {
        return false;
      } else {
        return this.user.uid === machine.userId;
      }
    },

    showNextPage() {
      this.fetch();
    },

    showErrorMessageDialog(errorMessage) {
      this.errorMessage = errorMessage;
      this.showErrorMessage = true;
    },

    login() {
      var provider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().languageCode = "jp";
      firebase.auth().signInWithRedirect(provider);
    },

    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.user = null;

          //絞込条件を初期化する
          this.userName = "";
          this.machineName = "";
          this.showOwner = false;

          //再検索
          //this.find = "load";
          this.load();
        });
    },

    async fetch() {
      try {
        let retVal = await this.storage.fetchNextPageFromFirebase(
          this.machines[this.machines.length - 1],
          this.filterCondition.userName,
          this.filterCondition.machineName,
          this.filterCondition.showOwner,
          this.user
        );
        retVal.machines.forEach(item => {
          this.machines.push(item);
        });
        this.hasNextPage = retVal.hasNextPage;
        this.find = "";
      } catch (e) {
        alert(e);
        this.showErrorMessageDialog(
          "通信エラーが発生しました。" + JSON.stringify(e)
        );
      }
    },

    async load() {
      try {
        let retVal = await this.storage.loadFromFirebase(
          this.filterCondition.userName,
          this.filterCondition.machineName,
          this.filterCondition.showOwner,
          this.user
        );
        this.machines = [];
        retVal.machines.forEach(item => {
          this.machines.push(item);
        });
        this.hasNextPage = retVal.hasNextPage;
        this.find = "";
      } catch (e) {
        this.showErrorMessageDialog(
          "通信エラーが発生しました。" + JSON.stringify(e)
        );
      }
    }
  }
};
</script>