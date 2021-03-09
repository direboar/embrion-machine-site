<template>
  <div>
    <v-dialog
      v-model="showDialog"
      max-width="1400"
      :persistent="true"
      :fullscreen="isXs"
    >
      <v-card>
        <v-layout row wrap>
          <v-flex xl3 md4 sm6 xs6>
            <v-card>
              <v-toolbar color="grey darken-1" dark dense>
                <v-toolbar-title>基本データ</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar floating dense>
                  <v-btn flat value="center" @click.native="drowCards">
                    <span>Next Round</span>
                    <v-icon>fas fa-forward</v-icon>
                  </v-btn>
                </v-toolbar>
              </v-toolbar>
              <v-layout row wrap>
                <v-flex xs8>
                  <v-list :dense="isXs" two-line subheader>
                    <v-list-tile>
                      <v-list-tile-content>回避値</v-list-tile-content>
                    </v-list-tile>
                    <v-divider />
                    <v-list-tile>
                      <v-list-tile-content
                        >カード総数（補助パーツを除く）</v-list-tile-content
                      >
                    </v-list-tile>
                    <v-divider />
                    <v-list-tile>
                      <v-list-tile-content>現在の山札枚数</v-list-tile-content>
                    </v-list-tile>
                    <v-divider />
                    <v-list-tile>
                      <v-list-tile-content>ラウンド数</v-list-tile-content>
                    </v-list-tile>
                    <v-divider />
                    <v-list-tile>
                      <v-list-tile-content
                        >山札をシャッフルした回数</v-list-tile-content
                      >
                    </v-list-tile>
                    <v-divider />
                  </v-list>
                </v-flex>
                <v-flex xs4>
                  <v-list :dense="isXs" two-line subheader>
                    <v-list-tile>
                      <v-list-tile-content class="subheaders">{{
                        deck.evadeRate
                      }}</v-list-tile-content>
                    </v-list-tile>
                    <v-divider />
                    <v-list-tile>
                      <v-list-tile-content class="subheaders">{{
                        deck.cards.length
                      }}</v-list-tile-content>
                    </v-list-tile>
                    <v-divider />
                    <v-list-tile>
                      <v-list-tile-content class="subheaders">{{
                        deck.deck.length
                      }}</v-list-tile-content>
                    </v-list-tile>
                    <v-divider />
                    <v-list-tile>
                      <v-list-tile-content class="subheaders">{{
                        deck.drowCardCount
                      }}</v-list-tile-content>
                    </v-list-tile>
                    <v-divider />
                    <v-list-tile>
                      <v-list-tile-content class="subheaders">{{
                        deck.shuffleCount
                      }}</v-list-tile-content>
                    </v-list-tile>
                    <v-divider />
                  </v-list>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex xl9 md8 sm6 xs6>
            <v-card>
              <v-toolbar color="grey darken-1" dark dense>
                <v-toolbar-title>現在の手札</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click.native="closeDialig">
                  <v-icon>fas fa-window-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-list :dense="isXs" two-line subheader>
                <v-list-tile v-for="(card, index) in cards" :key="index">
                  <v-list-tile-content></v-list-tile-content>
                  <v-list-tile-content class="subheaders">{{
                    card.name
                  }}</v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn
                      color="grey darken-4"
                      flat
                      @click.native="showEquipmentViewDialog(card.equipment)"
                      :disabled="card.equipment === undefined"
                    >
                      <v-icon>zoom_in</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
      <equipment-seletor-dialog
        :show-dialog.sync="showEquipment"
        :targetEquipment="dialogEquipment"
        :editMode.sync="equipmentDialogEditMode"
      />
    </v-dialog>
  </div>
</template>

<style></style>

<script>
import EquipmentSeletorDialog from "@/components/embriomachine/EquipmentSeletorDialog";
import Deck from "@/model/embriomachine/deck";

export default {
  name: "CardSimulationPanel",
  components: {
    EquipmentSeletorDialog: EquipmentSeletorDialog
  },
  props: {
    showDialog: true,
    machine: null
  },
  data() {
    return {
      showEquipment: false,
      deck: new Deck(),
      cards: [],
      dialogEquipment: {},
      equipmentDialogEditMode: false,

      user: null
    };
  },

  beforeMount() {},

  watch: {
    showDialog(val) {
      if (val) {
        //for test.
        this.deck = new Deck();
        this.deck.addEquipments(this.machine.getAllEquipment());
        this.deck.setMovility(this.machine.machineType.movility);
        this.deck.setArmor(this.machine.armorPoint);
        this.deck.setSize(this.machine.machineType.size);
        this.deck.setEvadeRate(this.machine.evadeRate);
      }
    }
  },

  computed: {
    isXs() {
      return this.$vuetify.breakpoint.name === "xs";
    }
  },

  methods: {
    drowCards() {
      this.cards = this.deck.drowCards();
    },

    //装備表示
    showEquipmentViewDialog(equipment) {
      this.dialogEquipment = equipment;
      this.equipmentDialogEditMode = false;
      this.showEquipment = true;
    },
    closeDialig() {
      this.cards = [];
      this.$emit("update:showDialog", false);
    }
  }
};
</script>
