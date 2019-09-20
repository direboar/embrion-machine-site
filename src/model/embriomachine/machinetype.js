
import _ from "lodash";

export default class MachineType {
    //頭
    static get POSITION_HEAD(){
      return "頭";
    }
    //胴
    static get POSITION_BODY(){
      return "胴";
    }
    //右腕
    static get POSITION_RIGHTARM(){
      return "右腕";
    }
    //左腕
    static get POSITION_LEFTARM(){
      return "左腕";
    }
    //右脚
    static get POSITION_RIGHTLEG(){
      return "右脚";
    }
    //左脚
    static get POSITION_LEFTLEG(){
      return "左脚";
    }
    
    static getPositionConst(){
      return {
        POSITION_HEAD : MachineType.POSITION_HEAD,
        POSITION_BODY : MachineType.POSITION_BODY,
        POSITION_RIGHTARM : MachineType.POSITION_RIGHTARM,
        POSITION_LEFTARM : MachineType.POSITION_LEFTARM,
        POSITION_RIGHTLEG : MachineType.POSITION_RIGHTLEG,
        POSITION_LEFTLEG : MachineType.POSITION_LEFTLEG
      }
    }

  constructor(weight,size,hasDoubleSeat,baseMovility,baseEvadeRate,initiative,headSlot,bodySlot,leftArmSlot,rightArmSlot,leftLegSlot,rightLegSlot) {
    // // 名前
    // this.name = name
    // 重量
    this.weight = weight
    // サイズ
    this.size = size
    // 複座かどうか
    this.hasDoubleSeat = hasDoubleSeat
    // 移動力
    this.baseMovility = baseMovility
    // 回避値
    this.baseEvadeRate = baseEvadeRate
    // イニシアチブ
    this.initiative = initiative

    this.slots = {};
    // // スロット（頭）
    this.slots[MachineType.POSITION_HEAD]=headSlot
    // スロット（胴）
    this.slots[MachineType.POSITION_BODY]=bodySlot
    // スロット（右腕）
    this.slots[MachineType.POSITION_RIGHTARM]=leftArmSlot
    // スロット（左腕）
    this.slots[MachineType.POSITION_LEFTARM]=rightArmSlot
    // スロット（右足）
    this.slots[MachineType.POSITION_RIGHTLEG]=leftLegSlot
    // スロット（左足）
    this.slots[MachineType.POSITION_LEFTLEG]=rightLegSlot
  }

  getSlot(position){
    if(position === MachineType.POSITION_HEAD || position === MachineType.POSITION_BODY){
      return this.hasDoubleSeat ? this.slots[position] + 1 : this.slots[position];
    }else{
      return this.slots[position];
    }
  }

  getTotalSlot(){
    let ret = 0;
    for(let slot in this.slots){
      ret += this.slots[slot];
    }
    return ret;
  }
 
  get headSlot(){
    return this.getSlot(MachineType.POSITION_HEAD);
  }

  get bodySlot(){
    return this.getSlot(MachineType.POSITION_BODY)
  }

  get rightArmSlot(){
    return this.getSlot(MachineType.POSITION_RIGHTARM)
  }

  get leftArmSlot(){
    return this.getSlot(MachineType.POSITION_LEFTARM)
  }

  get rightLegSlot(){
    return this.getSlot(MachineType.POSITION_RIGHTLEG)
  }

  get leftLegSlot(){
    return this.getSlot(MachineType.POSITION_LEFTLEG)
  }

  get evadeRate(){
    if(this.hasDoubleSeat){
      return this.weight === "軽" ? this.baseEvadeRate+1 : this.baseEvadeRate+2;
    }else{
      return this.baseEvadeRate;
    }
  }

  get movility(){
    if(this.hasDoubleSeat){
      let retVal = this.weight === "軽" ? this.baseMovility-2  : this.baseMovility-1;
      return Math.max(retVal,2);
    }else{
      return this.baseMovility;
    }
  }

  get armorPoint(){
    let retVal = 0;
    if(this.weight === "中") {
      retVal = this.hasDoubleSeat ? 2 : 3;
    }else if(this.weight === "重") {
      retVal = this.hasDoubleSeat ? 5 : 6;
    }
    return retVal;
  }

  get constitution(){
    let retVal = this.movility + this.getTotalSlot() + this.armorPoint + 1;//照準、射撃
    //突撃
    if(this.size === "LL"){
      retVal +=2;
    }else{
      retVal +=1;
    }
    return retVal;
  }

