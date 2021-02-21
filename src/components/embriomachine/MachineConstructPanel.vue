<template>
  <div>
    <v-card>
      <v-layout row wrap>
        <v-flex xs12>
          <v-layout row wrap>
            <v-flex xs12>
              <v-alert :value="fatalerror.length > 0" type="error">
                <p v-html="formatErrorMessage(fatalerror)"></p>
              </v-alert>
              <v-alert :value="validateerror.length > 0" type="warning">
                <p v-html="formatErrorMessage(validateerror)"></p>
                （弾薬を装備している場合、弾薬と入れ替えた装備のチェックは正しく行われないことに注意してください。）
              </v-alert>
            </v-flex>
            <v-flex xl3 md4 sm6 xs12>
              <v-card>
                <v-toolbar color="grey darken-1" dark dense>
                  <v-toolbar-title>基本データ</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar floating dense>
                    <v-tooltip>
                      <v-btn
                        slot="activator"
                        icon
                        @click.native="saveMachine"
                        :disabled="!editMode || fatalerror.length > 0"
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
                        @click.native="simulate"
                        :disabled="!canPrint"
                      >
                        <v-icon>fas fa-gamepad</v-icon>
                      </v-btn>
                      <span>デッキをシミュレーションします</span>
                    </v-tooltip>
                    <!--デスクトップ画面でのみ表示。-->
                    <v-tooltip>
                      <v-btn
                        slot="activator"
                        icon
                        @click.native="analizeDamageRange"
                        :disabled="!canPrint || isXs"
                      >
                        <v-icon>fas fa-table</v-icon>
                      </v-btn>
                      <span>距離ごとのダメージ表を表示します</span>
                    </v-tooltip>
                    <file-download-icon
                      tooltip="機体のテキストデータを出力します"
                      :data="exportTextData"
                      :disabled="!canPrint || isXs"
                      :fileName="this.machine.name + '.txt'"
                      icon="fas fa-file-export"
                    />
                    <v-tooltip>
                      <v-btn
                        slot="activator"
                        icon
                        @click.native="copyMachine"
                        :disabled="editMode"
                      >
                        <v-icon>fas fa-copy</v-icon>
                      </v-btn>
                      <span
                        >機体をコピーして作成画面に移動します（保存しないとコピーは失われます）。</span
                      >
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
                      <v-btn slot="activator" icon @click.native="back">
                        <v-icon>fas fa-backward</v-icon>
                      </v-btn>
                      <span>一覧画面に戻ります。</span>
                    </v-tooltip>
                  </v-toolbar>
                </v-toolbar>
                <v-layout row wrap>
                  <v-flex xs4>
                    <v-list two-line subheader>
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
                        <v-list-tile-content
                          >突撃／被突撃ダメージ</v-list-tile-content
                        >
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content
                          >Aランク武装の数</v-list-tile-content
                        >
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content
                          >機体へのリンク</v-list-tile-content
                        >
                      </v-list-tile>
                      <v-divider />
                    </v-list>
                  </v-flex>
                  <v-flex xs8>
                    <v-list two-line subheader>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-text-field
                            type="text"
                            v-model="machine.name"
                            required
                            :readonly="!editMode"
                            maxlength="30"
                          />
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{
                          machine.machineType !== null
                            ? machine.machineType.name
                            : ""
                        }}</v-list-tile-content>
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
                        <v-list-tile-content class="subheaders">{{
                          machine.machineType !== null
                            ? machine.machineType.movility
                            : ""
                        }}</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{
                          machine.machineType !== null
                            ? machine.machineType.evadeRate
                            : ""
                        }}</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{
                          machine.machineType !== null ? machine.armorPoint : ""
                        }}</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{
                          machine.machineType !== null
                            ? machine.constitution
                            : ""
                        }}</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{
                          machine.machineType !== null
                            ? machine.machineType.initiative
                            : ""
                        }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{
                          machine.machineType !== null
                            ? machine.chargeDamage +
                              "／" +
                              machine.coveredChargeDamage
                            : ""
                        }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="subheaders">{{
                          machine.getARankEquipmentCount()
                        }}</v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                      <v-list-tile>
                        <v-list-tile-content>
                          <a :href="linkurl">{{ linkurl }}</a>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-divider />
                    </v-list>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xl9 md8 sm6 xs12>
              <v-card>
                <v-layout row wrap>
                  <v-flex md6 xs12>
                    <v-toolbar color="grey darken-1" dark dense>
                      <v-toolbar-title
                        >頭／SLOT:{{
                          machine.machineType !== null
                            ? machine.getSlot(POSITION_CONST.POSITION_HEAD)
                            : ""
                        }}</v-toolbar-title
                      >
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click.native="
                          showEquipmentSelectDialog(
                            POSITION_CONST.POSITION_HEAD
                          )
                        "
                        :disabled="!editMode"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-list two-line subheader>
                      <v-list-tile
                        v-for="(equipment, index) in this.machine.equipments[
                          POSITION_CONST.POSITION_HEAD
                        ]"
                        :key="index"
                      >
                        <v-list-tile-content></v-list-tile-content>
                        <v-list-tile-content class="subheaders">{{
                          equipment.name
                        }}</v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="
                              showEquipmentViewDialog(
                                POSITION_CONST.POSITION_HEAD,
                                equipment
                              )
                            "
                          >
                            <v-icon>zoom_in</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="
                              deleteEquipment(
                                POSITION_CONST.POSITION_HEAD,
                                equipment
                              )
                            "
                            :disabled="!editMode"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                  <v-flex md6 xs12>
                    <v-toolbar color="grey darken-1" dark dense>
                      <v-toolbar-title
                        >胴／SLOT:{{
                          machine.machineType !== null
                            ? machine.getSlot(POSITION_CONST.POSITION_BODY)
                            : ""
                        }}</v-toolbar-title
                      >
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click.native="
                          showEquipmentSelectDialog(
                            POSITION_CONST.POSITION_BODY
                          )
                        "
                        :disabled="!editMode"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-list two-line subheader>
                      <v-list-tile
                        v-for="(equipment, index) in this.machine.equipments[
                          POSITION_CONST.POSITION_BODY
                        ]"
                        :key="index"
                      >
                        <v-list-tile-content></v-list-tile-content>
                        <v-list-tile-content class="subheaders">{{
                          equipment.name
                        }}</v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="
                              showEquipmentViewDialog(
                                POSITION_CONST.POSITION_BODY,
                                equipment
                              )
                            "
                          >
                            <v-icon>zoom_in</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="
                              deleteEquipment(
                                POSITION_CONST.POSITION_BODY,
                                equipment
                              )
                            "
                            :disabled="!editMode"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                  <v-flex md6 xs12>
                    <v-toolbar color="grey darken-1" dark dense>
                      <v-toolbar-title
                        >右腕／SLOT:{{
                          machine.machineType !== null
                            ? machine.getSlot(POSITION_CONST.POSITION_RIGHTARM)
                            : ""
                        }}</v-toolbar-title
                      >
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click.native="
                          showEquipmentSelectDialog(
                            POSITION_CONST.POSITION_RIGHTARM
                          )
                        "
                        :disabled="!editMode"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-list two-line subheader>
                      <v-list-tile
                        v-for="(equipment, index) in this.machine.equipments[
                          POSITION_CONST.POSITION_RIGHTARM
                        ]"
                        :key="index"
                      >
                        <v-list-tile-content></v-list-tile-content>
                        <v-list-tile-content class="subheaders">{{
                          equipment.name
                        }}</v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="
                              showEquipmentViewDialog(
                                POSITION_CONST.POSITION_RIGHTARM,
                                equipment
                              )
                            "
                          >
                            <v-icon>zoom_in</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="
                              deleteEquipment(
                                POSITION_CONST.POSITION_RIGHTARM,
                                equipment
                              )
                            "
                            :disabled="!editMode"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                  <v-flex md6 xs12>
                    <v-toolbar color="grey darken-1" dark dense>
                      <v-toolbar-title
                        >左腕／SLOT:{{
                          machine.machineType !== null
                            ? machine.getSlot(POSITION_CONST.POSITION_LEFTARM)
                            : ""
                        }}</v-toolbar-title
                      >
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click.native="
                          showEquipmentSelectDialog(
                            POSITION_CONST.POSITION_LEFTARM
                          )
                        "
                        :disabled="!editMode"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-list two-line subheader>
                      <v-list-tile
                        v-for="(equipment, index) in this.machine.equipments[
                          POSITION_CONST.POSITION_LEFTARM
                        ]"
                        :key="index"
                      >
                        <v-list-tile-content></v-list-tile-content>
                        <v-list-tile-content class="subheaders">{{
                          equipment.name
                        }}</v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="
                              showEquipmentViewDialog(
                                POSITION_CONST.POSITION_LEFTARM,
                                equipment
                              )
                            "
                          >
                            <v-icon>zoom_in</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="
                              deleteEquipment(
                                POSITION_CONST.POSITION_LEFTARM,
                                equipment
                              )
                            "
                            :disabled="!editMode"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      <v-divider />
                    </v-list>
                  </v-flex>
                  <v-flex md6 xs12>
                    <v-toolbar color="grey darken-1" dark dense>
                      <v-toolbar-title
                        >右脚／SLOT:{{
                          machine.machineType !== null
                            ? machine.getSlot(POSITION_CONST.POSITION_RIGHTLEG)
                            : ""
                        }}</v-toolbar-title
                      >
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click.native="
                          showEquipmentSelectDialog(
                            POSITION_CONST.POSITION_RIGHTLEG
                          )
                        "
                        :disabled="!editMode"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-list two-line subheader>
                      <v-list-tile
                        v-for="(equipment, index) in this.machine.equipments[
                          POSITION_CONST.POSITION_RIGHTLEG
                        ]"
                        :key="index"
                      >
                        <v-list-tile-content></v-list-tile-content>
                        <v-list-tile-content class="subheaders">{{
                          equipment.name
                        }}</v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="
                              showEquipmentViewDialog(
                                POSITION_CONST.POSITION_RIGHTLEG,
                                equipment
                              )
                            "
                          >
                            <v-icon>zoom_in</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="
                              deleteEquipment(
                                POSITION_CONST.POSITION_RIGHTLEG,
                                equipment
                              )
                            "
                            :disabled="!editMode"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                  <v-flex md6 xs12>
                    <v-toolbar color="grey darken-1" dark dense>
                      <v-toolbar-title
                        >左脚／SLOT:{{
                          machine.machineType !== null
                            ? machine.getSlot(POSITION_CONST.POSITION_LEFTLEG)
                            : ""
                        }}</v-toolbar-title
                      >
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click.native="
                          showEquipmentSelectDialog(
                            POSITION_CONST.POSITION_LEFTLEG
                          )
                        "
                        :disabled="!editMode"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-list two-line subheader>
                      <v-list-tile
                        v-for="(equipment, index) in this.machine.equipments[
                          POSITION_CONST.POSITION_LEFTLEG
                        ]"
                        :key="index"
                      >
                        <v-list-tile-content></v-list-tile-content>
                        <v-list-tile-content class="subheaders">{{
                          equipment.name
                        }}</v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="
                              showEquipmentViewDialog(
                                POSITION_CONST.POSITION_LEFTLEG,
                                equipment
                              )
                            "
                          >
                            <v-icon>zoom_in</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                          <v-btn
                            color="grey darken-4"
                            flat
                            @click.native="
                              deleteEquipment(
                                POSITION_CONST.POSITION_LEFTLEG,
                                equipment
                              )
                            "
                            :disabled="!editMode"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                  <v-flex xs12>
                    <v-toolbar color="grey darken-1" dark dense>
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
                    <v-toolbar color="grey darken-1" dark dense>
                      <v-toolbar-title
                        >機体画像　画像ファイルのアップロード機能は現在使用できません。</v-toolbar-title
                      >
                      <v-spacer></v-spacer>
                      <file-upload-icon
                        tooltip="画像をアップロードします。"
                        icon="fas fa-file-upload"
                        :disabled="!editMode"
                        @onFileRead="onFileRead"
                      />
                    </v-toolbar>
                    <v-card-media
                      :height="320"
                      :contain="true"
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
    <card-simulation-panel
      :showDialog.sync="showSimulation"
      :machine="machine"
    />
    <damage-range-analize-panel
      :show-dialog.sync="showDamageRangeAnalizeDialog"
      :machine="machine"
    />
  </div>
