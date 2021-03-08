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
          <v-container fruid grid-list-md>
            <v-layout row wrap justify-center>
              <v-flex sm1 xs1 />
              <v-flex sm2 xs3>
                <v-select
                  dense
                  label="Select"
                  :items="classifications"
                  v-model="selectedClassifications"
                  max-height="400"
                  hint="種別"
                  persistent-hint
                  multiple
                  :disabled="!editMode"
                ></v-select>
              </v-flex>
              <v-flex sm2 xs3>
                <v-select
                  dense
                  label="Select"
                  :items="types"
                  v-model="selectedTypes"
                  max-height="400"
                  hint="タイプ"
                  persistent-hint
                  multiple
                  :disabled="!editMode"
                ></v-select>
              </v-flex>
              <v-flex sm2 xs3>
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
              <v-flex sm3>
                <v-text-field
                  v-if="editMode && !isXs"
                  v-model="searchSkillName"
                  label="スキル名（絞り込み用）"
                  item-value="text"
                  :disabled="!editMode"
                ></v-text-field>
              </v-flex>
              <v-flex sm1>
                <v-btn
                  v-if="editMode && !isXs"
                  :disabled="!editMode"
                  @click.native="selectAll"
                  >{{ buttonLabel }}
                </v-btn>
              </v-flex>
              <v-toolbar floating dense v-if="isXs">
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
                  <v-btn slot="activator" icon @click.native="closeDialog">
                    <v-icon>fas fa-backward</v-icon>
                  </v-btn>
                  <span>機体作成・編集画面に戻ります。</span>
                </v-tooltip>
              </v-toolbar>
              <v-flex sm4 xs5>
                <v-layout style="max-height: 300px" class="scroll-y">
                  <v-radio-group
                    label="スキル"
                    v-model="selectedSkillName"
                    :mandatory="false"
                    :class="isXs ? 'small' : ''"
                  >
                    <v-radio
                      v-for="skill in skills"
                      :label="skill.name"
                      :value="skill.name"
                      :key="skill.name"
                      :disabled="!editMode"
                      class="caption"
                    ></v-radio>
                  </v-radio-group>
                </v-layout>
              </v-flex>
              <v-flex sm4 xs3>
                <v-list :dense="isXs" :two-line="isXs">
                  <v-list-tile v-if="!isXs" />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass"
                      >種別</v-list-tile-content
                    >
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass"
                      >タイプ</v-list-tile-content
                    >
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass"
                      >ランク</v-list-tile-content
                    >
                  </v-list-tile>
                  <v-divider />
                </v-list>
              </v-flex>
              <v-flex sm4 xs4>
                <v-list :dense="isXs" :two-line="isXs">
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
                    <v-list-tile-content :class="contentClass">{{
                      skill.classification
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass">{{
                      skill.type
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile>
                    <v-list-tile-content :class="contentClass">{{
                      skill.rank
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                </v-list>
              </v-flex>
              <v-flex xs12>
                <v-card-text class="body-1">
                  <span
                    style="white-space: pre-wrap;display: inline-block;height:30px;"
                    v-html="skill.effect"
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
import Skill from "@/model/embriomachine/skill";

export default {
  name: "SkillSelectorDialog",
  props: {
    //ダイアログ表示フラグ。
    showDialog: {
      type: Boolean,
      default: true
    },
    //編集対象の装備データ。未選択の場合はnullを指定。
    targetSkill: {
      type: Object,
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
      selectedSkillName: this.targetSkill.name,
      classifications: [
        Skill.CLASSIFICATION_CONTROL,
        Skill.CLASSIFICATION_COMMAND,
        Skill.CLASSIFICATION_KNOWLEGDE
      ],
      selectedClassifications: [Skill.CLASSIFICATION_CONTROL],
      types: [Skill.TYPE_TYPE_CONTINUOUS, Skill.TYPE_COMSUME],
      selectedTypes: [Skill.TYPE_COMSUME],
      ranks: ["S", "A", "B"],
      selectedRanks: ["B"],
      searchSkillName: "",
      buttonLabel: "全選択"
    };
  },

  watch: {
    targetSkill: function(val) {
      if (val && val.name) {
        this.selectedSkillName = val.name;
        this.selectedClassifications = [val.classification];
        this.selectedRanks = [val.rank];
        this.selectedTypes = [val.type];
        this.searchSkillName = "";
      } else {
        this.selectedSkillName = "";
      }
    },
    showDialog: function(val) {
      if (!val) {
        this.closeDialog();
      }
    }
  },

  computed: {
    skills() {
      return Skill.getSkills().filter(skill => {
        let retVal = true;
        retVal = this.selectedTypes.reduce((accumurator, type) => {
          if (!accumurator && skill.type !== type) {
            return false;
          } else {
            return true;
          }
        }, false);
        retVal =
          retVal &&
          this.selectedRanks.reduce((accumurator, rank) => {
            if (!accumurator && skill.rank !== rank) {
              return false;
            } else {
              return true;
            }
          }, false);
        retVal =
          retVal &&
          this.selectedClassifications.reduce((accumurator, edition) => {
            if (!accumurator && skill.classification !== edition) {
              return false;
            } else {
              return true;
            }
          }, false);

        if (this.searchSkillName !== "") {
          retVal = retVal && skill.name.includes(this.searchSkillName);
        }

        return retVal;
      });
    },

    skill() {
      let ret = new Skill();

      this.skills.forEach(item => {
        if (item.name === this.selectedSkillName) {
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
        this.selectedClassifications = this.classifications;
        this.selectedRanks = this.ranks;
        this.selectedTypes = this.types;
        this.buttonLabel = "全選択解除";
      } else {
        this.selectedClassifications = [Skill.CLASSIFICATION_CONTROL];
        this.selectedRanks = ["B"];
        this.selectedTypes = [Skill.TYPE_COMSUME];
        this.buttonLabel = "全選択";
      }
    },
    closeDialog() {
      this.$emit("update:showDialog", false);
      this.$emit("cancel");
    },
    select() {
      this.$emit("update:showDialog", false);
      this.$emit("select", this.skill);
    }
  }
};
</script>
