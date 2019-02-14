<template>
  <div>
    <v-layout row>
      <v-flex xs12>
        <v-card v-if="showList">
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
                @click.native="addMachine()"
              >
                <v-icon>add</v-icon>
              </v-btn>
              <span>機体を追加します。</span>
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
                  <span>機体を編集します。</span>
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
              :disabled="!hasNext"
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
        <machine-construct-panel
          :targetMachine.sync="dialogMachine"
          :editMode.sync="editMode"
          @save="saveMachine"
          @delete="deleteMachine"
          @cancel="cancel"
          v-if="!showList"
        />
        <!--FIXME machine-filter-conditin-dialogが正しいのでは？-->
        <equipment-filter-condition-dialog
          :show-dialog.sync="showFilterConditionDialog"
          :userName.sync="userName"
          :machineName.sync="machineName"
          :showOwner.sync="showOwner"
          :targetMachine.sync="dialogMachine"
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
import Machine from "@/model/embriomachine/machine";
import firebase from "firebase";

import FirebaseStorage from "@/model/embriomachine/FirebaseStorage";

export default {
  components: {
    MachineConstructPanel,
    EquipmentFilterConditionDialog,
    HelpDialog: HelpDialog,
    MessgeDialog: MessgeDialog
  },
  mounted() {
    //1.firebaseのデータを読み込む
    this.find = "load";
    //2.google adsenceのサイズ調整
    (window.adsbygoogle = window.adsbygoogle || []).push({});
    //3.認証状態のフックを設定
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      }
    });
  },
  data() {
    return {
      showList: true,
      editMode: false,
      dialogMachine: new Machine(""),
      editingMachineId: null,
      editingMachineDetailId: null,

      //検索条件
      showFilterConditionDialog: false,
      userName: "",
      machineName: "",
      showOwner: false,
      hasNext: false,

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
  watch: {
    find(val) {
      if (val === "seek") {
        this.storage.fetchNextPageFromFirebase(
          this.machines[this.machines.length - 1],
          this.userName,
          this.machineName,
          this.showOwner,
          this.user,
          (readed, hasNext) => {
            readed.forEach(item => {
              this.machines.push(item);
            });
            this.hasNext = hasNext;
            this.find = "";
          },
          errormsg => {
            this.showErrorMessageDialog(errormsg);
            this.find = "";
          }
        );
      } else if (val === "load") {
        this.storage.loadFromFirebase(
          this.userName,
          this.machineName,
          this.showOwner,
          this.user,
          (readed, hasNext) => {
            this.machines = [];
            readed.forEach(item => {
              this.machines.push(item);
            });
            this.hasNext = hasNext;
            this.find = "";
          },
          errormsg => {
            this.showErrorMessageDialog(errormsg);
            this.find = "";
          }
        );
      }
    }
  },
  computed: {},
  methods: {
    search() {
      this.showFilterConditionDialog = true;
    },
    //新しい機体を追加
    addMachine() {
      this.dialogMachine = new Machine("");
      this.editMode = true;
      this.showList = false;
    },
    editMachine(header) {
      this.storage.getMachineDetail(
        header,
        (machine, detailKey) => {
          this.dialogMachine = machine;
          this.editingMachineId = header.id;
          this.editingMachineDetailId = detailKey;
          this.editMode = true;
          this.showList = false;
        },
        errormsg => {
          this.showErrorMessageDialog(errormsg);
        }
      );
    },
    showMachine(header) {
      this.storage.getMachineDetail(
        header,
        (machine, detailKey) => {
          this.dialogMachine = machine;
          this.editingMachineId = machine.id;
          this.editMode = false;
          this.showList = false;
          this.editingMachineDetailId = detailKey;
        },
        errormsg => {
          this.showErrorMessageDialog(errormsg);
        }
      );
    },

    deleteMachine(machine) {
      this.storage.deleteFromFirebase(
        machine.id,
        this.editingMachineDetailId,
        () => {
          this.dialogMachine = new Machine("");
          this.showList = true;
          this.editingMachineId = null;
          this.find = "load";
        },
        errormsg => {
          this.showErrorMessageDialog(errormsg);
        }
      );
    },

    //callback.
    saveMachine(machine) {
      let callback = () => {
        this.dialogMachine = new Machine("");
        this.showList = true;
        this.editingMachineId = null;
        this.find = "load";
      };
      let errorCallback = errormsg => {
        this.showErrorMessageDialog(errormsg);
      };
      if (this.editingMachineId === null) {
        this.storage.saveToFirebase(machine, this.user, callback);
      } else {
        this.storage.updateToFirebase(
          this.editingMachineId,
          this.editingMachineDetailId,
          machine,
          callback,
          errorCallback
        );
      }
    },

    cancel() {
      this.dialogMachine = new Machine("");
      this.showList = true;
      this.editingMachineId = null;
    },
    searchConditionSelected() {
      this.find = "load";
    },

    isEditable(machine) {
      if (machine.userId === undefined || machine.userId === "anonymous") {
        return true;
      }
      if (this.user === null) {
        return false;
      } else {
        return this.user.uid === machine.userId;
      }
    },

    onScroll(event) {
      if (
        event.target.scrollTop + event.target.offsetHeight >=
        event.target.scrollHeight - 40
      ) {
        this.showNextPage();
      }
    },
    showNextPage() {
      this.find = "seek";
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
          this.find = "load";
        });
    }
  }
};
</script>