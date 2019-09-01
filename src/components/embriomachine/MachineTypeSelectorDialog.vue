<template>
  <div>
    <v-dialog
      v-model="showDialog"
      persistent
      :fullscreen="isXs"
      max-width="500"
    >
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
              <v-flex
                sm6
                xs6
              >
                <v-radio-group
                  label="種類"
                  v-model="seatType"
                  :row="!isXs"
                  class="body-1"
                >
                  <v-radio
                    v-for="seatType in seatTypes"
                    :label="seatType"
                    :value="seatType"
                    :key="seatType"
                    color="brown lighten-2"
                  ></v-radio>
                </v-radio-group>
                <v-radio-group
                  v-model="selectedMachineTypeName"
                  :mandatory="false"
                >
                  <v-radio
                    v-for="machineType in machineTypes"
                    :label="machineType.name"
                    :value="machineType.name"
                    :key="machineType.name"
                  ></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex
                sm6
                xs6
              >
                <v-layout
                  row
                  wrap
                >
                  <v-flex xs12>
                    <!--FIXME コンポーネント化-->
                    <v-toolbar
                      floating
                      dense
                    >
                      <v-tooltip>
                        <v-btn
                          slot="activator"
                          icon
                          @click.native="select"
                        >
                          <v-icon>fas fa-hand-pointer</v-icon>
                        </v-btn>
                        <span>装甲・サイズを選択します。</span>
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
                  <v-flex xs6>
                    <v-list dense>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">名称</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">移動力</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">回避値</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">装甲値</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">耐久値</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">イニシアチブ</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">突撃／被突撃Ⅾ</v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                    <v-divider />
                  </v-flex>
                  <v-flex xs6>
                    <v-list dense>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">{{machineType.name}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">{{machineType.movility}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">{{machineType.evadeRate}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">{{machineType.armorPoint}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">{{machineType.constitution}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">{{machineType.initiative}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">{{machineType.chargeDamage}}／{{machineType.coveredChargeDamage}}</v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                    <v-divider />
                  </v-flex>
                  <v-flex xs6>
                    <v-list dense>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">スロット</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">頭</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">胴</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">右腕</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">左腕</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">右脚</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">左脚</v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                  <v-flex xs6>
                    <v-list dense>
                      <v-list-tile>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">{{machineType.headSlot}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">{{machineType.bodySlot}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">{{machineType.rightArmSlot}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">{{machineType.leftArmSlot}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">{{machineType.rightLegSlot}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content :class="contentClass">{{machineType.leftLegSlot}}</v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="styl">
.v-label {
  font-size: 11pt;
}
</style>

<script>
import MachineType from "@/model/embriomachine/machinetype";

export default {
  name: "MachineTypeSelectorDialog",
  props: {
    //ダイアログ表示フラグ。
    showDialog: {
      type: Boolean,
      default: true
    },
    //編集対象の装備データ。未選択の場合はnullを指定。
    targetMachineType: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      //単座、複座
      seatTypes: ["単座", "複座"],
      seatType: "単座",
      selectedMachineTypeName: this.targetMachineType.name,
      POSITION_CONST: MachineType.getPositionConst()
    };
  },

  watch: {
    targetMachineType: function(val) {
      if (val != null) {
        this.selectedMachineTypeName = val.name;
      } else {
        this.selectedMachineTypeName = "";
      }
    }
  },

  computed: {
    machineType() {
      let ret = {};
      this.machineTypes.forEach(item => {
        if (item.name === this.selectedMachineTypeName) {
          ret = item;
        }
      });
      return ret;
    },

    machineTypes() {
      //単座か複座で表示対象の機種を絞り込む。
      return MachineType.getMachineTypes().filter(machineType => {
        if (this.seatType === "複座") {
          return machineType.hasDoubleSeat;
        } else {
          return !machineType.hasDoubleSeat;
        }
      });
    },

    contentClass() {
      if (this.$vuetify.breakpoint.name === "xs") {
        return "caption";
      } else {
        return "subheading";
      }
    },

    // lavelFontSize() {
    //   if (this.$vuetify.breakpoint.name === "xs") {
    //     return "9px";
    //   } else {
    //     return "12px";
    //   }
    // },

    isXs() {
      return this.$vuetify.breakpoint.name === "xs";
    }
  },

  methods: {
    closeDialog() {
      // this.$emit("update:targetMachineType", {});
      this.$emit("cancel");
      this.selectedMachineTypeName = "";
      this.$emit("update:showDialog", false);
    },
    select() {
      // this.$emit("update:targetMachineType", this.machineType);
      this.$emit("select", this.machineType);
      this.selectedMachineTypeName = "";
      this.$emit("update:showDialog", false);
    }
  }
};
</script>
