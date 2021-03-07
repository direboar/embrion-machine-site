export default class Skill {
  //種別：操縦
  static get CLASSIFICATION_CONTROL() {
    return "操縦";
  }
  //種別：指揮
  static get CLASSIFICATION_COMMAND() {
    return "指揮";
  }
  //種別：知識
  static get CLASSIFICATION_KNOWLEGDE() {
    return "知識";
  }
  //タイプ：常時
  static get TYPE_TYPE_CONTINUOUS() {
    return "常時";
  }
  //タイプ：消費
  static get TYPE_COMSUME() {
    return "消費";
  }

  constructor(name, rank, classification, type, effect) {
    // 名前
    this.name = name ? name : "";
    // ランク
    this.rank = rank ? rank : "B";
    // 種別
    this.classification = classification ? classification : "操縦";
    // タイプ
    this.type = type ? type : "常時";
    // 効果
    this.effect = effect ? effect : "";
  }

  static getSkills() {
    return Skill.assigns(Skill.json());
  }

  static assigns(array) {
    var retVal = [];
    array.forEach(obj => {
      const skill = new Skill();
      Object.assign(skill, obj);
      retVal.push(skill);
    });
    return retVal;
  }

  static json() {
    return [
      {
        name: "B_操縦_常時",
        rank: "B",
        classification: "操縦",
        type: "常時",
        effect: "111"
      },
      {
        name: "A_操縦_常時",
        rank: "A",
        classification: "操縦",
        type: "常時",
        effect: "111"
      },
      {
        name: "S_操縦_常時",
        rank: "S",
        classification: "操縦",
        type: "常時",
        effect: "111"
      },
      {
        name: "B_指揮_消費",
        rank: "B",
        classification: "指揮",
        type: "消費",
        effect: "111"
      },
      {
        name: "A_指揮_消費",
        rank: "A",
        classification: "指揮",
        type: "消費",
        effect: "111"
      },
      {
        name: "S_指揮_消費",
        rank: "S",
        classification: "指揮",
        type: "消費",
        effect: "111"
      },
      {
        name: "B_知識_常時",
        rank: "B",
        classification: "知識",
        type: "常時",
        effect: "111"
      },
      {
        name: "A_知識_常時",
        rank: "A",
        classification: "知識",
        type: "常時",
        effect: "111"
      },
      {
        name: "S_知識_常時",
        rank: "S",
        classification: "知識",
        type: "常時",
        effect: "111"
      }
    ];
  }
}