</template>

<style></style>

<script>
import EquipmentSeletorDialog from "@/components/embriomachine/EquipmentSeletorDialog";
import MachineTypeSelectorDialog from "@/components/embriomachine/MachineTypeSelectorDialog";
import OkNgDialog from "@/components/common/OkNgDialog";
import Machine from "@/model/embriomachine/machine";
import MachineType from "@/model/embriomachine/machinetype";
import Equipment from "@/model/embriomachine/equipment";
import FirebaseStorage from "@/model/embriomachine/FirebaseStorage";
import firebase from "firebase";
import MessgeDialog from "@/components/common/MessgeDialog";
import FileUploadIcon from "@/components/common/FileUploadIcon";
import PdfMaker from "@/model/embriomachine/PdfMaker";
import CardSimulationPanel from "@/components/embriomachine/CardSimulationPanel";
import DamageRangeAnalizePanel from "@/components/embriomachine/DamageRangeAnalizePanel";
import FileDownloadIcon from "@/components/common/FileDownloadIcon";

export default {
  name: "MachineConstructPanel",
  components: {
    EquipmentSeletorDialog: EquipmentSeletorDialog,
    MachineTypeSelectorDialog: MachineTypeSelectorDialog,
    CardSimulationPanel: CardSimulationPanel,
    DamageRangeAnalizePanel: DamageRangeAnalizePanel,
    OkNgDialog: OkNgDialog,
    MessgeDialog: MessgeDialog,
    FileUploadIcon: FileUploadIcon,
    FileDownloadIcon: FileDownloadIcon
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

      //シミュレーションダイアログ
      showSimulation: false,

      //射程毎ダメージシミュレーションダイアログ
      showDamageRangeAnalizeDialog: false,

      user: null,

      //添付ファイル
      file: "",
      contentType: "",
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
    fatalerror() {
      if (this.machine.machineType === null) {
        return ["機体の装甲・サイズが未選択です"];
      } else if (!this.machine.name) {
        return ["機体の名前は必須です"];
      } else {
        return [];
      }
    },
    validateerror() {
      console.log(this.fatalerror);
      if (this.fatalerror.length !== 0) {
        return [];
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
      if (this.fatalerror.length > 0) {
        return false;
      }
      return true;
    },
    //FIXME mixin?
    isXs() {
      return this.$vuetify.breakpoint.name === "xs";
    }
  },

  methods: {
    exportTextData() {
      return this.machine.toText();
    },

    showMachineTypeDialog() {
      let machineType = this.machine.machineType;
      //初期値としては「軽・SS」を選択する。
      if (machineType === null) {
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

          if (this.fileUpdated && this.file !== "") {
            await this.storage.uploadFile(
              updated.id,
              this.file,
              this.contentType,
              () => {},
              () => {}
            );
          }
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

          //mime-typeを取得
          let regex = /(data:)(.*\/*)(;base64,)/;
          let matches = regex.exec(file);
          if (matches.length == 4) {
            let contentType = matches[2];
            if (!contentType.startsWith("image")) {
              this.showErrorMessageDialog(
                "画像ファイル以外はアップロードできません"
              );
            } else {
              this.file = file;
              this.fileUpdated = true;
              this.contentType = contentType;
            }
          }
        };
        fileReader.readAsDataURL(file);
      }
    },

    printPdf() {
      let pdfMaker = new PdfMaker();
      pdfMaker.printPdf(this.machine, this.file);
    },
    simulate() {
      this.showSimulation = true;
    },
    analizeDamageRange() {
      this.showDamageRangeAnalizeDialog = true;
    }
  }
};
</script>
