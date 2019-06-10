<template>
  <div>
    <v-dialog
      v-model="showDialog"
      max-width="1400"
      :persistent="true"
    >

      <v-card>
        <v-toolbar
          color="grey darken-1"
          dark
          dense
        >
          <v-toolbar-title>射程毎ダメージ表（横軸：距離　値：各距離でのダメージ）</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click.native="closeDialig"
          >
            <v-icon>fas fa-window-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :items="equipments"
          hide-actions
          class="elevation-1"
        >
          <template
            slot="items"
            slot-scope="props"
          >
            <td class="text-xs-left">{{ props.item.name }}
              <v-btn
                color="grey darken-4"
                flat
                @click.native="showEquipmentViewDialog(props.item)"
              >
                <v-icon>zoom_in</v-icon>
              </v-btn>
            </td>
            <td :class="tableStyle(props.item.calcDamage(1))">{{ props.item.calcDamage(1) }}</td>
            <td :class="tableStyle(props.item.calcDamage(2))">{{ props.item.calcDamage(2) }}</td>
            <td :class="tableStyle(props.item.calcDamage(3))">{{ props.item.calcDamage(3) }}</td>
            <td :class="tableStyle(props.item.calcDamage(4))">{{ props.item.calcDamage(4) }}</td>
            <td :class="tableStyle(props.item.calcDamage(5))">{{ props.item.calcDamage(5) }}</td>
            <td :class="tableStyle(props.item.calcDamage(6))">{{ props.item.calcDamage(6) }}</td>
            <td :class="tableStyle(props.item.calcDamage(7))">{{ props.item.calcDamage(7) }}</td>
            <td :class="tableStyle(props.item.calcDamage(8))">{{ props.item.calcDamage(8) }}</td>
            <td :class="tableStyle(props.item.calcDamage(9))">{{ props.item.calcDamage(9) }}</td>
            <td :class="tableStyle(props.item.calcDamage(10))">{{ props.item.calcDamage(10) }}</td>
            <td :class="tableStyle(props.item.calcDamage(11))">{{ props.item.calcDamage(11) }}</td>
            <td :class="tableStyle(props.item.calcDamage(12))">{{ props.item.calcDamage(12) }}</td>
            <td :class="tableStyle(props.item.calcDamage(13))">{{ props.item.calcDamage(13) }}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <equipment-seletor-dialog
      :show-dialog.sync="showEquipment"
      :targetEquipment="dialogEquipment"
      :editMode.sync="equipmentDialogEditMode"
      @cancel="cancelEquipmentDialog"
    />
  </div>
</template>

<style>
/* フォーカス表示するテーブルセル */
td.focus {
  background-color: #e27272;
}
/* テーブル全体のフォントサイズ設定 */
table.v-table tbody td {
  font-size: 18px !important;
}
table.v-table thead th {
  font-size: 18px !important;
}
</style>

<script>
import EquipmentSeletorDialog from "@/components/embriomachine/EquipmentSeletorDialog";
import Equipment from "@/model/embriomachine/equipment";

export default {
  name: "DamageRangeAnalizePanel",
  components: {
    EquipmentSeletorDialog: EquipmentSeletorDialog
  },
  props: {
    showDialog: false,
    machine: null
  },
  data() {
    return {
      headers: [
        { text: "装備名", width: "10%", sortable: false },
        { text: "1", value: "1", width: "1%", sortable: false },
        { text: "2", value: "2", width: "1%", sortable: false },
        { text: "3", value: "3", width: "1%", sortable: false },
        { text: "4", value: "4", width: "1%", sortable: false },
        { text: "5", value: "5", width: "1%", sortable: false },
        { text: "6", value: "6", width: "1%", sortable: false },
        { text: "7", value: "7", width: "1%", sortable: false },
        { text: "8", value: "8", width: "1%", sortable: false },
        { text: "9", value: "9", width: "1%", sortable: false },
        { text: "10", value: "10", width: "1%", sortable: false },
        { text: "11", value: "11", width: "1%", sortable: false },
        { text: "12", value: "12", width: "1%", sortable: false },
        { text: "13", value: "13", width: "1%", sortable: false }
      ],
      equipments: [],
      showEquipment: false,
      dialogEquipment: {},
      equipmentDialogEditMode: false
    };
  },

  watch: {
    showDialog(val) {
      if (val) {
        this.equipments = this.machine.getAllEquipmentOf([
          Equipment.TYPE_SHAGEKI,
          Equipment.TYPE_HAKUHEI
        ]);
      }
    }
  },

  methods: {
    closeDialig() {
      this.equipments = [];
      this.$emit("update:showDialog", false);
    },
    //装備表示
    showEquipmentViewDialog(equipment) {
      this.dialogEquipment = equipment;
      this.equipmentDialogEditMode = false;
      this.showEquipment = true;
    },
    cancelEquipmentDialog() {
      this.dialogEquipment = null;
    },
    tableStyle(damage) {
      let retVal = ["text-xs-left"];
      if (damage > 0) {
        retVal.push("focus");
      }
      return retVal;
    }
  }
};
</script>