  //突撃ダメージ
  get chargeDamage(){
    if(this.constitution === undefined || this.constitution === 0){
      return "";
    }else{
      return Math.ceil(this.constitution / 4);
    }
  }
  
  //非突撃ダメージ
  get coveredChargeDamage(){
    if(this.constitution === undefined || this.constitution === 0){
      return "";
    }else{
      return Math.ceil(this.constitution / 10);
    }
  }

  static getDefaultMachineType(){
    return MachineType.getMachineTypes()[0];
  }

  // /**
  //  * 機体種類選択ダイアログに表示する機体種類名のリストを生成する。
  //  * @static
  //  * @returns
  //  * @memberof MachineType
  //  */
  // static getMachineTypeNamesForDialog(){
  //   return MachineType.getMachineTypes().
  //           filter(machine => !machine.hasDoubleSeat).
  //           map(machine => machine.name);
  // }

  get name(){
    let name = MachineType.getNameOf(this);
    if(this.hasDoubleSeat){
      name +="(複座)"
    }
    return name;
  }

  //重量・サイズのプロパティを抽出する。
  toWeightAndSize(){
    return _.pick(this, "weight", "size")
  }
  
  //選択可能なマシンタイプの、重量・サイズのリストを取得する。
  static getWeightAndSize(){
    alert
    return MachineType.getMachineTypes()
        .filter(machine => !machine.hasDoubleSeat)
        .map(machine => machine.toWeightAndSize());
  }

  static getNameOf(weightAndSize){
    return weightAndSize.weight + "・サイズ" + weightAndSize.size;
  }

  //選択可能なマシンタイプを取得する
  static getMachineTypes(){
    let ret = []

    ret.push(new MachineType("軽","SS",false,7,10,1,1,1,2,2,1,1))
    ret.push(new MachineType("軽","S",false,7,9,2,1,2,2,2,1,1))
    ret.push(new MachineType("軽","M",false,6,8,3,1,2,2,2,2,2))
    ret.push(new MachineType("軽","L",false,5,7,6,1,2,3,3,2,2))
    ret.push(new MachineType("軽","LL",false,4,7,10,2,2,3,3,2,2))

    ret.push(new MachineType("中","SS",false,6,8,4,1,1,2,2,1,1))
    ret.push(new MachineType("中","S",false,6,7,5,1,2,2,2,1,1))
    ret.push(new MachineType("中","M",false,5,6,7,1,2,2,2,2,2))
    ret.push(new MachineType("中","L",false,4,5,11,1,2,3,3,2,2))
    ret.push(new MachineType("中","LL",false,3,5,13,2,2,3,3,2,2))

    ret.push(new MachineType("重","SS",false,5,6,8,1,1,2,2,1,1))
    ret.push(new MachineType("重","S",false,5,5,9,1,2,2,2,1,1))
    ret.push(new MachineType("重","M",false,4,4,12,1,2,2,2,2,2))
    ret.push(new MachineType("重","L",false,3,3,14,1,2,3,3,2,2))
    ret.push(new MachineType("重","LL",false,2,3,15,2,2,3,3,2,2))

    ret.push(new MachineType("軽","SS",true,7,10,1,1,1,2,2,1,1))
    ret.push(new MachineType("軽","S",true,7,9,2,1,2,2,2,1,1))
    ret.push(new MachineType("軽","M",true,6,8,3,1,2,2,2,2,2))
    ret.push(new MachineType("軽","L",true,5,7,6,1,2,3,3,2,2))
    ret.push(new MachineType("軽","LL",true,4,7,10,2,2,3,3,2,2))

    ret.push(new MachineType("中","SS",true,6,8,4,1,1,2,2,1,1))
    ret.push(new MachineType("中","S",true,6,7,5,1,2,2,2,1,1))
    ret.push(new MachineType("中","M",true,5,6,7,1,2,2,2,2,2))
    ret.push(new MachineType("中","L",true,4,5,11,1,2,3,3,2,2))
    ret.push(new MachineType("中","LL",true,3,5,13,2,2,3,3,2,2))

    ret.push(new MachineType("重","SS",true,5,6,8,1,1,2,2,1,1))
    ret.push(new MachineType("重","S",true,5,5,9,1,2,2,2,1,1))
    ret.push(new MachineType("重","M",true,4,4,12,1,2,2,2,2,2))
    ret.push(new MachineType("重","L",true,3,3,14,1,2,3,3,2,2))
    ret.push(new MachineType("重","LL",true,2,3,15,2,2,3,3,2,2))


    return ret;
  }

}
