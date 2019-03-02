<template>
  <div>
    <v-card>
      <v-layout
        row
        wrap
      >
        <v-flex xs12>
          <v-layout
            row
            wrap
          >
            <v-flex xs12>
              <v-alert
                :value="validateerror.length>0"
                type="error"
              >
                <p v-html="formatErrorMessage(validateerror)"></p>
              </v-alert>
            </v-flex>
            <v-flex
              xl3
              md4
              sm6
              xs12
            >
              <v-card>
                <v-toolbar
                  color="grey darken-1"
                  dark
                  dense
                >
                  <v-toolbar-title>基本データ</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar
                    floating
                    dense
                  >
                    <v-tooltip>
                      <v-btn
                        slot="activator"
                        icon
                        @click.native="saveMachine"
                        :disabled="!editMode"
                      >
                        <v-icon>save</v-icon>
                      </v-btn>
                      <span>機体をセーブします。</span>
                    </v-tooltip>
                    <v-tooltip>
                      <v-btn
                        slot="activator"
                        icon
                        @click.native="printPdf"
                        :disabled="!canPrint"
                      >
                        <v-icon>fas fa-file-pdf</v-icon>
                      </v-btn>
                      <span>PDF出力します</span>
                    </v-tooltip>
                    <v-tooltip>
                      <v-btn
                        slot="activator"
                        icon
                        @click.native="copyMachine"
                        :disabled="editMode"
                      >
                        <v-icon>fas fa-copy</v-icon>
                      </v-btn>
                      <span>機体をコピーして作成画面に移動します（保存しないとコピーは失われます）。</span>
                    </v-tooltip>
                    <v-tooltip>
                      <v-btn
                        slot="activator"
                        icon
                        @click.native="confirmDelete"
                        :disabled="!editMode"
                      >
                        <v-icon>delete</v-icon>
                      </v-btn>
                      <span>機体を削除します。</span>
                    </v-tooltip>
                    <v-tooltip>
                      <v-btn
                        slot="activator"
                        icon
                        @click.native="back"
                      >
                        <v-icon>fas fa-backward</v-icon>
                      </v-btn>
                      <span>一覧画面に戻ります。</span>
                    </v-tooltip>
                  </v-toolbar>
                </v-toolbar>
                <v-layout
                  row
                  wrap
                >
                  <v-flex xs4>
                    <v-list
                      two-line
                      subheader
                    >
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content>名前</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content>装甲/サイズ</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content>移動力</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content>回避値</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content>装甲値</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content>耐久値</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content>イニシアチブ</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>突撃／被突撃ダメージ</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>Aランク武装の数</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>機体へのリンク</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                    </v-list>
                  </v-flex>
                  <v-flex xs8>
                    <v-list
                      two-line
                      subheader
                    >
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-text-field
                            type="text"
                            v-model="machine.name"
                            required
                            :readonly="!editMode"
                            maxlength="20"
                          />
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{machine.machineType.name}}</v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="showMachineTypeDialog"
                            :disabled="!editMode"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{machine.machineType.movility}}</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{machine.machineType.evadeRate}}</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{machine.machineType.armorPoint}}</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{machine.machineType.constitution}}</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{machine.machineType.initiative}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{machine.machineType.chargeDamage}}／{{machine.machineType.coveredChargeDamage}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{machine.getEquipmentCountByRank("A")}}</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content>
                          <a :href="linkurl">{{linkurl}}</a>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                    </v-list>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex
              xl9
              md8
              sm6
              xs12
            >
              <v-card>
                <v-layout
                  row
                  wrap
                >
                  <v-flex
                    md6
                    xs12
                  >
                    <v-toolbar
                      color="grey darken-1"
                      dark
                      dense
                    >
                      <v-toolbar-title>頭／SLOT:{{machine.machineType.getSlot(POSITION_CONST.POSITION_HEAD)}}</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click.native="showEquipmentSelectDialog(POSITION_CONST.POSITION_HEAD)"
                        :disabled="!editMode"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-list
                      two-line
                      subheader
                    >
                      <v-list-tile
                        v-for="(equipment, index)  in this.machine.equipments[POSITION_CONST.POSITION_HEAD]"
                        :key="index"
                      >
                        <v-list-tile-content></v-list-tile-content>
                        <v-list-tile-content class="subheaders">{{equipment.name}}</v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="showEquipmentViewDialog(POSITION_CONST.POSITION_HEAD,equipment)"
                          >
                            <v-icon>zoom_in</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="deleteEquipment(POSITION_CONST.POSITION_HEAD,equipment)"
                            :disabled="!editMode"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                  <v-flex
                    md6
                    xs12
                  >
                    <v-toolbar
                      color="grey darken-1"
                      dark
                      dense
                    >
                      <v-toolbar-title>胴／SLOT:{{machine.machineType.getSlot(POSITION_CONST.POSITION_BODY)}}</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click.native="showEquipmentSelectDialog(POSITION_CONST.POSITION_BODY)"
                        :disabled="!editMode"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-list
                      two-line
                      subheader
                    >
                      <v-list-tile
                        v-for="(equipment, index)  in this.machine.equipments[POSITION_CONST.POSITION_BODY]"
                        :key="index"
                      >
                        <v-list-tile-content></v-list-tile-content>
                        <v-list-tile-content class="subheaders">{{equipment.name}}</v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="showEquipmentViewDialog(POSITION_CONST.POSITION_BODY,equipment)"
                          >
                            <v-icon>zoom_in</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="deleteEquipment(POSITION_CONST.POSITION_BODY,equipment)"
                            :disabled="!editMode"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                  <v-flex
                    md6
                    xs12
                  >
                    <v-toolbar
                      color="grey darken-1"
                      dark
                      dense
                    >
                      <v-toolbar-title>右腕／SLOT:{{machine.machineType.getSlot(POSITION_CONST.POSITION_RIGHTARM)}}</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click.native="showEquipmentSelectDialog(POSITION_CONST.POSITION_RIGHTARM)"
                        :disabled="!editMode"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-list
                      two-line
                      subheader
                    >
                      <v-list-tile
                        v-for="(equipment, index)  in this.machine.equipments[POSITION_CONST.POSITION_RIGHTARM]"
                        :key="index"
                      >
                        <v-list-tile-content></v-list-tile-content>
                        <v-list-tile-content class="subheaders">{{equipment.name}}</v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="showEquipmentViewDialog(POSITION_CONST.POSITION_RIGHTARM,equipment)"
                          >
                            <v-icon>zoom_in</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="deleteEquipment(POSITION_CONST.POSITION_RIGHTARM,equipment)"
                            :disabled="!editMode"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                  <v-flex
                    md6
                    xs12
                  >
                    <v-toolbar
                      color="grey darken-1"
                      dark
                      dense
                    >
                      <v-toolbar-title>左腕／SLOT:{{machine.machineType.getSlot(POSITION_CONST.POSITION_LEFTARM)}}</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click.native="showEquipmentSelectDialog(POSITION_CONST.POSITION_LEFTARM)"
                        :disabled="!editMode"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-list
                      two-line
                      subheader
                    >
                      <v-list-tile
                        v-for="(equipment, index)  in this.machine.equipments[POSITION_CONST.POSITION_LEFTARM]"
                        :key="index"
                      >
                        <v-list-tile-content></v-list-tile-content>
                        <v-list-tile-content class="subheaders">{{equipment.name}}</v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="showEquipmentViewDialog(POSITION_CONST.POSITION_LEFTARM,equipment)"
                          >
                            <v-icon>zoom_in</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="deleteEquipment(POSITION_CONST.POSITION_LEFTARM,equipment)"
                            :disabled="!editMode"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      <v-divider />
                    </v-list>
                  </v-flex>
                  <v-flex
                    md6
                    xs12
                  >
                    <v-toolbar
                      color="grey darken-1"
                      dark
                      dense
                    >
                      <v-toolbar-title>右脚／SLOT:{{machine.machineType.getSlot(POSITION_CONST.POSITION_RIGHTLEG)}}</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click.native="showEquipmentSelectDialog(POSITION_CONST.POSITION_RIGHTLEG)"
                        :disabled="!editMode"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-list
                      two-line
                      subheader
                    >
                      <v-list-tile
                        v-for="(equipment, index)  in this.machine.equipments[POSITION_CONST.POSITION_RIGHTLEG]"
                        :key="index"
                      >
                        <v-list-tile-content></v-list-tile-content>
                        <v-list-tile-content class="subheaders">{{equipment.name}}</v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="showEquipmentViewDialog(POSITION_CONST.POSITION_RIGHTLEG,equipment)"
                          >
                            <v-icon>zoom_in</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="deleteEquipment(POSITION_CONST.POSITION_RIGHTLEG,equipment)"
                            :disabled="!editMode"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                  <v-flex
                    md6
                    xs12
                  >
                    <v-toolbar
                      color="grey darken-1"
                      dark
                      dense
                    >
                      <v-toolbar-title>左脚／SLOT:{{machine.machineType.getSlot(POSITION_CONST.POSITION_LEFTLEG)}}</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click.native="showEquipmentSelectDialog(POSITION_CONST.POSITION_LEFTLEG)"
                        :disabled="!editMode"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-list
                      two-line
                      subheader
                    >
                      <v-list-tile
                        v-for="(equipment, index)  in this.machine.equipments[POSITION_CONST.POSITION_LEFTLEG]"
                        :key="index"
                      >
                        <v-list-tile-content></v-list-tile-content>
                        <v-list-tile-content class="subheaders">{{equipment.name}}</v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="showEquipmentViewDialog(POSITION_CONST.POSITION_LEFTLEG,equipment)"
                          >
                            <v-icon>zoom_in</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="deleteEquipment(POSITION_CONST.POSITION_LEFTLEG,equipment)"
                            :disabled="!editMode"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                  <v-flex xs12>
                    <v-toolbar
                      color="grey darken-1"
                      dark
                      dense
                    >
                      <v-toolbar-title>自由入力欄</v-toolbar-title>
                    </v-toolbar>
                    <v-textarea
                      label="機体に関するメモを記入してください（最大500文字)。"
                      rows="10"
                      maxlength="500"
                      :readonly="!editMode"
                      v-model="machine.memo"
                    ></v-textarea>
                  </v-flex>
                  <v-flex xs12>
                    <v-toolbar
                      color="grey darken-1"
                      dark
                      dense
                    >
                      <v-toolbar-title>機体画像</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <file-upload-icon
                        tooltip="画像をアップロードします。"
                        icon="fas fa-file-upload"
                        :disabled="!editMode"
                        @onFileRead="onFileRead"
                      />
                    </v-toolbar>
                    <v-card-media
                      :height=320
                      :contain=true
                      :src="this.file"
                    />
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-card>
        <ins
          class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-9097509632200457"
          data-ad-slot="5985300299"
          data-ad-format="auto"
        ></ins>
      </v-card>
    </v-card>
    <machine-type-selector-dialog
      :show-dialog.sync="showMachineType"
      :targetMachineType="dialogMachineType"
      @select="acceptMachineType"
      @cancel="cancel"
    />
    <equipment-seletor-dialog
      :show-dialog.sync="showEquipment"
      :targetEquipment="dialogEquipment"
      :targetPosition="dialogTargetPosition"
      :editMode.sync="equipmentDialogEditMode"
      @select="acceptSelectedEquipment"
      @cancel="cancel"
    />
    <ok-ng-dialog
      :show-dialog.sync="showDeleteConfirmDialog"
      :dialogSize="350"
      message="選択した機体を削除します。よろしいですか？"
      @callback="confirmDeleteCallback"
    >
    </ok-ng-dialog>
    <messge-dialog
      :showDialog.sync="showErrorMessage"
      :message="errorMessage"
    />
  </div>
