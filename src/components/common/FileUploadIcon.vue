<!--
  ファイルをアップロードできるボタンです。
　取得したファイルは、onFileReadイベントで取得してください。
  -->
<template>
  <div>
    <v-tooltip top>
      <v-btn
        icon
        small
        slot="activator"
        @click="onClick"
        :disabled="disabled"
      >
        <v-icon>{{icon}}</v-icon>
      </v-btn>
      <span>{{tooltip}}</span>
    </v-tooltip>
    <input
      ref="fileUploadForm"
      type="file"
      style="display: none;"
      :key="fileId"
      @change="uploaded"
    />
  </div>
</template>

<style>
</style>

<script>
export default {
  props: {
    tooltip: {
      tooltip: String,
      default: "ファイルをアップロードします"
    },
    icon: {
      tooltip: String,
      default: "file_upload"
    },
    disabled: {
      tooltip: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileId: 0
    };
  },
  methods: {
    onClick() {
      let fileUploadForm = this.$refs.fileUploadForm;
      fileUploadForm.click();
      //Vue.jsで<input type="file">をリセットするバッドノウハウ
      //同じファイルを二回アップロードできないため。とりあえず動いてる。
      //@see https://qiita.com/kroton/items/2ea67e1a05eb68403750
    },
    uploaded(e) {
      let files = e.target.files;
      this.$emit("onFileRead", files);
      this.fileId++;
    }
  }
};
</script>