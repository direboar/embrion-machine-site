<!--
  ファイルをダウンロードできるボタンです。
　ダウンロードするデータは、dataにバインドしてください。
  -->
<template>
  <div>
    <v-tooltip top>
      <v-btn
        icon
        small
        slot="activator"
        @click="download"
        :disabled="disabled"
      >
        <v-icon>{{ this.icon }}</v-icon>
      </v-btn>
      <span>{{ tooltip }}</span>
    </v-tooltip>
    <a
      href="#"
      ref="downloadlink"
      class="display : none"
    ></a>
  </div>
</template>

<style></style>

<script>
export default {
  props: {
    tooltip: {
      type: String,
      default: "ファイルダウンロード"
    },
    data: {
      type: Function
    },
    dataPromise: {
      type: Function
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    fileName: {
      type: String,
      required: false,
      default: null
    },
    icon: {
      type: String,
      required: false,
      default: "file_download"
    }
  },
  methods: {
    download() {
      //https://developer.mozilla.org/ja/docs/Web/API/Blob
      //https://stackoverflow.com/questions/30694453/blob-createobjecturl-download-not-working-in-firefox-but-works-when-debugging 隠しリンクを作ってonClickでダウンロード
      if (this.data) {
        this.doDownload(this.data());
      } else if (this.dataPromise) {
        console.log(this.dataPromise);
        this.dataPromise()
          .then(data => {
            this.doDownload(data);
          })
          .catch(error => {
            window.console.errr(error);
          });
      }
    },
    doDownload(data) {
      const blob = new Blob([data], {
        type: "application/octet-stream;charset=UTF-8;"
      });
      let downloadlink = this.$refs.downloadlink;
      downloadlink.href = URL.createObjectURL(blob);
      if (this.fileName) {
        downloadlink.download = this.fileName;
      }
      downloadlink.click();
    }
  }
};
</script>
