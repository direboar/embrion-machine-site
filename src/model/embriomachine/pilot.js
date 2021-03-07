
import Skill from "@/model/embriomachine/skill";

export default class Pilot {
  constructor(name) {
    // 名前
    this.name = name ? name : "（未登録）";
    //
    this.skills = [];
    this.skills.push(new Skill("B_操縦_常時","B","操縦","常時","1111"));
    this.skills.push(new Skill("A_操縦_常時","A","操縦","常時","2222"));

  }

  addSkill(skill) {
    this.skills.push(skill);
  }

  deleteSkill(skill) {
    let index = this.skills.indexOf(skill);
    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  get level() {
    return this.skills.reduce((acc, cur) => {
      if (cur.rank === "A") {
        acc = acc + 1;
      }
      if (cur.rank === "S") {
        acc = acc + 2;
      }
      return acc;
    },0);
  }
}
