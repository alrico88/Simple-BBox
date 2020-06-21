export default {
  methods: {
    notifyClipSuccess() {
      this.$notify({
        group: 'clipboard',
        title: 'Success',
        text: 'Copied to clipboard',
        type: 'success',
      });
    },
    notifyClipError(err) {
      this.$notify({
        group: 'clipboard',
        title: 'Error',
        text: `Error copying to clipboard ${err}`,
        type: 'danger',
      });
    },
  },
};
