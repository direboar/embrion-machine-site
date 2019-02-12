<template>
  <div>
    <v-dialog
      v-model="showDialog"
      max-width="700"
      :persistent="true"
    >
      <v-card>
        <v-layout
          row
          wrap
        >
          <v-flex xs12>
            <v-alert
              :value="validateerror!=null"
              type="error"
            >{{validateerror}}
            </v-alert>
          </v-flex>
          <v-flex xs12>
            <v-card-text>
              検索条件はどれか一つしか指定できません。<br />
              検索条件を指定した場合、機体はソートされません（どのような順番で表示されるかは不定です）
            </v-card-text>
          </v-flex>
          <v-flex xs12>
            <v-form v-model="valid">
              <v-text-field
                v-model="l_userName"
                label="ユーザー名（完全一致）"
              ></v-text-field>
              <v-text-field
                v-model="l_machineName"
                label="機体名（完全一致）"
              ></v-text-field>
              <v-checkbox
                label="自分が作成したデータを参照する"
                v-model="l_showOwner"
                :disabled="!showOwnerEnabled"
              ></v-checkbox>
            </v-form>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs3 />
          <v-flex xs3>
            <v-btn
              color="green darken-1"
              flat
              @click.native="select"
              :disabled="this.validateerror != null"
            >選択する</v-btn>
          </v-flex>
          <v-flex xs3>
            <v-btn
              color="green darken-1"
              flat
              @click.native="clear"
            >クリア</v-btn>
          </v-flex>
          <v-flex xs3>
            <v-btn
              color="green darken-1"
              flat
              @click.native="closeDialog"
            >閉じる</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
</style>

<script>
export default {
  name: "EquipmentFilterConditionDialog",
  props: {
    //ダイアログ表示フラグ。
    showDialog: {
      type: Boolean,
      default: true
    },
    userName: {
      type: String,
      default: ""
    },
    machineName: {
      type: String,
      default: ""
    },
    showOwner: {
      type: Boolean,
      default: false
    },
    showOwnerEnabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      l_userName: this.userName,
      l_machineName: this.machineName,
      l_showOwner: this.showOwner
    };
  },

  watch: {
    //親コンポーネントの値が変わったらコピーする。
    showOwner(val) {
      this.l_showOwner = val;
    }
  },

  computed: {
    validateerror() {
      let userNameEntered = this.l_userName !== "";
      let machineNameEntered = this.l_machineName !== "";
      if (
        (userNameEntered && machineNameEntered) ||
        (userNameEntered && this.l_showOwner) ||
        (machineNameEntered && this.l_showOwner)
      ) {
        return "絞込条件を複数選択することはできません";
      } else {
        return null;
      }
    }
  },

  methods: {
    closeDialog() {
      this.$emit("update:showDialog", false);
    },
    select() {
      this.$emit("update:userName", this.l_userName);
      this.$emit("update:machineName", this.l_machineName);
      this.$emit("update:showOwner", this.l_showOwner);
      this.$emit("select");
      this.$emit("update:showDialog", false);
    },
    clear() {
      this.l_userName = "";
      this.l_machineName = "";
      this.l_showOwner = false;
    }
  }
};
</script>
