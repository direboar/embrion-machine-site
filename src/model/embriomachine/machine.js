import MachineType from "@/model/embriomachine/machinetype";
import MountPosition from "@/model/embriomachine/mountposition";
import Equipment from "@/model/embriomachine/equipment";
import Pilot from "@/model/embriomachine/pilot";
import Skill from "@/model/embriomachine/skill";

export default class Machine {
  constructor(name, machineType) {
    // 名前
    this.name = name;
    // 移動力
    if (machineType === null || machineType === undefined) {
      this.machineType = null;
    } else {
      this.machineType = machineType;
    }
    // 装備
    this.equipments = {};
    this.equipments[MachineType.POSITION_HEAD] = [];
    this.equipments[MachineType.POSITION_BODY] = [];
    this.equipments[MachineType.POSITION_RIGHTARM] = [];
    this.equipments[MachineType.POSITION_LEFTARM] = [];
    this.equipments[MachineType.POSITION_RIGHTLEG] = [];
    this.equipments[MachineType.POSITION_LEFTLEG] = [];

    //自由記入欄
    this.memo = "";

    //パイロット
    this.pilots = [];
    this.pilots.push(new Pilot());
    this.pilots.push(new Pilot());
  }

  setLastUpdateTime(lastUpdateTime) {
    this.lastUpdateTime = lastUpdateTime;
  }

  getLastUpdateTime() {
    return this.lastUpdateTime;
  }

  setId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  setDetailId(detailId) {
    this.detailId = detailId;
  }

  getDetailId() {
    return this.detailId;
  }

  setUserIdAndUserName(userId, userName) {
    this.userId = userId;
    this.userName = userName;
  }

  setMemo(memo) {
    this.memo = memo;
  }

  addEquipment(position, equipment) {
    let equipments = this.equipments[position];
    if (equipments === undefined) {
      throw new Error("equipmentsが取得できない");
    }
    equipments.push(equipment);
  }

  deleteEquipment(position, equipment) {
    let index = this.equipments[position].indexOf(equipment);
    if (index >= 0) {
      this.equipments[position].splice(index, 1);
    }
  }

  getEquipment(position, index) {
    let equipments = this.equipments[position];
    if (equipments.length > index) {
      return equipments[index];
    }
    return new Equipment(""); //dummpy
  }

  getAllEquipment() {
    let ret = [];
    this.equipments[MachineType.POSITION_HEAD].forEach(e => {
      ret.push(e);
    });
    this.equipments[MachineType.POSITION_BODY].forEach(e => {
      ret.push(e);
    });
    this.equipments[MachineType.POSITION_RIGHTARM].forEach(e => {
      ret.push(e);
    });
    this.equipments[MachineType.POSITION_LEFTARM].forEach(e => {
      ret.push(e);
    });
    this.equipments[MachineType.POSITION_RIGHTLEG].forEach(e => {
      ret.push(e);
    });
    this.equipments[MachineType.POSITION_LEFTLEG].forEach(e => {
      ret.push(e);
    });
    return ret;
  }

  //武装種類で絞り込む
  getAllEquipmentOf(types) {
    let ret = this.getAllEquipment();
    ret = ret.filter(item => {
      return item.type.split("／").reduce((accumurator, current) => {
        return accumurator || types.includes(current);
      }, false);
    });
    return ret;
  }

  //firebaseに永続化する際のヘッダーオブジェクト（一覧検索用項目）に変換する。
  toRealtimeDatabaseHeaderObject() {
    return {
      name: this.name,
      lastUpdateTime: this.lastUpdateTime,
      userId: this.userId,
      userName: this.userName
    };
  }

