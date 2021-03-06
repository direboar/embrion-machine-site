import MachineType from "@/model/embriomachine/machinetype";

export default class MountPosition {
  //全部位
  static get ALL() {
    return "全部位";
  }
  //腕
  static get ARM() {
    return "腕";
  }
  //脚
  static get LEG() {
    return "脚";
  }
  //胴
  static get BODY() {
    return "胴";
  }
  //腕・脚
  static get ARM_OR_LEG() {
    return "腕・脚";
  }
  //脚各１
  static get LEG_EACH_ONE() {
    return "脚各１";
  }
  //頭×
  static get WITHOUT_HEAD() {
    return "頭×";
  }
  //胴２or脚各１
  static get BODY_TWO_OR_LEG_EACH_ONE() {
    return "胴２ or 脚各１";
  }
  //頭１＆胴１
  static get HEAD_AND_BODY_EACH_ONE() {
    return "頭１＆胴１";
  }
  //胴1＋全部位
  static get BODY_ONE_AND_ALL() {
    return "胴１＋全部位";
  }
  //腕1（ロケットパンチ、有線ロケットパンチは同じ腕に装備できない）
  static get ARM_ONE_ROCKETPANCH() {
    return "腕各１のみ（ロケットパンチ）";
  }
  //脚腕各１
  static get ARM_EACH_ONE() {
    return "腕各１";
  }

  //ミサイル武装と入替

  //ロケット武装と入替

  //胴１のみ
  static get BODY_ONE_ONLY() {
    return "胴１のみ";
  }
  //脚×
  static get WITHOUT_LEG() {
    return "脚×";
  }
  //軽装甲×＆全部位
  static get MIDDLE_OR_HEAVEY_AND_ALL() {
    return "軽装甲×＆全部位";
  }
  //頭
  static get HEAD_ONLY() {
    return "頭";
  }
  //装備数上限なし
  static get INFINITY() {
    return 99;
  }

  //gifted対応
  static get ARM_EACH_ONE_OR_ZERO() {
    return "腕各１まで";
  }
  static get HEAD_ONE_AND_BODY_TWO() {
    return "頭１＆胴２";
  }
  static get HEAD_ONE_OR_BODY_ONE() {
    return "頭１ or 胴１";
  }
  static get SINGLE_SEAT_ONLY_BODY() {
    return "複座ｘ＆胴";
  }
  static get MIDDLE_OR_HEAVEY_AND_BODY_ONE_ONLY() {
    return "軽装甲×＆胴１のみ";
  }
  static get ARM_AND_ALL() {
    return "腕＋全部位";
  }

  //マシンの装備可能位置リストに変換する。
  static toMachineEquipmentPosition(mountPosition) {
    if (mountPosition === MountPosition.ALL) {
      return [
        MachineType.POSITION_HEAD,
        MachineType.POSITION_BODY,
        MachineType.POSITION_LEFTARM,
        MachineType.POSITION_RIGHTARM,
        MachineType.POSITION_LEFTLEG,
        MachineType.POSITION_RIGHTLEG
      ];
    }
    if (mountPosition === MountPosition.ARM) {
      return [MachineType.POSITION_LEFTARM, MachineType.POSITION_RIGHTARM];
    }
    if (mountPosition === MountPosition.BODY) {
      return [MachineType.POSITION_BODY];
    }
    if (mountPosition === MountPosition.LEG) {
      return [MachineType.POSITION_LEFTLEG, MachineType.POSITION_RIGHTLEG];
    }
    if (mountPosition === MountPosition.ARM_OR_LEG) {
      let ret = MountPosition.toMachineEquipmentPosition(MountPosition.ARM);
      ret = ret.concat(
        MountPosition.toMachineEquipmentPosition(MountPosition.LEG)
      );
      return ret;
    }
    if (mountPosition === MountPosition.WITHOUT_HEAD) {
      let ret = MountPosition.toMachineEquipmentPosition(MountPosition.ALL);
      ret.splice(ret.indexOf(MachineType.POSITION_HEAD), 1);
      return ret;
    }
    if (mountPosition === MountPosition.LEG_EACH_ONE) {
      return MountPosition.toMachineEquipmentPosition(MountPosition.LEG);
    }
    if (mountPosition === MountPosition.BODY_TWO_OR_LEG_EACH_ONE) {
      return [
        MachineType.POSITION_BODY,
        MachineType.POSITION_LEFTLEG,
        MachineType.POSITION_RIGHTLEG
      ];
    }
    if (mountPosition === MountPosition.HEAD_AND_BODY_EACH_ONE) {
      return [MachineType.POSITION_HEAD, MachineType.POSITION_BODY];
    }
    if (mountPosition === MountPosition.ARM_ONE_ROCKETPANCH) {
      return MountPosition.toMachineEquipmentPosition(MountPosition.ARM);
    }
    if (mountPosition === MountPosition.ARM_EACH_ONE) {
      return MountPosition.toMachineEquipmentPosition(MountPosition.ARM);
    }
    if (mountPosition === MountPosition.BODY_ONE_ONLY) {
      return MountPosition.toMachineEquipmentPosition(MountPosition.BODY);
    }
    if (mountPosition === MountPosition.HEAD_ONLY) {
      return [MachineType.POSITION_HEAD];
    }
    if (mountPosition === MountPosition.WITHOUT_LEG) {
      let ret = MountPosition.toMachineEquipmentPosition(MountPosition.ALL);
      ret.splice(ret.indexOf(MachineType.POSITION_LEFTLEG), 1);
      ret.splice(ret.indexOf(MachineType.POSITION_RIGHTLEG), 1);
      return ret;
    }
    if (mountPosition === MountPosition.MIDDLE_OR_HEAVEY_AND_ALL) {
      return MountPosition.toMachineEquipmentPosition(MountPosition.ALL);
    }
    if (mountPosition === MountPosition.BODY_ONE_AND_ALL) {
      return MountPosition.toMachineEquipmentPosition(MountPosition.ALL);
    }
    //gifted
    if (mountPosition === MountPosition.ARM_EACH_ONE_OR_ZERO) {
      return MountPosition.toMachineEquipmentPosition(MountPosition.ARM);
    }
    if (mountPosition === MountPosition.HEAD_ONE_AND_BODY_TWO) {
      return [MachineType.POSITION_HEAD, MachineType.POSITION_BODY];
    }
    if (mountPosition === MountPosition.HEAD_ONE_OR_BODY_ONE) {
      return [MachineType.POSITION_HEAD, MachineType.POSITION_BODY];
    }
    if (mountPosition === MountPosition.SINGLE_SEAT_ONLY_BODY) {
      return MountPosition.toMachineEquipmentPosition(MountPosition.BODY);
    }
    if (mountPosition === MountPosition.MIDDLE_OR_HEAVEY_AND_BODY_ONE_ONLY) {
      return MountPosition.toMachineEquipmentPosition(MountPosition.BODY);
    }
    if (mountPosition === MountPosition.ARM_AND_ALL) {
      return MountPosition.toMachineEquipmentPosition(MountPosition.ALL);
    }
      
    return [];
  }
}