</template>

<style>
</style>

<script>
import EquipmentSeletorDialog from "@/components/embriomachine/EquipmentSeletorDialog";
import MachineTypeSelectorDialog from "@/components/embriomachine/MachineTypeSelectorDialog";
import OkNgDialog from "@/components/common/OkNgDialog";
import Machine from "@/model/embriomachine/machine";
import MachineType from "@/model/embriomachine/machinetype";
import Equipment from "@/model/embriomachine/equipment";
import CharcactersheetJpegBase64 from "@/model/embriomachine/CharcactersheetJpegBase64";
import FirebaseStorage from "@/model/embriomachine/FirebaseStorage";
import firebase from "firebase";
import MessgeDialog from "@/components/common/MessgeDialog";
import FileUploadIcon from "@/components/common/FileUploadIcon";

export default {
  name: "MachineConstructPanel",
  components: {
    EquipmentSeletorDialog: EquipmentSeletorDialog,
    MachineTypeSelectorDialog: MachineTypeSelectorDialog,
    OkNgDialog: OkNgDialog,
    MessgeDialog: MessgeDialog,
    FileUploadIcon: FileUploadIcon
  },
  mounted() {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  },
  props: {
    //編集モードかどうかの指定。
    editMode: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      id: this.$route.params["id"],
      machine: new Machine(),
      showEquipment: false,
      showMachineType: false,
      dialogEquipment: {},
      dialogMachineType: {},
      dialogTargetPosition: null,
      editingEquipmentPosition: {},
      editingEquipment: {},
      equipmentDialogEditMode: false,
      POSITION_CONST: MachineType.getPositionConst(),

      storage: new FirebaseStorage(),

      //削除ダイアログ
      showDeleteConfirmDialog: false,

      //エラーダイアログ
      showErrorMessage: false,
      errorMessage: "",

      user: null,

      //添付ファイル
      file: "",
      //ファイルが更新されたかどうかのフラグ。ONの場合だけ更新する。
      fileUpdated: false
    };
  },

  beforeMount() {
    // created() {
    //machineのロード
    if (this.id !== undefined && this.id !== null && this.id !== "") {
      this.storage.getMachineHeaderAndDetail(
        this.id,
        machine => {
          this.machine = machine;
          //download image file.
          //取得は非同期でよい。
          this.storage.readFile(
            this.machine.id,
            file => {
              this.file = file;
            },
            e => this.showErrorMessageDialog(e)
          );
        },
        e => {
          this.showErrorMessageDialog(e);
        }
      );
    }

    //3.認証状態のフックを設定
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      }
    });
  },

  watch: {},

  computed: {
    validateerror() {
      if (
        this.machine.machineType.name === undefined ||
        this.machine.machineType.name === ""
      ) {
        return ["機体の装甲・サイズが未選択です"];
      } else {
        return this.machine.validate();
      }
    },
    linkurl() {
      if (this.machine.id === null || this.machine.id === undefined) {
        return "";
      } else {
        return (
          // "http://localhost:8080/dist/#/embrioMachine/link/" +
          "https://direboar.github.io/embriosupport-prod-page/dist/#/embrioMachine/link/" +
          this.machine.id
        );
      }
    },

    canPrint() {
      if (this.validateerror.length > 0) {
        return false;
      }
      return true;
    }
  },

  methods: {
    showMachineTypeDialog() {
      let machineType = this.machine.machineType;
      //初期値としては「軽・SS」を選択する。
      if (machineType.name === undefined || machineType.name === "") {
        this.dialogMachineType = MachineType.getDefaultMachineType();
      } else {
        this.dialogMachineType = this.machine.machineType;
      }
      this.showMachineType = true;
    },
    //装備選択
    showEquipmentSelectDialog(position) {
      this.dialogEquipment = new Equipment("");
      this.editingEquipmentPosition = position;
      this.dialogTargetPosition = position;
      this.equipmentDialogEditMode = true;
      this.showEquipment = true;
    },
    //装備表示
    showEquipmentViewDialog(position, equipment) {
      this.dialogEquipment = equipment;
      this.editingEquipmentPosition = position;
      this.dialogTargetPosition = position;
      this.equipmentDialogEditMode = false;
      this.showEquipment = true;
    },
    acceptMachineType(machineType) {
      this.machine.machineType = machineType;
      this.dialogMachineType = new MachineType();
    },
    acceptSelectedEquipment(equipment, count) {
      for (let i = 0; i < count; i++) {
        this.machine.addEquipment(this.editingEquipmentPosition, equipment);
      }
      this.dialogEquipment = {};
    },
    deleteEquipment(position, equipment) {
      this.machine.deleteEquipment(position, equipment);
    },
    formatErrorMessage(messages) {
      let ret = "";
      messages.forEach(message => {
        ret += message + "<br/>";
      });
      return ret;
    },
    cancel() {
      this.dialogTargetPosition = null;
      this.editingEquipmentPosition = {};

      //ダイアログ選択内容の初期化
      this.dialogEquipment = {};
      this.dialogMachineType = new MachineType();
    },
    saveMachine() {
      (async () => {
        try {
          let updated = null;
          if (this.machine.id === null || this.machine.id === undefined) {
            updated = await this.storage.saveToFirebase(
              this.machine,
              this.user
            );
          } else {
            updated = await this.storage.updateToFirebase(this.machine);
          }

          this.storage.uploadFile(updated.id, this.file, () => {}, () => {});
          this.$router.push({ name: "MachineList" });
        } catch (e) {
          this.showErrorMessageDialog(e);
        }
      })();
    },
    confirmDelete() {
      this.showDeleteConfirmDialog = true;
    },
    confirmDeleteCallback(yes) {
      if (yes) {
        this.deleteMachine();
      }
    },
    deleteMachine() {
      this.storage.deleteFromFirebase(
        this.machine,
        () => {
          this.dialogMachine = new Machine("");
          this.$router.push({ name: "MachineList" });
        },
        errormsg => {
          this.showErrorMessageDialog(errormsg);
        }
      );
    },
    back() {
      this.$router.push({ name: "MachineList" });
    },

    showErrorMessageDialog(errorMessage) {
      this.errorMessage = errorMessage;
      this.showErrorMessage = true;
    },

    copyMachine() {
      // 1. 今参照している機体のIDを削除し、編集モードに移行する
      this.id = null;
      this.machine.setId(null);
      this.machine.setDetailId(null);
      this.editMode = true;
    },

    onFileRead(files) {
      for (const file of files) {
        let fileReader = new FileReader();
        fileReader.onload = data => {
          let file = data.target.result;
          this.file = file;
          this.fileUpdated = true;
        };
        fileReader.readAsDataURL(file);
      }
    },

    printPdf() {
      let imageSize = null;
      if (this.file != "") {
        //ファイルサイズを取得。
        var img = document.createElement("img");
        img.src = this.file;
        imageSize = this.calcPdfImageSize(img.height, img.width, 340, 250);
      }

      let machineType = this.machine.machineType;

      //pdfMakeはindex.htmlで読み込み、定義されている。
      pdfMake.fonts = {
        GenShin: {
          normal: "GenShinGothic-Normal-Sub.ttf",
          bold: "GenShinGothic-Normal-Sub.ttf",
          italics: "GenShinGothic-Normal-Sub.ttf",
          bolditalics: "GenShinGothic-Normal-Sub.ttf"
        }
      };
      const defaultStyle = "GenShin";
      let docDefinition = {
        pageSize: "A4",
        pageOrientation: "landscape",
        pageMargins: [0, 0, 0, 0],
        content: [
          //背景画像
          {
            image: CharcactersheetJpegBase64.base64,
            width: 850
          },
          //イニシアチブ
          {
            text: machineType.initiative,
            style: { fontSize: 20 },
            absolutePosition: { x: 100, y: 40 }
          },
          //移動値
          {
            text: machineType.movility,
            style: { fontSize: 20 },
            absolutePosition: { x: 185, y: 40 }
          },
          //回避値
          {
            text: machineType.evadeRate,
            style: { fontSize: 20 },
            absolutePosition: { x: 280, y: 40 }
          },
          //名前
          {
            text: this.machine.name,
            style: { fontSize: 15 },
            absolutePosition: { x: 460, y: 33 }
          },
          //装甲値
          {
            text: machineType.armorPoint,
            style: { fontSize: 15 },
            absolutePosition: { x: 150, y: 95 }
          },
          //スロット
          {
            text: machineType.getTotalSlot(),
            style: { fontSize: 15 },
            absolutePosition: { x: 150, y: 130 }
          },
          //耐久値
          {
            text: machineType.constitution,
            style: { fontSize: 15 },
            absolutePosition: { x: 150, y: 165 }
          },
          //突撃
          {
            text: machineType.chargeDamage,
            style: { fontSize: 15 },
            absolutePosition: { x: 255, y: 95 }
          },
          //被突撃
          {
            text: machineType.coveredChargeDamage,
            style: { fontSize: 15 },
            absolutePosition: { x: 255, y: 130 }
          },
          //サイズ
          {
            text: machineType.size,
            style: { fontSize: 15 },
            absolutePosition: { x: 100, y: 200 }
          },
          //重量
          {
            text: machineType.weight,
            style: { fontSize: 15 },
            absolutePosition: { x: 150, y: 200 }
          },
          //頭１
          {
            text: this.machine.getEquipment(MachineType.POSITION_HEAD, 0).name,
            style: { fontSize: 15 },
            absolutePosition: { x: 350, y: 125 }
          },
          //頭2
          {
            text: this.machine.getEquipment(MachineType.POSITION_HEAD, 1).name,
            style: { fontSize: 15 },
            absolutePosition: { x: 350, y: 160 }
          },
          //胴１
          {
            text: this.machine.getEquipment(MachineType.POSITION_BODY, 0).name,
            style: { fontSize: 15 },
            absolutePosition: { x: 565, y: 195 }
          },
          //胴2
          {
            text: this.machine.getEquipment(MachineType.POSITION_BODY, 1).name,
            style: { fontSize: 15 },
            absolutePosition: { x: 565, y: 230 }
          },
          //右腕1
          {
            text: this.machine.getEquipment(MachineType.POSITION_RIGHTARM, 0)
              .name,
            style: { fontSize: 15 },
            absolutePosition: { x: 110, y: 305 }
          },
          //右腕2
          {
            text: this.machine.getEquipment(MachineType.POSITION_RIGHTARM, 1)
              .name,
            style: { fontSize: 15 },
            absolutePosition: { x: 110, y: 340 }
          },
          //右腕3
          {
            text: this.machine.getEquipment(MachineType.POSITION_RIGHTARM, 2)
              .name,
            style: { fontSize: 15 },
            absolutePosition: { x: 110, y: 375 }
          },
          //左腕1
          {
            text: this.machine.getEquipment(MachineType.POSITION_LEFTARM, 0)
              .name,
            style: { fontSize: 15 },
            absolutePosition: { x: 590, y: 305 }
          },
          //左腕2
          {
            text: this.machine.getEquipment(MachineType.POSITION_LEFTARM, 1)
              .name,
            style: { fontSize: 15 },
            absolutePosition: { x: 590, y: 340 }
          },
          //左腕3
          {
            text: this.machine.getEquipment(MachineType.POSITION_LEFTARM, 2)
              .name,
            style: { fontSize: 15 },
            absolutePosition: { x: 590, y: 375 }
          },
          //右脚1
          {
            text: this.machine.getEquipment(MachineType.POSITION_RIGHTLEG, 0)
              .name,
            style: { fontSize: 15 },
            absolutePosition: { x: 135, y: 450 }
          },
          //右脚2
          {
            text: this.machine.getEquipment(MachineType.POSITION_RIGHTLEG, 1)
              .name,
            style: { fontSize: 15 },
            absolutePosition: { x: 135, y: 485 }
          },
          //左脚1
          {
            text: this.machine.getEquipment(MachineType.POSITION_LEFTLEG, 0)
              .name,
            style: { fontSize: 15 },
            absolutePosition: { x: 565, y: 450 }
          },
          //左脚2
          {
            text: this.machine.getEquipment(MachineType.POSITION_LEFTLEG, 1)
              .name,
            style: { fontSize: 15 },
            absolutePosition: { x: 565, y: 485 }
          }
        ],

        defaultStyle: {
          font: defaultStyle
        },
        styles: {
          header: {
            fontSize: 30
          },
          subheader: {
            fontSize: 20
          }
        }
      };

      //画像を添付した場合は画像出力の定義を追加
      if (this.file != "") {
        alert(imageSize.witdh);
        alert(imageSize.height);
        docDefinition.content.push(
          //添付画像
          {
            image: this.file,
            width: imageSize.witdh,
            height: imageSize.height,
            //中央に出すように位置調整
            absolutePosition: {
              x: 300 + (250 - imageSize.witdh) / 2,
              y: 190 + (340 - imageSize.height) / 2
            }
          }
        );
      }
      // let fileName = this.machine.name + "pdf";
      let fileName = this.machine.name;
      pdfMake.createPdf(docDefinition).download(fileName);
    },

    // width: 250,
    // height: 340,
    calcPdfImageSize(height, witdh, maxHeight, maxWitdh) {
      let retVal = {
        height: maxHeight,
        witdh: maxWitdh
      };

      let imageFileMaginfication = height / witdh;
      let maxMaginfication = maxHeight / maxWitdh;

      if (imageFileMaginfication > maxMaginfication) {
        retVal.witdh = witdh * (maxHeight / height);
      } else {
        retVal.height = height * (maxWitdh / witdh);
      }
      return retVal;
    }
  }
};
</script>
