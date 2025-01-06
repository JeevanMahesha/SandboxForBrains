var Main = {
  data() {
    return {
      freeze: false,
      rolling: false,
      wheelDeg: 0,
      prizeNumber: 9,
      score:[],
      prizeListOrigin: [
      {
        name: "1" },
      {
        name: "2" },
      {
        name: "3" },
      {
        name: "4" },
      {
        name: "5" },
      {
        name: "6" },
      {
        name: "7" },
      {
        name: "8" },
      {
        name: "9" }
    ] };
  },
  computed: {
    prizeList() {
      return this.prizeListOrigin.slice(0, this.prizeNumber);
    } },

  methods: {
    onClickRotate() {
      if (this.rolling) {
        return;
      }
      const result = Math.floor(Math.random() * this.prizeList.length);
      this.roll(result);
    },
    roll(result) {
      this.rolling = true;
      const { wheelDeg, prizeList } = this;
      this.wheelDeg =
      wheelDeg -
      wheelDeg % 360 +
      6 * 360 + (
      360 - 360 / prizeList.length * result);
      setTimeout(() => {
        values = prizeList[result].name;
        this.rolling = false;
        this.score.push({Result:values});
        //alert("Result：" + prizeList[result].name);
      }, 4500);      
    } },

  watch: {
    prizeNumber() {
      this.freeze = true;
      this.wheelDeg = 0;
      setTimeout(() => {
        this.freeze = false;
      }, 0);
    } } };


var App = Vue.extend(Main);
new App().$mount("#app");