  //firebaseに永続化する際のDetailオブジェクトに変換する。
  toRealtimeDatabaseDetailObject() {
    let equipments = {};
    equipments[MachineType.POSITION_HEAD] = [];
    equipments[MachineType.POSITION_BODY] = [];
    equipments[MachineType.POSITION_RIGHTARM] = [];
    equipments[MachineType.POSITION_LEFTARM] = [];
    equipments[MachineType.POSITION_RIGHTLEG] = [];
    equipments[MachineType.POSITION_LEFTLEG] = [];

    this.equipmentToRealtimeDatabaseObject(
      equipments,
      MachineType.POSITION_HEAD
    );
    this.equipmentToRealtimeDatabaseObject(
      equipments,
      MachineType.POSITION_BODY
    );
    this.equipmentToRealtimeDatabaseObject(
      equipments,
      MachineType.POSITION_RIGHTARM
    );
    this.equipmentToRealtimeDatabaseObject(
      equipments,
      MachineType.POSITION_LEFTARM
    );
    this.equipmentToRealtimeDatabaseObject(
      equipments,
      MachineType.POSITION_RIGHTLEG
    );
    this.equipmentToRealtimeDatabaseObject(
      equipments,
      MachineType.POSITION_LEFTLEG
    );
    const fbPilots = this.pilots.map(pilot => {
      return this.pilotToRealtimeDatabaseObject(pilot);
    });

    return {
      machineType: this.machineType !== null ? this.machineType.name : null,
      equipments: equipments,
      id: this.id, //headerのID。（detailからヘッダを検索する際に使用数r）,
      memo: this.memo,
      pilots: fbPilots
    };
  }

  //firebaseのオブジェクトから、エンティティに変化する。（headerのID、header,detailから復元）
  static fromRealtimeDatabaseToEntity(key, header, detailKey, detail) {
    let filtered = MachineType.getMachineTypes().filter(item => {
      return item.name === detail.machineType;
    });

    let machineType = null;
    if (filtered.length > 0) {
      machineType = filtered[0];
    }

    let machine = new Machine(header.name, machineType);
    machine.equipmentFromRealtimeDatabaseObject(
      detail,
      MachineType.POSITION_HEAD
    );
    machine.equipmentFromRealtimeDatabaseObject(
      detail,
      MachineType.POSITION_BODY
    );
    machine.equipmentFromRealtimeDatabaseObject(
      detail,
      MachineType.POSITION_RIGHTARM
    );
    machine.equipmentFromRealtimeDatabaseObject(
      detail,
      MachineType.POSITION_LEFTARM
    );
    machine.equipmentFromRealtimeDatabaseObject(
      detail,
      MachineType.POSITION_RIGHTLEG
    );
    machine.equipmentFromRealtimeDatabaseObject(
      detail,
      MachineType.POSITION_LEFTLEG
    );

    machine.setLastUpdateTime(new Date(header.lastUpdateTime));
    machine.setId(key);
    machine.setUserIdAndUserName(header.userId, header.userName);
    machine.setDetailId(detailKey);

    let memo = detail.memo;
    if (memo === undefined) {
      memo = "";
    }
    machine.setMemo(memo);

    let pilots = detail.pilots;
    machine.pilots = machine.pilotsFromRealtimeDatabaseObject(pilots);
    // if(!pilots){
    //   machine.pilots = [];
    //   machine.pilots.push(new Pilot())
    //   machine.pilots.push(new Pilot())
    // }else{
    //   //todo
    // }
    console.log(machine);
    return machine;
  }

  //firebaseのヘッダオブジェクトから、一覧表示用のオブジェクトに変換する。（headerのID、headerから復元）
  static fromRealtimeDatabaseToHeader(key, header) {
    // let key = childSnapshot.key;
    // let childData = childSnapshot.val();

    // childData.id = key;

    return {
      id: key,
      name: header.name,
      userName: header.userName,
      userId: header.userId,
      lastUpdateTime: new Date(header.lastUpdateTime),
      orderBy: header.orderBy
    };
  }

  equipmentFromRealtimeDatabaseObject(firebaseObject, positon) {
    let array = [];
    if (
      firebaseObject.equipments !== undefined &&
      firebaseObject.equipments[positon] !== undefined
    ) {
      firebaseObject.equipments[positon].forEach(item => {
        let filtered = Equipment.getEquipments().filter(equipment => {
          return item === equipment.name;
        });
        if (filtered.length > 0) {
          array.push(filtered[0]);
        }
      });
    }
    this.equipments[positon] = array;
  }

