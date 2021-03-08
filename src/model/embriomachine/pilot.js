
import Skill from "@/model/embriomachine/skill";

export default class Pilot {
  constructor(name,skills) {
    // 名前
    this.name = name ? name : "";
    //
    this.skills = skills ? skills : [];
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

  getARankEquipmentCount(){
    return this.level;
  }

  validate(errors,pilotId) {
    if(this.skills.length > 2){
      errors.push(
        pilotId + "にスキルが3つ以上設定されています。大会ルールに準拠する場合、スキルは最大で2つまでしか設定できません。"
      );
    }

    const map = {}
    this.skills.forEach(skill=>{
      const skillNameForDuplicateCheck = skill.skillNameForDuplicateCheck
      if(!map[skillNameForDuplicateCheck]){
        map[skillNameForDuplicateCheck] = 1
      }else{
        map[skillNameForDuplicateCheck] ++
      }
    })

    Object.keys(map).forEach(key=>{
      if(map[key] > 1){
        errors.push(
          pilotId + "に同名のスキル " +key+"が複数設定されています。"
        )
      }
    })
    // const duplicated = this.skills.filter(item=>{
    //   return this.skills.indexOf(item) !== this.skills.lastIndexOf(item)
    // })
    // console.log(duplicated)
    // if(duplicated.length > 0){
    //   duplicated.forEach(item=>{
    //     errors.push(
    //       pilotId + "にスキル" +item+"が複数設定されています。"
    //     );
    //   })
    // }

    // const skillname = Array.from(new Set(this.skills.map(skill=>skill.name)))
    // console.log(skillname)
    
  }
}
