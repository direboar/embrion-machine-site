<template>
  <div>
    <v-dialog
      v-model="showDialog"
      :persistent="editMode"
      max-width="1000"
      :fullscreen="isMd"
    >
      <v-layout row>
        <v-card>
          <v-container
            fruid
            grid-list-md
          >
            <v-layout
              row
              wrap
              justify-center
            >
              <v-flex
                sm1
                xs1
              />
              <v-flex
                sm2
                xs3
              >
                <v-select
                  dense
                  label="Select"
                  :items="editions"
                  v-model="selectedEditions"
                  max-height="400"
                  hint="ルール"
                  persistent-hint
                  multiple
                  :disabled="!editMode"
                ></v-select>
              </v-flex>
              <v-flex
                sm2
                xs3
              >
                <v-select
                  dense
                  label="Select"
                  :items="ranks"
                  v-model="selectedRanks"
                  max-height="400"
                  hint="ランク"
                  persistent-hint
                  multiple
                  :disabled="!editMode"
                ></v-select>
              </v-flex>
              <v-flex
                sm2
                xs4
              >
                <v-select
                  dense
                  label="Select"
                  :items="types"
                  v-model="selectedTypes"
                  max-height="400"
                  hint="種類"
                  persistent-hint
                  multiple
                  :disabled="!editMode"
                ></v-select>
              </v-flex>
              <v-flex sm3>
                <v-text-field
                  v-if="editMode&&!isXs"
                  v-model="searchEquipmentName"
                  label="装備名（絞り込み用）"
                  item-value="text"
                  :disabled="!editMode"
                ></v-text-field>
              </v-flex>
              <v-flex sm1>
                <v-btn
                  v-if="editMode&&!isXs"
                  label="装備名（入力した名称で絞り込みます）"
                  :disabled="!editMode"
                  @click.native="selectAll"
                >{{buttonLabel}}
                </v-btn>
              </v-flex>
              <!--FIXME コンポーネント化-->
              <v-toolbar
                floating
                dense
                v-if="isXs"
              >
                <v-select
                  :items="itemcounts"
                  v-model="itemcount"
                  label="装備数"
                  item-value="text"
                  :disabled="!editMode"
                ></v-select>
                <v-tooltip>
                  <v-btn
                    slot="activator"
                    icon
                    @click.native="select"
                    :disabled="!editMode"
                  >
                    <v-icon>fas fa-hand-pointer</v-icon>
                  </v-btn>
                  <span>装備を選択します。</span>
                </v-tooltip>
                <v-tooltip>
                  <v-btn
                    slot="activator"
                    icon
                    @click.native="closeDialog"
                  >
                    <v-icon>fas fa-backward</v-icon>
                  </v-btn>
                  <span>機体作成・編集画面に戻ります。</span>
                </v-tooltip>
              </v-toolbar>
              <!-- <v-flex
                sm9
                xs6
              /> -->
              <v-flex
                sm4
                xs5
              >
                <v-layout
                  style="max-height: 600px"
                  class="scroll-y"
                >
                  <v-radio-group
                    label="装備"
                    v-model="selectedEquipmentName"
                    :mandatory="false"
                    :class="isXs ? 'small' : ''"
                  >
                    <v-radio
                      v-for="equipment in equipments"
                      :label="formatEquipmentName(equipment)"
                      :value="equipment.name"
                      :key="equipment.name"
                      :disabled="!editMode"
                      class="caption"
                    ></v-radio>
                  </v-radio-group>
                </v-layout>
              </v-flex>
              <v-flex
                sm4
                xs3
              >
                <v-list
                  :dense="isXs"
                  :two-line="isXs"
                >
                  <v-list-tile v-if="!isXs">
                    <v-select
                      v-if="editMode"
                      :items="itemcounts"
                      v-model="itemcount"
                      label="装備数"
                      item-value="text"
                    ></v-select>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass">種別／ランク</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass">射程</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass">ダメージ</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass">搭載可能部位</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass">最低枚数</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass">上限枚数</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                </v-list>
              </v-flex>
              <v-flex
                sm4
                xs4
              >
                <v-list
                  :dense="isXs"
                  :two-line="isXs"
                >
                  <v-list-tile v-if="!isXs">
                    <v-toolbar floating>
                      <v-tooltip>
                        <v-btn
                          slot="activator"
                          icon
                          @click.native="select"
                          :disabled="!editMode"
                        >
                          <v-icon>fas fa-hand-pointer</v-icon>
                        </v-btn>
                        <span>装備を選択します。</span>
                      </v-tooltip>
                      <v-tooltip>
                        <v-btn
                          slot="activator"
                          icon
                          @click.native="closeDialog"
                        >
                          <v-icon>fas fa-backward</v-icon>
                        </v-btn>
                        <span>機体作成・編集画面に戻ります。</span>
                      </v-tooltip>
                    </v-toolbar>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass">{{equipment.type}}（{{equipment.rank}}）</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass">{{equipment.range}}</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass">{{formatDamage(equipment)}}</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass">{{equipment.mountPosition}}</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass">{{equipment.formatMinLimit}}</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass">{{equipment.maxLimit}}</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                </v-list>
              </v-flex>
              <v-flex xs12>
                <v-card-text class="body-1">
                  <span
                    style="white-space: pre-wrap;display: inline-block;height:30px;"
                    v-html="equipment.effect"
                  ></span>
                </v-card-text>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-layout>
    </v-dialog>
  </div>