  pilotsFromRealtimeDatabaseObject(fbPilots) {
    if (!fbPilots) {
      const retVal = [];
      retVal.push(new Pilot());
      retVal.push(new Pilot());
      return retVal;
    } else {
      const retVal = fbPilots.map(pilot => {
        let skills = [];
        if (pilot.skills) {
          skills = pilot.skills.map(skillName => {
            const found = Skill.getSkills().find(item => {
              // console.log(`${item.name === skillName}`)
              return item.name === skillName;
            });
            return found;
          });
        } else {
          skills = [];
        }

        return new Pilot(pilot.name, skills);
      });
      console.log(retVal);
      return retVal;
    }
  }

  equipmentToRealtimeDatabaseObject(equipments, positon) {
    this.equipments[positon].forEach(item => {
      equipments[positon].push(item.name);
    });
  }

  pilotToRealtimeDatabaseObject(pilot) {
    const skills = pilot.skills.map(skill => {
      return skill.name;
    });
    return {
      name: pilot.name,
      skills: skills
    };
  }

  //  get orderBy(){
  //     return 9999999999999 - this.lastUpdateTime;
  //  }

  // //ソート用項目 更新時間の降順ソートとしたいが、realtime databaseの仕様上、降順ソートをサポートしていないための措置。
  static calcOrderBy(realtimeDatabaseObject) {
    return 9999999999999 - realtimeDatabaseObject.lastUpdateTime;
  }

  // １．装備合計数チェック
  // ２．装備の種類ごとに以下のチェック
  // ➀装備が指定された部位に装備されている
  // ➁装備の最低装備枚数を満たしている
  // ➁－１〇ではない場合：１か所の部位に裁定枚数が装備されている
  // ➁－２〇である場合：装備可能部位全体で最低枚数が装備されている
  // 枚数上限チェック
  // 特殊チェック
  // ・足各１
  // ・頭・胴各１
  // ・胴２or足各１

