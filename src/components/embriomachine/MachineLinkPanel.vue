<template>
  <machine-construct-panel
    :targetMachine.sync="machine"
    :editMode="false"
    v-if="show"
    @cancel="cancel"
  />

</template>

<style>
</style>

<script>
import FirebaseStorage from "@/model/embriomachine/FirebaseStorage";
import MachineConstructPanel from "@/components/embriomachine/MachineConstructPanel";
import Machine from "@/model/embriomachine/machine";

export default {
  name: "MachineLinkPanel",

  components: {
    MachineConstructPanel
  },

  data() {
    return {
      id: this.$route.params["id"],
      storage: new FirebaseStorage(),
      machine: new Machine(),
      show: false
    };
  },

  created() {
    this.storage.getMachineHeaderAndDetail(
      this.id,
      machine => {
        this.machine = machine;
        this.show = true;
      },
      e => {
        alert(e);
      }
    );
  },

  methods: {
    cancel() {
      this.$router.push({ name: "MachineList" });
    }
  }
};
</script>