</template>

<style>
/* チェックボックスのフォント制御用。
   @see https://github.com/vuetifyjs/vuetify/issues/5715
   @see https://codepen.io/jongallant/pen/MLGPVR */
.small label {
  font-size: 12px;
}
</style>

<script>
import Equipment from "@/model/embriomachine/equipment";

export default {
  name: "EquipmentSeletorDialog",
  props: {
    //ダイアログ表示フラグ。
    showDialog: {
      type: Boolean,
      default: true
    },
    //編集対象の装備データ。未選択の場合はnullを指定。
    targetEquipment: {
      type: Object,
      default: null
    },
    //ダイアログ表示フラグ。
    targetPosition: {
      type: String,
      default: null
    },
    //編集モードかどうかの指定。
    editMode: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      selectedEquipmentName: this.targetEquipment.name,
      types: [
        Equipment.TYPE_SHAGEKI,
        Equipment.TYPE_HAKUHEI,
        Equipment.TYPE_KIRAI,
        Equipment.TYPE_SOUKOU,
        Equipment.TYPE_HOJO,
        Equipment.TYPE_TOTSUGEKI,
        Equipment.TYPE_IDOU,
        Equipment.TYPE_SONOTA
      ],
      selectedTypes: [Equipment.TYPE_SHAGEKI],
      ranks: ["S", "A", "B"],
      selectedRanks: ["B"],
      itemcounts: [1, 2, 3],
      itemcount: 1,
      editions: ["基本", "玉座"],
      selectedEditions: ["基本"],
      searchEquipmentName: "",
      buttonLabel: "全選択"
    };
  },

  watch: {
    targetEquipment: function(val) {
      if (val && val.name) {
        this.selectedEquipmentName = val.name;
        this.selectedTypes = [val.type];
        this.selectedRanks = [val.rank];
        this.selectedEditions = [val.edition];
        this.searchEquipmentName = "";
      }
    },
    equipment: function(val) {
      this.itemcount = val.calcDefaultItemCount();
    },
    showDialog: function(val) {
      if (!val) {
        this.closeDialog();
      }
    }
  },

  computed: {
    equipments() {
      return Equipment.getEquipments().filter(equipment => {
        let retVal = true;
        retVal = this.selectedTypes.reduce((accumurator, type) => {
          if (!accumurator && !equipment.isTypeOf(type)) {
            return false;
          } else {
            return true;
          }
        }, false);
        retVal =
          retVal &&
          this.selectedRanks.reduce((accumurator, rank) => {
            if (!accumurator && equipment.rank !== rank) {
              return false;
            } else {
              return true;
            }
          }, false);
        retVal =
          retVal &&
          this.selectedEditions.reduce((accumurator, edition) => {
            if (!accumurator && equipment.edition !== edition) {
              return false;
            } else {
              return true;
            }
          }, false);

        if (this.searchEquipmentName !== "") {
          retVal = retVal && equipment.name.includes(this.searchEquipmentName);
        }

        if (!equipment.canEquip(this.targetPosition)) {
          retVal = false;
        }
        // console.log(equipment.name + " = " + retVal);
        return retVal;
      });
    },

    equipment() {
      let ret = new Equipment();

      this.equipments.forEach(item => {
        if (item.name === this.selectedEquipmentName) {
          ret = item;
        }
      });
      return ret;
    },

    contentClass() {
      if (this.$vuetify.breakpoint.name === "xs") {
        return "caption";
      } else {
        return "subheading";
      }
    },
    isXs() {
      return this.$vuetify.breakpoint.name === "xs";
    },
    isMd() {
      return ["xs", "sm", "md"].includes(this.$vuetify.breakpoint.name);
    }
  },

  methods: {
    selectAll() {
      if (this.buttonLabel === "全選択") {
        this.selectedTypes = this.types;
        this.selectedRanks = this.ranks;
        this.selectedEditions = this.editions;
        this.buttonLabel = "全選択解除";
      } else {
        this.selectedTypes = [Equipment.TYPE_SHAGEKI];
        this.selectedRanks = ["B"];
        this.selectedEditions = ["基本"];
        this.buttonLabel = "全選択";
      }
    },
    closeDialog() {
      this.$emit("update:showDialog", false);
      this.$emit("cancel");
      this.itemcount = 1;
    },
    select() {
      this.$emit("update:showDialog", false);
      this.$emit("select", this.equipment, this.itemcount);
      this.itemcount = 1;
    },
    //FIXME deprecated.
    formatEquipmentName(equipment) {
      return equipment.name;
    },
    formatDamage(equipment) {
      if (
        equipment === null ||
        equipment === undefined ||
        equipment.damage === undefined
      ) {
        return "";
      } else {
        return equipment.damage + "(" + equipment.damageType + ")";
      }
    }
  }
};
</script>