  validate() {
    let errors = [];
    //1.装備可能数合計チェック
    //各スロットごとのスロット上限を超えていないこと
    this.validateSlotSize(MachineType.POSITION_HEAD, errors);
    this.validateSlotSize(MachineType.POSITION_BODY, errors);
    this.validateSlotSize(MachineType.POSITION_LEFTARM, errors);
    this.validateSlotSize(MachineType.POSITION_RIGHTARM, errors);
    this.validateSlotSize(MachineType.POSITION_LEFTLEG, errors);
    this.validateSlotSize(MachineType.POSITION_RIGHTLEG, errors);

    //2.装備の種類ごとにチェック
    for (let equipmentPosition in this.equipments) {
      let equipments = this.equipments[equipmentPosition];

      equipments.forEach(equipment => {
        let machineEquipmentPositions = MountPosition.toMachineEquipmentPosition(
          equipment.mountPosition
        );
        //2-1.装備品の装備可能部位から、装備可能なポジションのリストを取得し、装備可能な位置に装備しているかをチェック。
        if (!equipment.canEquip(equipmentPosition)) {
          errors.push(
            equipment.name + "は" + equipmentPosition + "には装備できません。"
          );
        }

        //2-2.装備の最低装備枚数を満たしている
        if (
          equipment.equipSamePosition &&
          !this.reducedByBarretteTube(equipment)
        ) {
          //2-2-1.〇ではない場合、もしくは対象の装備がバレットチューブと同じ部位に装備されている場合：１か所の部位に裁定枚数が装備されている
          //現在装備している部位の、該当装備品の数をカウントする。
          //その際、弾薬の補正処理を含める。
          if (
            !this.checkEquipmentCountOfConsideringAmmunitions(
              [equipmentPosition],
              equipment,
              equipment.minLimit
            )
          ) {
            errors.push(
              equipment.name +
                "は" +
                equipmentPosition +
                "に" +
                equipment.minLimit +
                "個以上装備しなければなりません。"
            );
          }
        } else {
          //2-2-2.〇である場合：装備可能部位全体で最低枚数が装備されている
          //その際、弾薬の補正処理を含める。（実際は弾薬補正がかかることはないが、念のため実装している）
          if (
            !this.checkEquipmentCountOfConsideringAmmunitions(
              machineEquipmentPositions,
              equipment,
              equipment.minLimit
            )
          ) {
            errors.push(
              equipment.name +
                "は" +
                machineEquipmentPositions.join() +
                "に合計で" +
                equipment.minLimit +
                "個以上装備しなければなりません。"
            );
          }
        }

        //枚数上限チェック
        let totalCount = this.getEquipmentCount(equipment);
        if (totalCount > equipment.maxLimit) {
          errors.push(
            equipment.name +
              "は" +
              equipment.maxLimit +
              "個以上装備できません。"
          );
        }

        //3.特殊チェック
        //脚各１
        if (equipment.mountPosition === MountPosition.LEG_EACH_ONE) {
          let rightLegCount = this.getEquipmentCountOf(
            [MachineType.POSITION_RIGHTLEG],
            equipment
          );
          let leftLegCount = this.getEquipmentCountOf(
            [MachineType.POSITION_LEFTLEG],
            equipment
          );
          if (rightLegCount !== leftLegCount) {
            errors.push(
              equipment.name +
                "は" +
                machineEquipmentPositions.join() +
                "にそれぞれ一つずつ装備しなければなりません。"
            );
          }
        }
        //胴２or脚各１
        if (
          equipment.mountPosition === MountPosition.BODY_TWO_OR_LEG_EACH_ONE
        ) {
          let bodyCount = this.getEquipmentCountOf(
            [MachineType.POSITION_BODY],
            equipment
          );
          let rightLegCount = this.getEquipmentCountOf(
            [MachineType.POSITION_RIGHTLEG],
            equipment
          );
          let leftLegCount = this.getEquipmentCountOf(
            [MachineType.POSITION_LEFTLEG],
            equipment
          );

          let isError = false;
          if (bodyCount % 2 !== 0) {
            isError = true;
          }
          if (rightLegCount !== leftLegCount) {
            isError = true;
          }
          if (isError) {
            errors.push(
              equipment.name +
                "は" +
                MachineType.POSITION_BODY +
                "に２つ、もしくは" +
                MachineType.POSITION_RIGHTLEG +
                "," +
                MachineType.POSITION_LEFTLEG +
                "にそれぞれ一つずつ装備しなければなりません。"
            );
          }
        }
        //頭１＆胴１
        if (equipment.mountPosition === MountPosition.HEAD_AND_BODY_EACH_ONE) {
          let headCount = this.getEquipmentCountOf(
            [MachineType.POSITION_HEAD],
            equipment
          );
          let bodyCount = this.getEquipmentCountOf(
            [MachineType.POSITION_BODY],
            equipment
          );
          if (headCount !== bodyCount) {
            errors.push(
              equipment.name +
                "は" +
                machineEquipmentPositions.join() +
                "にそれぞれ一つずつ装備しなければなりません。"
            );
          }
        }

        //腕1（ロケットパンチ、有線ロケットパンチは同じ腕に装備できない）
        if (equipment.mountPosition === MountPosition.ARM_ONE_ROCKETPANCH) {
          let leftArmRocketPanchCount = this.equipments[
            MachineType.POSITION_LEFTARM
          ].filter(equipment => equipment.name.indexOf("ロケットパンチ") >= 0)
            .length;
          let rightArmRocketPanchCount = this.equipments[
            MachineType.POSITION_RIGHTARM
          ].filter(equipment => equipment.name.indexOf("ロケットパンチ") >= 0)
            .length;
          if (leftArmRocketPanchCount >= 2 || rightArmRocketPanchCount >= 2) {
            errors.push(
              equipment.name +
                "の装備方法が間違っています。ロケットパンチは同じ腕に装備できません。"
            );
          }
        }
        //胴1＋全部位
        if (equipment.mountPosition === MountPosition.BODY_ONE_AND_ALL) {
          let bodyCount = this.getEquipmentCountOf(
            [MachineType.POSITION_BODY],
            equipment
          );
          if (bodyCount === 0) {
            errors.push(
              equipment.name + "は胴に１つ装備しなければいけません。"
            );
          }
        }

        //胴１のみ
        if (equipment.mountPosition === MountPosition.BODY_ONE_ONLY) {
          let bodyCount = this.getEquipmentCountOf(
            [MachineType.POSITION_BODY],
            equipment
          );
          if (bodyCount > 1) {
            errors.push(equipment.name + "は胴に１つしか装備できません。");
          }
        }

        //軽装甲ｘ＆全部位
        if (
          equipment.mountPosition === MountPosition.MIDDLE_OR_HEAVEY_AND_ALL
        ) {
          if (this.machineType !== null && this.machineType.weight === "軽") {
            errors.push(equipment.name + "は軽装甲の機体では装備できません。");
          }
        }
        //腕各１
        if (equipment.mountPosition === MountPosition.ARM_EACH_ONE) {
          let rightLegCount = this.getEquipmentCountOf(
            [MachineType.POSITION_RIGHTARM],
            equipment
          );
          let leftLegCount = this.getEquipmentCountOf(
            [MachineType.POSITION_LEFTARM],
            equipment
          );
          if (rightLegCount !== leftLegCount) {
            errors.push(
              equipment.name +
                "は" +
                machineEquipmentPositions.join() +
                "にそれぞれ一つずつ装備しなければなりません。"
            );
          }
        }

        //腕各１まで おそらく実装不要
        if (equipment.mountPosition === MountPosition.ARM_EACH_ONE_OR_ZERO) {
          let rightArmCount = this.getEquipmentCountOf(
            [MachineType.POSITION_RIGHTARM],
            equipment
          );
          let leftArmCount = this.getEquipmentCountOf(
            [MachineType.POSITION_LEFTARM],
            equipment
          );
          if (rightArmCount > 1 || leftArmCount > 1) {
            errors.push(
              equipment.name + "は、右腕・左腕に最大で1つまでしか装備できません"
            );
          }
        }

        //頭１＆胴２
        if (equipment.mountPosition === MountPosition.HEAD_ONE_AND_BODY_TWO) {
          let headCount = this.getEquipmentCountOf(
            [MachineType.POSITION_HEAD],
            equipment
          );
          let bodyCount = this.getEquipmentCountOf(
            [MachineType.POSITION_BODY],
            equipment
          );
          if (headCount * 2 !== bodyCount) {
            errors.push(
              equipment.name + "は頭に１つ、胴に2つ装備しなければなりません。"
            );
          }
        }
        //頭１ or 胴１ おそらく実装不要
        // if (equipment.mountPosition === MountPosition.HEAD_ONE_OR_BODY_ONE) {
        //   //FIXME 未実装
        // }

        //複座ｘ＆胴
        if (equipment.mountPosition === MountPosition.SINGLE_SEAT_ONLY_BODY) {
          if (this.machineType !== null && this.machineType.hasDoubleSeat) {
            errors.push(equipment.name + "は複座の機体では装備できません。");
          }
        }

        //軽装甲×＆胴１のみ
        if (
          equipment.mountPosition ===
          MountPosition.MIDDLE_OR_HEAVEY_AND_BODY_ONE_ONLY
        ) {
          if (this.machineType !== null && this.machineType.weight === "軽") {
            errors.push(equipment.name + "は軽装甲の機体では装備できません。");
          }
        }

        //腕＋全部位
        if (equipment.mountPosition === MountPosition.ARM_AND_ALL) {
          let armCount = this.getEquipmentCountOf(
            [MachineType.POSITION_RIGHTARM, MachineType.POSITION_LEFTARM],
            equipment
          );
          console.log(armCount);
          if (armCount === 0) {
            errors.push(equipment.name + "は腕に装備する必要があります。");
          }
        }
      });
    }

    //3.pilotのチェック
    this.validatePilot(errors);

    //弾薬を、ロケットやミサイルと交換で装備しなかった場合を検出する。
    //弾薬が二重計上されていないかをチェックする。
    // this.validateAmmunition("ドリルミサイル弾薬","ミサイル",errors);
    // this.validateAmmunition("硫酸ロケット弾薬","ロケット",errors);

    //メッセージの重複を削除して返却
    //see https://qiita.com/cocottejs/items/7afe6d5f27ee7c36c61f
    return errors.filter((elem, index, array) => array.indexOf(elem) === index);
  }

