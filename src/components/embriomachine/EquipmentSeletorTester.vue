<template>
  <div>
    {{ equipmentName }} / {{ machineTypeName }}
    <v-layout row>
      <v-flex xs12>
        <v-btn color="green darken-1" flat @click.native="showEquipmentDialog"
          >装備選択ダイアログ表示</v-btn
        >
        <v-btn color="green darken-1" flat @click.native="showMachineTypeDialog"
          >装甲・サイズ選択ダイアログ表示</v-btn
        >
        <v-btn color="green darken-1" flat @click.native="showSimulation = true"
          >シミュレーションダイアログ表示</v-btn
        >
        <v-btn
          color="green darken-1"
          flat
          @click.native="showDamageRangeAnalize"
          >ダメージ分析ダイアログ表示</v-btn
        >
        <v-btn color="green darken-1" flat @click.native="showSkillDialog"
          >スキル選択ダイアログ表示</v-btn
        >
      </v-flex>
    </v-layout>
    <equipment-seletor-dialog
      :show-dialog.sync="showEquipment"
      :targetEquipment.sync="dialogEquipment"
      :targetPosition.sync="targetPosition"
      @select="acceptSelectedEquipment"
      @cancel="cancel"
    />
    <machine-type-selector-dialog
      :show-dialog.sync="showMachineType"
      :targetMachineType.sync="dialogMachineType"
      @select="acceptMachineType"
      @cancel="cancel"
    />
    <card-simulation-panel :show-dialog.sync="showSimulation" />
    <damage-range-analize-panel
      :show-dialog.sync="showDamageRangeAnalizePanel"
      :machine="machine"
    />
    <skill-selector-dialog
      :show-dialog.sync="showSkill"
      :targetSkill.sync="dialogSkill"
      @select="acceptSelectSkill"
      @cancel="cancel"
    />
  </div>
</template>

<style></style>

<script>
import EquipmentSeletorDialog from "@/components/embriomachine/EquipmentSeletorDialog";
import MachineTypeSelectorDialog from "@/components/embriomachine/MachineTypeSelectorDialog";
import CardSimulationPanel from "@/components/embriomachine/CardSimulationPanel";
import DamageRangeAnalizePanel from "@/components/embriomachine/DamageRangeAnalizePanel";
import SkillSelectorDialog from "@/components/embriomachine/SkillSelectorDialog";
import Machine from "@/model/embriomachine/machine";
import MachineType from "@/model/embriomachine/machinetype";
import Equipment from "@/model/embriomachine/equipment";
import MountPosition from "@/model/embriomachine/mountposition";

export default {
  components: {
    EquipmentSeletorDialog: EquipmentSeletorDialog,
    MachineTypeSelectorDialog: MachineTypeSelectorDialog,
    CardSimulationPanel: CardSimulationPanel,
    DamageRangeAnalizePanel: DamageRangeAnalizePanel,
    SkillSelectorDialog: SkillSelectorDialog
  },

  data() {
    return {
      showEquipment: false,
      showMachineType: false,
      showSimulation: false,
      showDamageRangeAnalizePanel: false,
      showSkill: false,
      equipment: {},
      dialogEquipment: {},
      machineType: {},
      dialogMachineType: {},
      skill: {},
      targetPosition: "胴",
      machine: null,
      dialogSkill: {}
    };
  },

  computed: {
    equipmentName() {
      if (this.equipment === null) {
        return "-";
      } else {
        return this.equipment.name;
      }
    },
    machineTypeName() {
      if (this.machineType === null) {
        return "-";
      } else {
        return this.machineType.name;
      }
    }
  },

  methods: {
    showEquipmentDialog() {
      this.dialogEquipment = this.equipment;
      this.showEquipment = true;
    },
    showSkillDialog() {
      alert("xxx");
      this.dialogSkill = this.skill;
      this.showSkill = true;
    },
    showMachineTypeDialog() {
      this.dialogMachineType = this.machineType;
      this.showMachineType = true;
    },
    acceptSelectedEquipment() {
      this.equipment = this.dialogEquipment;
    },
    acceptMachineType() {
      this.machineType = this.dialogMachineType;
    },
    acceptSelectSkill(select) {
      this.skill = select;
    },
    showDamageRangeAnalize() {
      let testMachineType = new MachineType(
        "xx",
        "5",
        "6",
        "3",
        "21",
        "7",
        3,
        3,
        3,
        3,
        3,
        3
      );
      let testEqyionent = new Equipment(
        "パルスレーザー",
        "A",
        "射撃武器",
        "③～⑤",
        2,
        3,
        "N",
        "4",
        "射撃",
        MountPosition.ARM,
        2,
        true,
        "",
        99
      );
      this.machine = new Machine("name", testMachineType);
      this.machine.addEquipment(MachineType.POSITION_LEFTARM, testEqyionent);

      this.showDamageRangeAnalizePanel = true;
    },
    cancel() {}
  }
};
</script>
