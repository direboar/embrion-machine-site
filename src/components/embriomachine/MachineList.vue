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
          </v-toolbar>
          <v-container
            style="max-height: 800px; max-width: 100%"
            class="scroll-y"
            id="scroll-target"
            v-on:scroll="onScroll"
          >
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
          </v-container>
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
        <equipment-filter-condition-dialog
          :show-dialog.sync="showFilterConditionDialog"
          :userName.sync="userName"
          :machineName.sync="machineName"
          :showOwner.sync="showOwner"
          :targetMachine.sync="dialogMachine"
          @select="searchConditionSelected"
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
import Machine from "@/model/embriomachine/machine";
import firebase from "firebase";

export default {
  components: {
    MachineConstructPanel,
    EquipmentFilterConditionDialog
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

      //検索条件
      showFilterConditionDialog: false,
      userName: "",
      machineName: "",
      showOwner: false,

      machines: [],
      find: "",
      user: null
    };
  },
  watch: {
    find(val) {
      if (val === "seek") {
        this.fetchNextPageFromFirebase(this.machines[this.machines.length - 1]);
      } else if (val === "load") {
        this.loadFromFirebase();
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
    editMachine(machine) {
      this.dialogMachine = machine;
      this.editingMachineId = machine.id;
      this.editMode = true;
      this.showList = false;
    },
    showMachine(machine) {
      this.dialogMachine = machine;
      this.editingMachineId = machine.id;
      this.editMode = false;
      this.showList = false;
    },
    deleteMachine(machine) {
      this.deleteFromFirebase(machine);
      this.dialogMachine = new Machine("");
      this.showList = true;
      this.editingMachineId = null;
    },
    //callback.
    saveMachine(machine) {
      if (this.editingMachineId === null) {
        this.saveToFirebase(machine);
      } else {
        this.updateToFirebase(this.editingMachineId, machine);
      }
      this.dialogMachine = new Machine("");
      this.showList = true;
      this.editingMachineId = null;
    },
    cancel() {
      this.dialogMachine = new Machine("");
      this.showList = true;
      this.editingMachineId = null;
    },
    searchConditionSelected() {
      this.find = "load";
      // this.load = true;
    },
    loadFromFirebase() {
      this.machines = [];

      var query = firebase.database().ref("embriomachine");

      if (this.userName !== "") {
        query = query.orderByChild("userName").equalTo(this.userName);
      } else if (this.machineName !== "") {
        query = query.orderByChild("name").equalTo(this.machineName);
      } else if (this.showOwner) {
        query = query.orderByChild("userId").equalTo(this.user.uid);
      } else {
        query = query.orderByChild("orderBy");
      }

      query = query.limitToFirst(12);

      query.once("value").then(snapshot => {
        snapshot.forEach(childSnapshot => {
          let key = childSnapshot.key;
          let childData = childSnapshot.val();
          this.machines.push(
            Machine.fromRealtimeDatabaseObject(key, childData)
          );
        });
        this.find = "";
      });
    },

    fetchNextPageFromFirebase(lastSearchedMachine) {
      var query = firebase.database().ref("embriomachine");
      if (this.userName !== "") {
        query = query
          .orderByChild("userName")
          .startAt(this.userName, lastSearchedMachine.id);
      } else if (this.machineName !== "") {
        query = query
          .orderByChild("name")
          .startAt(this.machineName, lastSearchedMachine.id);
      } else if (this.showOwner && this.user != null) {
        query = query
          .orderByChild("userId")
          .startAt(this.user.uid, lastSearchedMachine.id);
      } else {
        query = query
          .orderByChild("orderBy")
          .startAt(lastSearchedMachine.orderBy, lastSearchedMachine.id);
      }

      query = query.limitToFirst(13);

      query.once("value").then(snapshot => {
        snapshot.forEach(childSnapshot => {
          let key = childSnapshot.key;
          let childData = childSnapshot.val();
          //最終行のデータも取得されてしまうため、最終更新時間が同じデータは飛ばす。
          if (key === lastSearchedMachine.id) {
          } else {
            let machine = Machine.fromRealtimeDatabaseObject(key, childData);
            if (!this.filter(machine)) {
              this.machines.push(machine);
            }
          }
        });

        this.find = "";
      });
    },

    //ページングで、条件一致で検索した場合、equalTo(値、キー)で正しく実装できない。
    //そのため＜条件で取得し、プログラム側で名称が異なる場合は再取得しない処理を実装する。
    filter(machine) {
      if (this.userName !== "" && this.userName !== machine.userName) {
        return true;
      }
      if (this.machineName !== "" && this.name !== machine.name) {
        return true;
      }
      if (
        this.showOwner &&
        this.user != null &&
        this.user.uid !== machine.userId
      ) {
        return true;
      }
      return false;
    },

    saveToFirebase(machine) {
      let userId = this.user === null ? "anonimous" : this.user.uid;
      let userName = this.user === null ? "anonimous" : this.user.displayName;

      machine.setUserIdAndUserName(userId, userName);
      machine.setLastUpdateTime(firebase.database.ServerValue.TIMESTAMP);

      let updated = firebase
        .database()
        .ref("embriomachine")
        .push(machine.toRealtimeDatabaseObject());

      let updatedQuery = firebase.database().ref(updated);

      updatedQuery.once("value").then(snapshot => {
        let updated = snapshot.val();

        updatedQuery
          .update({ orderBy: Machine.getOrderBy(updated) })
          .then(() => {
            this.find = "load";
          });
      });

      //FIXME error
    },

    isEditable(machine) {
      if (machine.userId === undefined || machine.userId === "anonimous") {
        return true;
      }
      if (this.user === null) {
        return false;
      } else {
        return this.user.uid === machine.userId;
      }
    },

    updateToFirebase(id, machine) {
      machine.setLastUpdateTime(firebase.database.ServerValue.TIMESTAMP);
      firebase
        .database()
        .ref("embriomachine/" + id)
        .set(machine.toRealtimeDatabaseObject())
        .then(() => {
          this.find = "load";
        });
    },

    deleteFromFirebase(machine) {
      firebase
        .database()
        .ref("embriomachine/" + machine.id)
        .remove()
        .then(() => {
          this.find = "load";
        });
    },

    onScroll(event) {
      if (
        event.target.scrollTop + event.target.offsetHeight >=
        event.target.scrollHeight - 40
      ) {
        this.find = "seek";
      }
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
          this.find = "load";
        });
    }
  }
};
</script>