  validatePilot(errors) {
    this.pilots[0].validate(errors, "パイロット１");
    if (this.machineType && this.machineType.hasDoubleSeat) {
      this.pilots[1].validate(errors, "パイロット２");
    }
  }

  /**
   * 指定した装備が、バレットチューブにより装備の制約が軽減されている（〇扱いになっている）かをチェックする。
   * @param {*} targetEquipment
   * @memberof Machine
   */
  reducedByBarretteTube(targetEquipment) {
    let reducedEquipments = [];
    let barretteTube = Equipment.findByName("バレットチューブ");

    for (let equipmentPosition in this.equipments) {
      if (this.getEquipmentCountOf(equipmentPosition, barretteTube) > 0) {
        reducedEquipments = reducedEquipments.concat(
          this.equipments[equipmentPosition]
        );
      }
    }

    return reducedEquipments.find(elem => {
      return elem.name === targetEquipment.name;
    });
  }

  /**
   * 指定した装備個所（配列指定）の装備数を取得し、最低枚数の条件を満たしているかをチェックする。その際、弾薬の考慮を行う。
   * 仕様：
   *  装備数が、指定した最低枚数の等倍であることをチェックする。
   *
   * @param {*} targetEquipmentPositions 装備個所
   * @param {*} targetEquipment 装備（指定なしの場合は、装備かかわらずカウントする）
   * @param {*} minLimit 最低枚数
   * @returns
   * @memberof Machine
   */
  checkEquipmentCountOfConsideringAmmunitions(
    targetEquipmentPositions,
    targetEquipment,
    minLimit
  ) {
    let count = this.getEquipmentCountOf(
      targetEquipmentPositions,
      targetEquipment
    );
    if (count >= minLimit) {
      return true;
    } else {
      return false;
    }
  }

