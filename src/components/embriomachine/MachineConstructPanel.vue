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
                            :disabled="!editMode"
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
    <!-- <machine-type-selector-dialog
      :show-dialog.sync="showMachineType"
      :targetMachineType.sync="dialogMachineType"
      @select="acceptMachineType"
      @cancel="cancel"
    /> -->
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

export default {
  name: "MachineConstructPanel",
  components: {
    EquipmentSeletorDialog: EquipmentSeletorDialog,
    MachineTypeSelectorDialog: MachineTypeSelectorDialog,
    OkNgDialog: OkNgDialog
  },
  mounted() {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  },
  props: {
    //編集対象の装備データ。未選択の場合はnullを指定。
    targetMachine: {
      type: Object,
      default: new Machine("")
    },
    //編集モードかどうかの指定。
    editMode: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      machine: Machine.assign(this.targetMachine),
      showEquipment: false,
      showMachineType: false,
      dialogEquipment: {},
      dialogMachineType: {},
      dialogTargetPosition: null,
      editingEquipmentPosition: {},
      editingEquipment: {},
      equipmentDialogEditMode: false,
      POSITION_CONST: MachineType.getPositionConst(),

      //削除ダイアログ
      showDeleteConfirmDialog: false
    };
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
      //this.$emit("update:targetMachine", this.machine);
      this.$emit("save", this.machine);
      this.machine = new Machine("", new MachineType());
      this.dialogTargetPosition = null;
      this.editingEquipmentPosition = {};
      this.dialogMachineType = new MachineType();
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
      //      this.$emit("update:targetMachine", this.machine);
      this.$emit("delete", this.machine);
      this.machine = new Machine("", new MachineType());
      this.dialogTargetPosition = null;
      this.editingEquipmentPosition = {};
      this.dialogMachineType = new MachineType();
    },
    back() {
      //      this.$emit("update:targetMachine", this.machine);
      this.$emit("cancel");
      this.machine = new Machine("", new MachineType());
      this.dialogTargetPosition = null;
      this.editingEquipmentPosition = {};
      this.dialogMachineType = new MachineType();
    }
  }
};
</script>
