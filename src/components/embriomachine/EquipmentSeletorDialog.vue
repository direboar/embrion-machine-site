<template>
  <div>
    <v-dialog
      v-model="showDialog"
      :persistent="editMode"
      max-width="1000"
      :fullscreen="isMd"
    >
      <v-card>
        <v-layout
          row
          wrap
        >
          <v-flex
            sm3
            xs6
          >
            <v-radio-group
              label="ルール"
              v-model="edition"
              :row="!isXs"
              v-if="editMode"
            >
              <v-radio
                v-for="edition in editions"
                :label="edition"
                :value="edition"
                :key="edition"
                :disabled="!editMode"
                class="body-1"
                color="light-green lighten-1"
              ></v-radio>
            </v-radio-group>
            <v-radio-group
              label="ランク"
              v-model="rank"
              :row="!isXs"
              v-if="editMode"
            >
              <v-radio
                v-for="rank in ranks"
                :label="rank"
                :value="rank"
                :key="rank"
                :disabled="!editMode"
                class="body-1"
                color="light-green lighten-1"
              ></v-radio>
            </v-radio-group>
            <!--FIXME コンポーネント化-->
            <v-toolbar
              floating
              dense
              v-if="isXs"
            >
              <v-select
                v-if="editMode"
                :items="itemcounts"
                v-model="itemcount"
                label="装備数"
                item-value="text"
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
          </v-flex>
          <v-flex
            sm9
            xs6
          >
            <v-radio-group
              label="種類"
              v-model="type"
              :row="!isXs"
              v-if="editMode"
              class="body-1"
            >
              <v-radio
                v-for="type in types"
                :label="type"
                :value="type"
                :key="type"
                :disabled="!editMode"
                color="brown lighten-2"
              ></v-radio>
            </v-radio-group>
          </v-flex>
          <v-flex
            sm4
            xs6
          >
            <v-radio-group
              label="装備"
              v-model="selectedEquipmentName"
              :mandatory="false"
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
          </v-flex>
          <v-flex
            sm4
            xs3
          >
            <v-list :dense="isXs">
              <v-list-tile>
                <v-select
                  v-if="editMode&&!isXs"
                  :items="itemcounts"
                  v-model="itemcount"
                  label="装備数"
                  item-value="text"
                ></v-select>
              </v-list-tile>
              <v-list-tile>
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
            xs3
          >
            <v-list :dense="isXs">
              <v-list-tile>
                <v-toolbar
                  floating
                  v-if="!isXs"
                >
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
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
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
      type: Equipment.TYPE_SHAGEKI,
      ranks: ["S", "A", "B"],
      rank: "B",
      itemcounts: [1, 2, 3],
      itemcount: 1,
      editions: ["基本", "玉座"],
      edition: "基本"
    };
  },

  watch: {
    targetEquipment: function(val) {
      if (val && val.name) {
        this.selectedEquipmentName = val.name;
        this.type = val.type;
        this.rank = val.rank;
        this.edition = val.edition;
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
        if (this.type !== null) {
          if (!equipment.isTypeOf(this.type)) {
            return false;
          }
          if (equipment.rank !== this.rank) {
            return false;
          }
          if (equipment.edition !== this.edition) {
            return false;
          }
        }
        if (this.targetPosition === null) {
          return true;
        } else {
          return equipment.canEquip(this.targetPosition);
        }
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