  //指定したポジションのスロット上限チェックを行います。
  validateSlotSize(machineTypePosition, errors) {
    let alreadyEquipmentCount = this.getEquipmentCountOf([machineTypePosition]);
    if (alreadyEquipmentCount > this.getSlot(machineTypePosition)) {
      errors.push(machineTypePosition + "のスロット合計以上装備しています。");
    }
  }

  //全ての装備個所の装備数を取得する。
  //第１引数：装備（指定なしの場合は、装備かかわらずカウントする）
  getEquipmentCount(targetEquipment) {
    return this.getEquipmentCountOf(
      MountPosition.toMachineEquipmentPosition(MountPosition.ALL),
      targetEquipment
    );
  }

  /**
   * 現在の機体が、Aランク装備数枠をいくつ使用しているかを返却する。
   * ・Aランク装備数をカウント
   * ・Sランク装備数は２倍でカウント
   * ・複座とする場合は、Aランク装備数２とカウントする。
   */
  getARankEquipmentCount() {
    let total = this.getEquipmentCountByRank("A");
    total += this.getEquipmentCountByRank("S") * 2;
    //複座とする場合は、Aランク装備数２とカウントする。
    if (this.machineType != null && this.machineType.hasDoubleSeat) {
      total += 2;
    }

    //パイロットのランクを計算する
    if (this.machineType && this.machineType.hasDoubleSeat) {
      this.pilots.forEach(pilot => {
        total += pilot.getARankEquipmentCount();
      });
    } else {
      total += this.pilots[0].getARankEquipmentCount();
    }
    return total;
  }

  /**
   * 指定したランクの武装の種類をカウントする。
   *
   * getARankEquipmentCountとは異なり、指定されたランクに一致する武装のカウントのみを行う。
   * カウントの仕様は、Aランク大会仕様に従う。
   * ・装備数が、最小装備数を満たすごとに種類が１増える
   * ・最大装備数が２の場合、装備数３の場合は２とカウントする。
   * @param {*} rank
   */
  getEquipmentCountByRank(rank) {
    let allEquipments = [];

    //指定したランクに絞り込み、allEquipmentsに集約。
    for (let equipmentPosition in this.equipments) {
      let filtere = this.equipments[equipmentPosition].filter(
        equipments => equipments.rank === rank
      );
      allEquipments = allEquipments.concat(filtere);
    }

    //装備毎に、装備数を集計。
    let groupBy = allEquipments.reduce((ret, current) => {
      let val = ret.find(element => {
        return element.equipment.name === current.name;
      });
      if (val === undefined) {
        ret.push({
          equipment: current,
          count: 1
        });
      } else {
        val.count++;
      }
      return ret;
    }, []);

    let total = 0;
    groupBy.forEach(val => {
      //装備不足分を計算し、弾薬の装備で補填する。
      let lack = val.count % val.equipment.minLimit;

      //装備数を、最低枚数で割る。
      total += Math.ceil(val.count / val.equipment.minLimit);
    });

    return total;
  }

  isEquipDoubleBinder() {
    const equipDoubleBinder = this.getAllEquipment().filter(
      equipment => equipment.name === "ダブルバインダー"
    ).length;
    return equipDoubleBinder > 0;
  }

  getSlot(position) {
    if (position === MachineType.POSITION_BODY) {
      if (this.isEquipDoubleBinder()) {
        return this.machineType.getSlot(position, 2);
      } else {
        return this.machineType.getSlot(position);
      }
    } else {
      return this.machineType.getSlot(position);
    }
  }

  //ArmorPointへの補正値を指定可能。
  get armorPoint() {
    if (this.isEquipDoubleBinder()) {
      return this.machineType.getArmorPoint(-2);
    } else {
      return this.machineType.getArmorPoint();
    }
  }

  //ArmorPointへの補正値を指定可能。
  get constitution() {
    if (this.isEquipDoubleBinder()) {
      return this.machineType.getConstitution(-2, 2);
    } else {
      return this.machineType.getConstitution();
    }
  }

  //回避値への補正値を指定可能。
  get evadeRate() {
    let retVal = this.machineType.evadeRate;
    const equipChip = this.getAllEquipment().filter(
      equipment => equipment.name === "姿勢制御チップ"
    ).length;

    if (equipChip > 0) {
      retVal++;
    }
    return retVal;
  }

  //突撃ダメージ
  get chargeDamage() {
    if (this.isEquipDoubleBinder()) {
      return this.machineType.getChargeDamage(-2);
    } else {
      return this.machineType.getChargeDamage();
    }
  }

  //非突撃ダメージ
  get coveredChargeDamage() {
    if (this.isEquipDoubleBinder()) {
      return this.machineType.getCoveredChargeDamage(-2);
    } else {
      return this.machineType.getCoveredChargeDamage();
    }
  }

  // get bodySlot(){
  //   const equipDoubleBinder = this.getAllEquipment().filter(
  //     equipment => equipment.name === "ダブルバインダー"
  //   ).length;
  //   if(equipDoubleBinder > 0){
  //     return this.machineType.bodySlot + 2
  //   }else{
  //     return this.machineType.bodySlot
  //   }
  // }

  //指定した装備個所（配列指定）の装備数を取得する。
  //第一引数：装備個所
  //第二引数：装備（指定なしの場合は、装備かかわらずカウントする）
  getEquipmentCountOf(targetEquipmentPositions, targetEquipment) {
    let ret = 0;
    for (let equipmentPosition in this.equipments) {
      if (targetEquipmentPositions.indexOf(equipmentPosition) > -1) {
        if (targetEquipment == null) {
          ret += this.equipments[equipmentPosition].length;
        } else {
          ret += this.equipments[equipmentPosition].filter(
            equipments => equipments.name === targetEquipment.name
          ).length;
        }
      }
    }
    return ret;
  }

  /** 機体の情報をテキストで出力する*/
  toText() {
    const text = `装甲重量：${this.machineType.weight} サイズ： ${
      this.machineType.size
    } ${this.machineType.hasDoubleSeat ? "複座" : "単座"} 移動値：${
      this.machineType.movility
    } 
回t
val retVal = this.machineType.evadeRate;
return retValhis.machineType.evadeRate} 
装甲値：${this.armorPoint} 耐久値：${this.machineType.constitution}
イニシアチブ：${this.machineType.initiative} 突撃値：${
      this.machineType.chargeDamage
    } 被突撃値：${this.machineType.coveredChargeDamage}

デッキ
突撃：${this.machineType.chargeCount}  照準：１
頭（スロット${this.getSlot(MachineType.POSITION_HEAD)}）
${this.getEquepmentTextOf(MachineType.POSITION_HEAD)}
胴（スロット${this.getSlot(MachineType.POSITION_BODY)}）
${this.getEquepmentTextOf(MachineType.POSITION_BODY)}
右腕（スロット${this.getSlot(MachineType.POSITION_RIGHTARM)}）
${this.getEquepmentTextOf(MachineType.POSITION_RIGHTARM)}
左腕（スロット${this.getSlot(MachineType.POSITION_LEFTARM)}）
${this.getEquepmentTextOf(MachineType.POSITION_LEFTARM)}
右脚（スロット${this.getSlot(MachineType.POSITION_RIGHTLEG)}）
${this.getEquepmentTextOf(MachineType.POSITION_RIGHTLEG)}
左脚（スロット${this.getSlot(MachineType.POSITION_LEFTLEG)}）
${this.getEquepmentTextOf(MachineType.POSITION_LEFTLEG)}
`;
    return text;
  }

  getEquepmentTextOf(position) {
    const equipments = this.equipments[position];

    // const summary = {
    //   type : null,
    //   count : 0
    // }
    const summary = equipments.reduce((accumurator, equipment) => {
      if (accumurator[equipment.name]) {
        accumurator[equipment.name]++;
      } else {
        accumurator[equipment.name] = 1;
      }
      return accumurator;
    }, {});

    const keys = Object.keys(summary);
    return keys.reduce((accumurator, key) => {
      return `${accumurator}${key} : ${summary[key]} `;
    }, "");
  }

  static assign(obj) {
    let machine = new Machine();
    Object.assign(machine, obj);

    let machineType = new MachineType();
    Object.assign(machineType, obj.machineType);
    machine.machineType = machineType;

    machine.equipments[MachineType.POSITION_HEAD] = Equipment.assigns(
      machine.equipments[MachineType.POSITION_HEAD]
    );
    machine.equipments[MachineType.POSITION_BODY] = Equipment.assigns(
      machine.equipments[MachineType.POSITION_BODY]
    );
    machine.equipments[MachineType.POSITION_RIGHTARM] = Equipment.assigns(
      machine.equipments[MachineType.POSITION_RIGHTARM]
    );
    machine.equipments[MachineType.POSITION_LEFTARM] = Equipment.assigns(
      machine.equipments[MachineType.POSITION_LEFTARM]
    );
    machine.equipments[MachineType.POSITION_RIGHTLEG] = Equipment.assigns(
      machine.equipments[MachineType.POSITION_RIGHTLEG]
    );
    machine.equipments[MachineType.POSITION_LEFTLEG] = Equipment.assigns(
      machine.equipments[MachineType.POSITION_LEFTLEG]
    );
    return machine;
  }

  //**Machineインスタンスを生成するヘルパーメソッド */
  // オブジェクトの配列を指定し、Spellsインスタンスの配列に変換する。
  static assigns(array) {
    var retVal = [];
    array.forEach(obj => {
      retVal.push(Machine.assign(obj));
    });
    return retVal;
  }
}
