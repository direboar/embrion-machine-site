// import abilityType from './abilityType'
import MountPosition from '@/model/embriomachine/mountposition';
// import { isRegExp } from 'util';

export default class Equipment {
  //射程の定義（p.9)
  //有効射程（記載された射程内にしかダメージが入らない）
  static get RANGE_NORMAL() {
    return "N";
  }
  //最適射程A（➀など。１マス離れるたびに-1ダメージ）
  static get RANGE_OPTIMISTATION_A() {
    return "A";
  }
  //最適射程B（❶など。１マス離れるたびに-2ダメージ）
  static get RANGE_OPTIMISTATION_B() {
    return "B";
  }

  //種別
  static get TYPE_SHAGEKI() {
    return "射撃";
  }
  static get TYPE_HAKUHEI() {
    return "白兵";
  }
  static get TYPE_SHAGEKI_HAKUHEI() {
    return "射撃／白兵";
  }
  static get TYPE_KIRAI() {
    return "機雷";
  }
  static get TYPE_SOUKOU() {
    return "装甲";
  }
  static get TYPE_HOJO() {
    return "補助";
  }
  static get TYPE_TOTSUGEKI() {
    return "突撃";
  }
  static get TYPE_IDOU() {
    return "移動";
  }
  static get TYPE_SONOTA() {
    return "その他";
  }

  constructor(name, rank, type, range, minRange, maxRange, rangeType, damage, damageType, mountPosition, minLimit, equipSamePosition, effect, maxLimit,edition) {
    // 名前
    this.name = name
    // ランク S,A,B
    this.rank = rank
    // 種別 射撃、白兵、機雷、その他、補助 「／」区切りで複数保有可能。
    this.type = type
    // // 射程 1,3～4,➀～➁,➍～➏ 「／」区切りで複数保有可能。
    this.range = range;
    // 計算用に持つ最小・最大射程 「／」区切りで複数保有可能。
    this.minRange = minRange;
    this.maxRange = maxRange;
    // 射程タイプ（有効射程、最適射程A、最適射程B) 「／」区切りで複数保有可能。
    this.rangeType = rangeType
    // ダメージ 「／」区切りで複数保有可能。
    this.damage = damage
    // ダメージタイプ 「／」区切りで複数保有可能。
    this.damageType = damageType
    // 搭載可能部位
    this.mountPosition = mountPosition
    // 最低枚数
    this.minLimit = minLimit
    // 同じ部位に装備する必要があるか
    this.equipSamePosition = equipSamePosition
    // 効果
    this.effect = effect
    // （上限）枚数
    this.maxLimit = maxLimit
    //  対象のカードが含まれているエディション。基本、玉座
    this.edition = edition;
  }

  get formatMinLimit() {
    if (this.equipSamePosition) {
      return this.minLimit;
    } else {
      //FIXME とりあえず３まで対応
      if (this.minLimit === 1) {
        return "①";
      }
      if (this.minLimit === 2) {
        return "②";
      }
      if (this.minLimit === 3) {
        return "③";
      }
      if (this.minLimit === 4) {
        return "④";
      } else {
        return this.minLimit;
      }
    }
  }

  //画面に表示するデフォルトの装備数を算出。
  //同じ部位に装備する必要がない場合は１とする。
  calcDefaultItemCount() {
    //FIXME ダミーオブジェクトの場合（minLimit定義なしで判断）はから文字を返す。
    //いまいちなので修正したい。
    if (this.minLimit === undefined) {
      return "";
    }

    if (this.equipSamePosition === true) {
      return this.minLimit;
    } else {
      return 1;
    }
  }

  //指定した部位に装備できるかを判定する。
  canEquip(equipmentPosition) {
    //2-1.装備品の装備可能部位から、装備可能なポジションのリストを取得し、装備可能な位置に装備しているかをチェック。
    let machineEquipmentPositions = MountPosition.toMachineEquipmentPosition(this.mountPosition);
    if (machineEquipmentPositions.indexOf(equipmentPosition) < 0) {
      return false;
    }
    return true;
  }

  //指定したRangeにおけるダメージを算出する
  calcDamage(range) {
    let types = this.type.split("／");
      //単一ダメージ種別の場合
    if(types.length === 0){
      return this.doCalcDamage(this.minRange,this.maxRange,this.rangeType,this.damage,range)
    }else{
      //複数種別のダメージがある場合
      let minRanges = this.minRange.split("／");
      let maxRanges = this.maxRange.split("／");
      let rangeTypes = this.rangeType.split("／");
      let damages = this.damage.split("／");

      let one = this.doCalcDamage(minRanges[0],maxRanges[0],rangeTypes[0],damages[0],range)
      let two = this.doCalcDamage(minRanges[1],maxRanges[1],rangeTypes[1],damages[1],range)

      return Math.max(one,two)
    }
  }

  doCalcDamage(minRange,maxRange,rangeType,damage,range,) {
    if (minRange === 0 || maxRange === 0) {
      return 0;
    } else {
      if (minRange <= range && range <= maxRange) {
        return damage;
      } else {
        if (rangeType === Equipment.RANGE_NORMAL) {
          return 0;
        } else {
          let diffMinRange = Math.abs(minRange - range);
          let diffMaxRange = Math.abs(maxRange - range);
          let maxDiff = Math.min(diffMinRange, diffMaxRange);

          let retVal;
          if (rangeType === Equipment.RANGE_OPTIMISTATION_A) {
            retVal = damage - maxDiff;
          } else {
            retVal = damage - maxDiff * 2;
          }
          return retVal > 0 ? retVal : 0;
        }
      }
    }
  }

  /**
   * 指定した種別の武器であることを判定する。
   *
   * @param {*} type
   * @returns
   * @memberof Equipment
   */
  isTypeOf(type) {
    //1.射撃かつ白兵が「射撃／白兵」と渡される可能性があるので、文字列で一致判定
    if(this.type === type){
      return true;
    }else{
      //射撃かつ白兵が登場したため、武器種別は複数保有する可能性があるので、区切り文字（／）で分割して判定する。
      let types = this.type.split("／");
      return types.find(t => t === type) !== undefined;
    }
  }

  //選択可能な装備を取得する
  static getEquipments() {
    return Equipment.assigns(Equipment.json());
  }

  /**
   * 指定した名前で装備を検索する。
   *
   * @static
   * @param {装備名} equipmentName
   * @returns 名前が一致する装備。
   * @memberof Equipment
   */
  static findByName(equipmentName){
    let filtered = Equipment.getEquipments().filter((equipment)=>{return equipment.name === equipmentName})
    return filtered.length > 0 ? filtered[0] : null;
  }

  static assigns(array) {
    var retVal = [];
    array.forEach(obj => {
      var equipment = new Equipment()
      Object.assign(equipment, obj);
      retVal.push(equipment);
    });
    return retVal;

  }

  static json() {
    return [{
        "name": "スモールレーザー",
        "rank": "B",
        "type": "射撃",
        "range": "②～③",
        "minRange": "2",
        "maxRange": "3",
        "rangeType": "A",
        "damage": "2",
        "damageType": "射撃・レーザー",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 4,
        "edition" : "基本"
      },
      {
        "name": "ミドルレーザー",
        "rank": "B",
        "type": "射撃",
        "range": "③～④",
        "minRange": "3",
        "maxRange": "4",
        "rangeType": "A",
        "damage": "3",
        "damageType": "射撃・レーザー",
        "mountPosition": "頭×",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "",
        "maxLimit": 13,
        "edition" : "基本"
      },
      {
        "name": "ラージレーザー",
        "rank": "B",
        "type": "射撃",
        "range": "④～⑤",
        "minRange": "4",
        "maxRange": "5",
        "rangeType": "A",
        "damage": "3",
        "damageType": "射撃・レーザー",
        "mountPosition": "頭×",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "",
        "maxLimit": 10,
        "edition" : "基本"
      },
      {
        "name": "バルカン",
        "rank": "B",
        "type": "射撃",
        "range": "②",
        "minRange": "2",
        "maxRange": "2",
        "rangeType": "A",
        "damage": "2",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "移動タイミングの開始時に射撃できる。<br/>命中した場合、この武装は破壊される。",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "マシンガン",
        "rank": "B",
        "type": "射撃",
        "range": "②～④",
        "minRange": "2",
        "maxRange": "4",
        "rangeType": "A",
        "damage": "3",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 6,
        "edition" : "基本"
      },
      {
        "name": "ガトリングガン",
        "rank": "B",
        "type": "射撃",
        "range": "③～⑤",
        "minRange": "3",
        "maxRange": "5",
        "rangeType": "A",
        "damage": "3",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 6,
        "edition" : "基本"
      },
      {
        "name": "スナイパーライフル",
        "rank": "B",
        "type": "射撃",
        "range": "⑨～⑪",
        "minRange": "9",
        "maxRange": "11",
        "rangeType": "A",
        "damage": "3",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 5,
        "edition" : "基本"
      },
      {
        "name": "短距離ミサイル",
        "rank": "B",
        "type": "射撃",
        "range": "❺～❻",
        "minRange": "5",
        "maxRange": "6",
        "rangeType": "B",
        "damage": "3",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "射線が通っていなくても射撃できる",
        "maxLimit": 9,
        "edition" : "基本"
      },
      {
        "name": "長距離ミサイル",
        "rank": "B",
        "type": "射撃",
        "range": "❽～❾",
        "minRange": "8",
        "maxRange": "9",
        "rangeType": "B",
        "damage": "3",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "射線が通っていなくても射撃できる",
        "maxLimit": 7,
        "edition" : "基本"
      },
      {
        "name": "ロケット砲",
        "rank": "B",
        "type": "射撃",
        "range": "6～8",
        "minRange": "6",
        "maxRange": "8",
        "rangeType": "N",
        "damage": "4",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 7,
        "edition" : "基本"
      },
      {
        "name": "アンカー",
        "rank": "B",
        "type": "射撃",
        "range": "1～3",
        "minRange": "1",
        "maxRange": "3",
        "rangeType": "N",
        "damage": "0",
        "damageType": "射撃",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "射撃の前に機体の向きを変更できる。<br/>対象を自機の正面に移動させる。その際、対象の向きは変わらない。",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "クロー",
        "rank": "B",
        "type": "白兵",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "2",
        "damageType": "白兵",
        "mountPosition": "腕・脚",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "（ダメージ適用前）対象の手札または補助、プロットエリアに種別「装甲」のカードがある場合、対象はそのうち２枚を選択し、破壊する。",
        "maxLimit": 3,
        "edition" : "基本"
      },
      {
        "name": "ブレード",
        "rank": "B",
        "type": "白兵",
        "range": "1～2",
        "minRange": "1",
        "maxRange": "2",
        "rangeType": "N",
        "damage": "3",
        "damageType": "白兵",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "ランス",
        "rank": "B",
        "type": "白兵",
        "range": "2～3",
        "minRange": "2",
        "maxRange": "3",
        "rangeType": "N",
        "damage": "3",
        "damageType": "白兵",
        "mountPosition": "腕",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "アクス",
        "rank": "B",
        "type": "白兵",
        "range": "2",
        "minRange": "2",
        "maxRange": "2",
        "rangeType": "N",
        "damage": "4",
        "damageType": "白兵",
        "mountPosition": "腕",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "メイス",
        "rank": "B",
        "type": "白兵",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "4",
        "damageType": "白兵",
        "mountPosition": "腕",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "ヒートソード",
        "rank": "B",
        "type": "白兵",
        "range": "1～2",
        "minRange": "1",
        "maxRange": "2",
        "rangeType": "N",
        "damage": "3",
        "damageType": "白兵・レーザー",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "(ダメージ適用後)対象は山札を２枚オープンし、誘爆チェックを行う。",
        "maxLimit": 6,
        "edition" : "基本"
      },
      {
        "name": "パイルバンカー",
        "rank": "B",
        "type": "白兵",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "6",
        "damageType": "白兵・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "命中した場合、この武器は破壊される",
        "maxLimit": 4,
        "edition" : "基本"
      },
      {
        "name": "陸上機雷",
        "rank": "B",
        "type": "機雷",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "N",
        "damage": "3",
        "damageType": "白兵・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "自機の周囲８マスに陸上機雷トークン２枚とダミートークン２枚を重ならないように配置する<br/>各タイミングの終了時に機体がトークン上に存在するか否かを確認する。存在する場合、そのトークンをオープンする。機雷だった場合はダメージを適用し、トークンを取り除く。",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "スパイク",
        "rank": "B",
        "type": "突撃",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "X",
        "damageType": "白兵",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "正面方向へ可能な限り（最大で移動値マス）直線移動する。<br/>正面に隣接する機体に対し、「自機の突撃ダメージ＋１」点、自機に「対象の火突撃ダメージー１」点の白兵ダメージを与える。",
        "maxLimit": 4,
        "edition" : "基本"
      },
      {
        "name": "シールド",
        "rank": "B",
        "type": "装甲",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "手札にこの武装がある場合、破壊することで射撃ダメージを４点まで防げる。<br/>この武装がプロットエリアにある場合、上記をすべての種類のダメージに対して適用できる。",
        "maxLimit": 3,
        "edition" : "基本"
      },
      {
        "name": "バーニア(♠)",
        "rank": "B",
        "type": "補助",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "胴２ or 脚各１",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "移動：〇、突撃：×、白兵：〇。<br/>使用した場合、高低差を１少ないものとして扱い、特殊地形の追加移動力を消費しない。1枚不可。同じスート（♠）を持つ補助武装との同時使用不可<br/>",
        "maxLimit": 16,
        "edition" : "基本"
      },
      {
        "name": "ホイール(♠)",
        "rank": "B",
        "type": "補助",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "脚各１",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "移動：〇、突撃：〇、白兵：×。<br/>使用した場合、移動力を＋２する。<br/>1枚不可。同じスート（♠）を持つ補助武装との同時使用不可",
        "maxLimit": 14,
        "edition" : "基本"
      },
      {
        "name": "キャタピラ(♠)",
        "rank": "B",
        "type": "補助",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "脚各１",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "移動：〇、突撃：〇、白兵：×。<br/>使用した場合、移動力を＋１し、瓦礫・砂地・水地の追加移動力を消費しない。<br/>1枚不可。同じスート（♠）を持つ補助武装との同時使用不可",
        "maxLimit": 4,
        "edition" : "基本"
      },
      {
        "name": "ムーブセンサー(♡)",
        "rank": "B",
        "type": "補助",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "頭１＆胴１",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "移動：×、突撃：×、白兵：〇。<br/>使用した場合、移動力１で白兵移動する。<br/>1枚不可。同じスート（♡）を持つ補助武装との同時使用不可。",
        "maxLimit": 6,
        "edition" : "基本"
      },
      {
        "name": "パルスレーザー",
        "rank": "A",
        "type": "射撃",
        "range": "③～⑤",
        "minRange": "3",
        "maxRange": "5",
        "rangeType": "A",
        "damage": "2",
        "damageType": "射撃・レーザー",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 1,
        "edition" : "基本"
      },
      {
        "name": "高圧縮レーザー",
        "rank": "A",
        "type": "射撃",
        "range": "④～⑤",
        "minRange": "4",
        "maxRange": "5",
        "rangeType": "A",
        "damage": "4",
        "damageType": "射撃・レーザー",
        "mountPosition": "頭×",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "火炎放射器",
        "rank": "A",
        "type": "射撃",
        "range": "②～③",
        "minRange": "2",
        "maxRange": "3",
        "rangeType": "A",
        "damage": "2",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "対象が森に存在する場合、ダメージ＋１<br/>対象が水地に存在する場合、ダメージ－１<br/>（ダメージ適用後）対象は山札を４枚オープンし、誘爆チェックを行う。",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "サウンドウェーブ",
        "rank": "A",
        "type": "射撃",
        "range": "3～4",
        "minRange": "3",
        "maxRange": "4",
        "rangeType": "N",
        "damage": "0",
        "damageType": "射撃・レーザー",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "即座に、ゲーム終了時まで対象の回避値を半分（切上）にする。この効果やサウンドストームの効果は累積しない。",
        "maxLimit": 1,
        "edition" : "基本"
      },
      {
        "name": "ガトリングカノン",
        "rank": "A",
        "type": "射撃",
        "range": "③～⑤",
        "minRange": "3",
        "maxRange": "5",
        "rangeType": "A",
        "damage": "4",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 3,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 3,
        "edition" : "基本"
      },
      {
        "name": "ショットガン",
        "rank": "A",
        "type": "射撃",
        "range": "①～③",
        "minRange": "1",
        "maxRange": "3",
        "rangeType": "A",
        "damage": "4",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "対象は自分の手札またはプロットエリアにある種別「装甲」のカードを１枚選択し、破壊することで、この武装によるダメージをすべて防げる。",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "高品質ライフル",
        "rank": "A",
        "type": "射撃",
        "range": "⑨～⑪",
        "minRange": "9",
        "maxRange": "11",
        "rangeType": "A",
        "damage": "3",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 1,
        "edition" : "基本"
      },
      {
        "name": "広射程ミサイル",
        "rank": "A",
        "type": "射撃",
        "range": "❻～❽",
        "minRange": "6",
        "maxRange": "8",
        "rangeType": "B",
        "damage": "3",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "射線が通っていなくても射撃できる",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "ミサイルシールド",
        "rank": "A",
        "type": "射撃／装甲",
        "range": "❺～❻",
        "minRange": "5",
        "maxRange": "6",
        "rangeType": "B",
        "damage": "3",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "射線が通っていなくても射撃できる。<br/>手札にこの武装がある場合、破壊することで射撃ダメージを３点防げる。<br/>この武装がプロットエリアにある場合、たとえ射撃に使用した後であっても、すべての種類のダメージを３点まで防げる。",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "高品質ロケット砲",
        "rank": "A",
        "type": "射撃",
        "range": "6～8",
        "minRange": "6",
        "maxRange": "8",
        "rangeType": "N",
        "damage": "4",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "大口径ロケット砲",
        "rank": "A",
        "type": "射撃",
        "range": "6～8",
        "minRange": "6",
        "maxRange": "8",
        "rangeType": "N",
        "damage": "5",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "グレネードランチャー",
        "rank": "A",
        "type": "射撃",
        "range": "1～5",
        "minRange": "1",
        "maxRange": "5",
        "rangeType": "N",
        "damage": "3",
        "damageType": "射撃・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "森によるダメージへの修正を受けない。<br/>機体ではなくマスが対象となる。目標のマスとその四辺に隣接しているすべての機体にダメージを与える。",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "ロングアンカー",
        "rank": "A",
        "type": "射撃",
        "range": "1～4",
        "minRange": "1",
        "maxRange": "4",
        "rangeType": "N",
        "damage": "1",
        "damageType": "射撃",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "森によるダメージの修正を受けない。<br/>射撃の前に機体の向きを変更できる。<br/>対象を自機の正面に移動させる。その際、対象の向きは変わらない。",
        "maxLimit": 1,
        "edition" : "基本"
      },
      {
        "name": "ボーラ",
        "rank": "A",
        "type": "射撃",
        "range": "1～4",
        "minRange": "1",
        "maxRange": "4",
        "rangeType": "N",
        "damage": "0",
        "damageType": "射撃",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "命中した場合、この武装は破壊される。<br/>対象が次のラウンドにプロットしたカードをそのアクションフェーズの開始時に捨て札にする。",
        "maxLimit": 1,
        "edition" : "基本"
      },
      {
        "name": "ネット",
        "rank": "A",
        "type": "射撃",
        "range": "1～5",
        "minRange": "1",
        "maxRange": "5",
        "rangeType": "N",
        "damage": "0",
        "damageType": "射撃",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "命中した場合、この武装は破壊される。<br/>対象は次のラウンドの間、回避値と移動値が１になる。",
        "maxLimit": 1,
        "edition" : "基本"
      },
      {
        "name": "ヒートクロー",
        "rank": "A",
        "type": "白兵",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "2",
        "damageType": "白兵・レーザー",
        "mountPosition": "腕・脚",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "（ダメージ適用前）対象の手札または補助、プロットエリアに種別「装甲」のカードがある場合、対象はそのうち２枚を選択し、破壊する。<br/>(ダメージ適用後)対象は山札を２枚オープンし、誘爆チェックを行う。",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "チェーンブレード",
        "rank": "A",
        "type": "白兵",
        "range": "1～2",
        "minRange": "1",
        "maxRange": "2",
        "rangeType": "N",
        "damage": "4",
        "damageType": "白兵",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "コルセスカ",
        "rank": "A",
        "type": "白兵",
        "range": "2～3",
        "minRange": "2",
        "maxRange": "3",
        "rangeType": "N",
        "damage": "4",
        "damageType": "白兵",
        "mountPosition": "腕",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "バルディッシュ",
        "rank": "A",
        "type": "白兵",
        "range": "2",
        "minRange": "2",
        "maxRange": "2",
        "rangeType": "N",
        "damage": "5",
        "damageType": "白兵",
        "mountPosition": "腕",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "ウォーハンマー",
        "rank": "A",
        "type": "白兵",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "5",
        "damageType": "白兵",
        "mountPosition": "腕",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 1,
        "edition" : "基本"
      },
      {
        "name": "ジャイアントシザース",
        "rank": "A",
        "type": "白兵",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "1",
        "damageType": "白兵",
        "mountPosition": "腕",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "（ダメージ適用前）対象は武装カードが出るまで山札を1枚ずつオープンする。出た武装カードを搭載する部位の武装をすべてデッキから抜き出し、破壊する。その後、山札をシャッフルする。同じ武装が複数の部位にある場合、対象が部位を決定する。",
        "maxLimit": 1,
        "edition" : "基本"
      },
      {
        "name": "スタンウィップ",
        "rank": "A",
        "type": "白兵",
        "range": "2",
        "minRange": "2",
        "maxRange": "2",
        "rangeType": "N",
        "damage": "1",
        "damageType": "白兵",
        "mountPosition": "腕",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "対象が次のセグメントにプロットした種別「射撃」以外のカードをそのセグメントの開始時に捨て札にする。",
        "maxLimit": 1,
        "edition" : "基本"
      },
      {
        "name": "リボルバンカー",
        "rank": "A",
        "type": "白兵",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "6",
        "damageType": "白兵・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "強化機雷",
        "rank": "A",
        "type": "機雷",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "5",
        "damageType": "白兵・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "自機の周囲８マスに強化機雷トークン２枚とダミートークン２枚を重ならないように配置する<br/>各タイミングの終了時に機体がトークン上に存在するか否かを確認する。存在する場合、そのトークンをオープンし取り除く。機雷だった場合はダメージを適用する。",
        "maxLimit": 2,
        "edition" : "基本"
      },
      {
        "name": "サウンドストーム",
        "rank": "A",
        "type": "その他",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "次のラウンドの間、自機以外の機体は回避値が半分（切上）になる。<br/>この効果やサウンドウェーブの効果は累積しない。",
        "maxLimit": 1,
        "edition" : "基本"
      },
      {
        "name": "自爆装置",
        "rank": "A",
        "type": "その他",
        "range": "",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "X",
        "damageType": "白兵・実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "自機と周囲８マスに存在する機体に自機の耐久値の半分（切上）の白兵ダメージを与える。<br/>範囲内に種別「機雷」のトークンが存在する場合。すべて作動し、それらに含まれている機雷すべてのダメージをこの武装のダメージに追加する。<br/>この武装は使用後に破壊される。",
        "maxLimit": 1,
        "edition" : "基本"
      },
      {
        "name": "スモークミサイル",
        "rank": "A",
        "type": "その他",
        "range": "0～5",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "実弾（💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "機体ではなくマスが対象となる。目標のマスとその四辺に隣接しているすべての機体は次のラウンドの間、回避値が＋６される。",
        "maxLimit": 1,
        "edition" : "基本"
      },
      {
        "name": "ホバー(♠)",
        "rank": "A",
        "type": "補助",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "脚各１",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "移動：〇、突撃：〇、白兵：×。<br/>各セグメント開始時に使用・不使用を決定し、不使用時にはカードを横向きにする。<br/>使用する場合、移動力を＋２し、瓦礫・砂地・水地の追加移動力を消費しない。水地では水面の高度に存在するものとして扱う。<br/>1枚不可。同じスート（♠）を持つ補助武装との同時使用不可。",
        "maxLimit": 4,
        "edition" : "基本"
      },
      {
        "name": "防水幕",
        "rank": "A",
        "type": "補助",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "胴",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "移動：〇、突撃：〇、白兵：〇<br/>常に、水地の追加移動力を消費しない",
        "maxLimit": 1,
        "edition" : "基本"
      },
      {
        "name": "追加装甲",
        "rank": "A",
        "type": "装甲",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "胴",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "手札にこの武装がある場合、破壊することで射撃ダメージを全て防げる。<br/>この武装がプロットエリアにある場合、上記をすべての種類のダメージに対して適用できる。<br/>この武装は複数搭載できない。",
        "maxLimit": 1,
        "edition" : "基本"
      },
      //v2.0
      {
        "name": "ツイストドリル", 
        "rank": "B",
        "type": "白兵",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "3",
        "damageType": "白兵",
        "mountPosition": "腕・脚",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "このダメージは「装甲」の効果によって防ぐことができず、種別が「装甲」のみのカードでは受けられない。<br/>山札から「装甲」のみのカードがオープンされた場合、その「装甲」は捨札となり新たにカードをオープンする。山札に「装甲」のみのカードしかない場合、手札やプロット、補助へダメージを受ける。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "グレイブ", 
        "rank": "B",
        "type": "白兵",
        "range": "❷",
        "minRange": "2",
        "maxRange": "2",
        "rangeType": "B",
        "damage": "3",
        "damageType": "白兵",
        "mountPosition": "腕",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "ヒートグレイブ", 
        "rank": "B",
        "type": "白兵",
        "range": "❷",
        "minRange": "2",
        "maxRange": "2",
        "rangeType": "B",
        "damage": "3",
        "damageType": "白兵・レーザー",
        "mountPosition": "腕",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "（ダメージ適用後）対象は山札を２枚オープンし、誘爆チェックを行なう",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "チェーンマイン", 
        "rank": "B",
        "type": "白兵",
        "range": "2",
        "minRange": "2",
        "maxRange": "2",
        "rangeType": "N",
        "damage": "6",
        "damageType": "白兵・実弾(💣💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "命中した場合、この武装は破壊される",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "ミラーコーティング", 
        "rank": "B",
        "type": "補助／装甲",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "胴１＋全部位",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "白兵ダメージや「照準」された場合にも最初に使用できる。<br/>自機が受けたエネルギー武装⚡のダメージを、手札やプロットの「プレート」を１枚捨札にする、もしくは、このカード２枚を破壊することで、半分（切上）にできる。<br/>一度に複数回使用することはできない。",
        "maxLimit": 4,
        "edition" : "玉座"
      },
      {
        "name": "ショックアブソーバー", 
        "rank": "B",
        "type": "補助",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "脚各１",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "移動：〇、突撃：×、白兵：〇。<br/>常に、移動力を＋１し、高低差を１少ないものとして扱い、特殊地形の追加移動力を消費しない。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "ブースター", 
        "rank": "B",
        "type": "移動",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "胴",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "移動値＋６。移動力を可能な限り消費しきるように移動する。<br/>使用後この武装は破壊される。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "トラバサミ", 
        "rank": "B",
        "type": "機雷",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "1",
        "damageType": "白兵",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "自機の周囲８マスにトラバサミトークン２枚とダミートークン２枚を重ならないように設置する。<br/>各タイミングの終了時に機体がトークン上に存在する場合、そのトークンをオープンし取り除く。<br/>トラバサミだった場合はその機体にダメージを適用し、その機体のプロットエリアの両方に「キャンセル（▲▲▲）」チットを置く。<br/>このチットがある場合、「射撃」か「キャンセル（▲▲▲）チット２枚の除去」のどちらかを行なう。<br/>この効果を受けている間、強制移動を含む一切の移動が行なえない。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "アーマースーツ", 
        "rank": "B",
        "type": "補助／装甲",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "白兵",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "胴１のみ",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "白兵ダメージや「照準」された場合にも使用できる。<br/>「プレート」を１枚捨札にする、もしくは、このカード１枚を破壊することで、すべての種類のダメージを１点防ぐことができる。<br/>一度に複数回使用することはできない。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "バレットチューブ", 
        "rank": "B",
        "type": "補助",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "この武装を搭載した部位と同じ部位に搭載される武装の必要搭載数の実数（同部位分）を丸数字として扱う（他の部位にも搭載できるようになる）。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "ハンドロケット", 
        "rank": "B",
        "type": "射撃",
        "range": "4～6",
        "minRange": "4",
        "maxRange": "6",
        "rangeType": "N",
        "damage": "4",
        "damageType": "射撃・実弾(💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "ハンドグレネード", 
        "rank": "B",
        "type": "白兵",
        "range": "1～3",
        "minRange": "1",
        "maxRange": "3",
        "rangeType": "N",
        "damage": "3",
        "damageType": "白兵・実弾(💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "機体ではなくマスが対象となる。対象のマスとその四辺に隣接したマスに存在するすべての機体にダメージを与える。<br/>使用後この武装は破壊される。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "ジャイアントサイズ", 
        "rank": "B",
        "type": "白兵",
        "range": "3",
        "minRange": "3",
        "maxRange": "3",
        "rangeType": "N",
        "damage": "4",
        "damageType": "白兵",
        "mountPosition": "腕",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "フリーセンサー（♡）", 
        "rank": "B",
        "type": "補助",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "頭１＆胴１",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "移動：×、突撃：×、白兵：〇。</br>使用した場合、移動力２で白兵移動する。その際、白兵攻撃の対象に常に近づくように移動しなくてはならない。</br>１枚不可。同じスート（♡）を持つ補助武装との同時使用不可。",
        "maxLimit": 4,
        "edition" : "玉座"
      },
      {
        "name": "ターンパイル", 
        "rank": "B",
        "type": "補助",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "移動：×、突撃：〇、白兵：×。</br>使用した場合、突撃移動時に移動力を１消費することで、一度だけ機体の向きを好きな方向に変えることができる。</br>使用後この武装は破壊される。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "ウィンチ", 
        "rank": "B",
        "type": "補助",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "移動：〇、突撃：×、白兵：〇。</br>使用した場合、高低差を１少ないものとして扱う。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "ホーミングレーザー", 
        "rank": "A",
        "type": "射撃",
        "range": "③～④",
        "minRange": "3",
        "maxRange": "4",
        "rangeType": "A",
        "damage": "3",
        "damageType": "射撃・レーザー",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "射線が通っていなくても射撃できる。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "トラクタービーム", 
        "rank": "A",
        "type": "射撃",
        "range": "1～5",
        "minRange": "1",
        "maxRange": "5",
        "rangeType": "N",
        "damage": "0",
        "damageType": "射撃・レーザー",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "射撃の直前に機体の向きを変更できる。</br>森によるダメージへの修正を受けない。</br>水地の機体を対象にできない。</br>対象を自機の正面に強制移動させる。その際、対象の向きは変わらない。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "レーザーランチャー", 
        "rank": "A",
        "type": "射撃",
        "range": "1～10",
        "minRange": "1",
        "maxRange": "10",
        "rangeType": "N",
        "damage": "3",
        "damageType": "射撃・レーザー",
        "mountPosition": "全部位",
        "minLimit": 3,
        "equipSamePosition": false,
        "effect": "射撃の直前に機体の向きを変更できる。</br>自機の正面方向１～10マス、幅１マスの直線上に存在するすべての機体を対象とし、命中する。",
        "maxLimit": 3,
        "edition" : "玉座"
      },
      {
        "name": "対装甲ライフル", 
        "rank": "A",
        "type": "射撃",
        "range": "⑨～⑪",
        "minRange": "9",
        "maxRange": "11",
        "rangeType": "A",
        "damage": "3",
        "damageType": "射撃・実弾(💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "この武装によるダメージは、種別「装甲」でも１点分しか防ぐことができない。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "アームガン", 
        "rank": "A",
        "type": "射撃",
        "range": "②",
        "minRange": "2",
        "maxRange": "2",
        "rangeType": "A",
        "damage": "3",
        "damageType": "射撃・実弾(💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "白兵移動可能な補助武装があれば、射撃タイミング開始時に使用できる。</br>射撃の直前に機体の向きを変更できる。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "レールガン", 
        "rank": "A",
        "type": "射撃",
        "range": "⑧～⑩",
        "minRange": "8",
        "maxRange": "10",
        "rangeType": "A",
        "damage": "5",
        "damageType": "射撃・実弾(💣💣）・レーザー",
        "mountPosition": "全部位",
        "minLimit": 4,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 4,
        "edition" : "玉座"
      },
      {
        "name": "バヨネット", 
        "rank": "A",
        "type": "射撃／白兵",
        "range": "④～⑥／2",
        "minRange": "4／2",
        "maxRange": "6／2",
        "rangeType": "A／N",
        "damage": "2／2",
        "damageType": "射撃／白兵・実弾(💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "射撃タイミングでオープンする。</br>射撃として使用しなかった場合、白兵タイミングで使用する。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "フラッシュブレード", 
        "rank": "A",
        "type": "白兵",
        "range": "1～2",
        "minRange": "1",
        "maxRange": "2",
        "rangeType": "N",
        "damage": "3",
        "damageType": "白兵・レーザー",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "対象は次のラウンドの間、回避値が－２される。この効果は累積しない。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "ソードブレイカー", 
        "rank": "A",
        "type": "白兵／装甲",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "3",
        "damageType": "白兵",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "このカードが手札かプロットエリアにあれば、破壊することで白兵攻撃のダメージを１点防ぐことができる。</br>上記を含む、白兵攻撃のダメージでこのカードが破壊された場合、その白兵攻撃に用いられたカードを破壊する。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "ツヴァイハンダー", 
        "rank": "A",
        "type": "白兵",
        "range": "1～2",
        "minRange": "1",
        "maxRange": "2",
        "rangeType": "N",
        "damage": "5",
        "damageType": "白兵",
        "mountPosition": "腕各１",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "この武装が破壊された場合はデッキから「ツヴァイハンダー」をもう１枚探し、あった場合それを破壊する。その後、山札をシャッフルする。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "チェーンハンマー", 
        "rank": "A",
        "type": "白兵",
        "range": "特殊",
        "minRange": "-",
        "maxRange": "-",
        "rangeType": "-",
        "damage": "4",
        "damageType": "白兵",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "自機の周囲８マスに存在するすべての機体を対象とし、命中する。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "ブーメラン", 
        "rank": "A",
        "type": "白兵",
        "range": "3～4",
        "minRange": "3",
        "maxRange": "4",
        "rangeType": "N",
        "damage": "5",
        "damageType": "白兵",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "命中した場合、この武装は破壊される。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "ロケットパンチ", 
        "rank": "A",
        "type": "白兵",
        "range": "②",
        "minRange": "2",
        "maxRange": "2",
        "rangeType": "A",
        "damage": "5",
        "damageType": "白兵・実弾(💣）",
        "mountPosition": "腕各１のみ（ロケットパンチ）",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "同部位に有線ロケットパンチと同時に搭載できない。</br>使用後この武装は破壊される。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "ドリルバンカー", 
        "rank": "A",
        "type": "白兵",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "6",
        "damageType": "白兵",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "（ダメージ適用前）対象は山札を３枚オープンし、種別「装甲」が含まれているカードがあればそれらを破壊する。種別「装甲」以外のカードは捨札にする。</br>命中した場合、この武装は破壊される。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "多脚（♠）", 
        "rank": "A",
        "type": "補助",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "脚各１",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "移動：〇、突撃：×、白兵：×。</br>常に、移動力を＋１し、高低差を１少ないものとして扱い、特殊地形の追加移動力を消費しない。</br>1枚不可。同じスート（♠）を持つ補助武装との同時使用不可。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "ホプライトシールド", 
        "rank": "A",
        "type": "補助／装甲",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "このカードが補助エリアにある限り、回避値1/2（切上）。</br>白兵ダメージや「照準」された場合にも使用できる。</br>この装甲を破壊することで、すべての種類のダメージを６点まで防ぐことができる。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "ドリルスパイク", 
        "rank": "A",
        "type": "突撃",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "X",
        "damageType": "白兵",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "突撃移動を行ない、正面に隣接する機体を対象とする。</br>（ダメージ適用前）対象は山札を３枚オープンし、種別「装甲」が含まれているカードがあればそれらを破壊する。</br>種別「装甲」以外のカードは捨札にする。対象に「自機の突撃ダメージ＋１」点、自機に「対象の被突撃ダメージ－１」点の白兵ダメージを与える。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "高感度機雷", 
        "rank": "A",
        "type": "機雷",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "3",
        "damageType": "白兵・実弾(💣💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "自機の周囲８マスのうち４マスに高感度機雷トークン２枚と高感度ダミートークン２枚を重ならないように設置する。</br>各タイミングの終了時に機体がトークンかトークンに隣接したマス上に存在するか否かを確認する。存在する場合、そのトークンをオープンし取り除く。機雷だった場合はそのマスと隣接したマスに存在する機体にダメージを適用する。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "投擲機雷", 
        "rank": "A",
        "type": "機雷",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "3",
        "damageType": "白兵・実弾(💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "自機の周囲８マスとその周囲１６マスに収まるように投擲機雷トークン２枚とダミートークン２枚を重ならないように設置する。機体のいるマスには設置できない。</br>各タイミングの終了時に機体がトークン上に存在するか否かを確認する。存在する場合、そのトークンをオープンし取り除く。機雷だった場合はダメージを適用する。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "リアクティブアーマー", 
        "rank": "A",
        "type": "補助／装甲",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "この武装やこの武装と同じ部位に搭載された武装がダメージにより破壊された場合、そのダメージにより破壊された自機のカードはすべて、捨札エリアに置かれる。ただし、補助カードは補助エリアに置かれる。その後、この武装は破壊される。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "ノックバックカノン", 
        "rank": "A",
        "type": "射撃",
        "range": "③",
        "minRange": "3",
        "maxRange": "3",
        "rangeType": "A",
        "damage": "3",
        "damageType": "射撃・実弾(💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "（ダメージ適用後）対象を３マス、自機から離れるように直線的に強制移動させる。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "ワイドレーザー", 
        "rank": "A",
        "type": "射撃",
        "range": "2～5",
        "minRange": "2",
        "maxRange": "5",
        "rangeType": "N",
        "damage": "3",
        "damageType": "射撃・レーザー",
        "mountPosition": "全部位",
        "minLimit": 3,
        "equipSamePosition": false,
        "effect": "自機の正面２～５マスとそれらのマスに隣接したマスに存在するすべての機体を対象とし、命中する。",
        "maxLimit": 3,
        "edition" : "玉座"
      },
      {
        "name": "フリーズレーザー", 
        "rank": "A",
        "type": "射撃",
        "range": "②～③",
        "minRange": "2",
        "maxRange": "3",
        "rangeType": "A",
        "damage": "2",
        "damageType": "射撃・レーザー",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "命中した場合、次のセグメントの終了時まで、対象の移動力が０になる。この効果を受けている間、強制移動を含む一切の移動が行なえない。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "ゲルショット", 
        "rank": "A",
        "type": "射撃",
        "range": "3～6",
        "minRange": "3",
        "maxRange": "6",
        "rangeType": "N",
        "damage": "1",
        "damageType": "射撃",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "森によるダメージへの修正を受けない。</br>命中した場合、この武装は破壊される。</br>対象はゲーム終了時まで、移動値が－２（最低１）される。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "有線ロケットパンチ", 
        "rank": "A",
        "type": "射撃／白兵",
        "range": "1～3／1～3",
        "minRange": "1／1",
        "maxRange": "3／3",
        "rangeType": "N／N",
        "damage": "0／2",
        "damageType": "射撃／白兵・実弾(💣）",
        "mountPosition": "腕各１のみ（ロケットパンチ）",
        "minLimit": 1,
        "equipSamePosition": false,
        "effect": "同部位にロケットパンチと同時に搭載できない。</br>射撃タイミングでオープンする。</br>射撃として使用した場合、射撃の直前に機体の向きを変更できる。対象を自機の正面に強制移動させる。その際、対象の向きは変わらない。</br>射撃として使用しなかった場合、白兵タイミングで使用する。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "シューティングナイフ", 
        "rank": "A",
        "type": "射撃／白兵",
        "range": "②～④／1",
        "minRange": "2／1",
        "maxRange": "4／1",
        "rangeType": "A／N",
        "damage": "4／4",
        "damageType": "射撃／白兵",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "射撃タイミングでオープンする。</br>射撃として使用した場合、この武装は破壊される。</br>射撃として使用しなかった場合、白兵タイミングで使用する。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "ドリルランス", 
        "rank": "A",
        "type": "白兵",
        "range": "2～3",
        "minRange": "2",
        "maxRange": "3",
        "rangeType": "N",
        "damage": "3",
        "damageType": "白兵",
        "mountPosition": "腕",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "このダメージは「装甲」の効果によって防ぐことができず、種別が「装甲」のみのカードでは受けられない。</br>山札から「装甲」のみのカードがオープンされた場合、その「装甲」は捨札となり新たにカードをオープンする。</br>山札に「装甲」のみのカードしかない場合、手札やプロット、補助へダメージを受ける。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "モンスタースコップ", 
        "rank": "A",
        "type": "白兵／その他",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "4",
        "damageType": "白兵",
        "mountPosition": "腕",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "白兵タイミングでオープンする。</br>白兵として使用しなかった場合、その他タイミングで使用し、自機の存在するマスを「瓦礫－１」、隣接するマスの１つを「瓦礫＋１」に変更する。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "タックルショルダー", 
        "rank": "A",
        "type": "白兵",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "3",
        "damageType": "白兵",
        "mountPosition": "腕",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "（ダメージ適用後）対象を４マス、自機の正面方向へ直線的に強制移動させる。強制移動後、対象の進行方向に隣接する機体があれば、その機体に対し「対象の突撃ダメージ」点の白兵ダメージを与える。また対象は「進行方向に隣接する機体の被突撃ダメージ」点の白兵ダメージを受ける。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "ヘルメット", 
        "rank": "A",
        "type": "白兵／装甲",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "3",
        "damageType": "白兵",
        "mountPosition": "頭",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "白兵攻撃の際は、対象の部位：頭に搭載している武装へ先にダメージを与える。</br>手札にこのカードがある場合、「装甲」として破壊することで射撃ダメージを２点まで防げる。</br>この武装がプロットエリアにある場合、たとえ白兵に使用したあとであっても、「装甲」としてすべての種類のダメージを２点まで防げる。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "ドリルミサイル弾薬", 
        "rank": "A",
        "type": "補助",
        "range": "-",
        "minRange": "-",
        "maxRange": "0",
        "rangeType": "0",
        "damage": "-",
        "damageType": "実弾(💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "「ミサイル」武装１枚と入替で装備。名称に「ミサイル」と入っている武装の攻撃が命中した場合使用できる。</br>その「ミサイル」のダメージを＋２する。その「ミサイル」によるダメージは、種別「装甲」でも１点分しか防ぐことができない。</br>使用した場合、この武装は破壊される。</br>",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "硫酸ロケット弾薬", 
        "rank": "A",
        "type": "補助",
        "range": "-",
        "minRange": "-",
        "maxRange": "0",
        "rangeType": "0",
        "damage": "-",
        "damageType": "実弾(💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "「ロケット」武装１枚と入替で装備。名称に「ロケット」と入っている武装の攻撃が命中した場合使用できる。</br>対象に「継続ダメージ１」チットを渡す。対象は毎クリンナップフェイズの開始時に射撃ダメージ１を受ける。この効果は累積しない。</br>使用した場合、この武装は破壊される。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "エネルギーストーム", 
        "rank": "A",
        "type": "その他",
        "range": "1～3",
        "minRange": "1",
        "maxRange": "3",
        "rangeType": "N",
        "damage": "X",
        "damageType": "射撃・レーザー",
        "mountPosition": "脚×",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "自機の向きに関係なく、自機を中心として、１マス離れた機体に４点、２マス離れた機体に３点、３マス離れた機体に２点の射撃ダメージを与える。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "浮遊機雷", 
        "rank": "A",
        "type": "機雷",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "3",
        "damageType": "射撃・実弾(💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "自機に隣接するように浮遊機雷トークン１枚を設置する。機体シート上にまだなければ、浮遊機雷チットを受け取る。</br>トークンと同じマスに機体が存在する場合、直ちにダメージを適用しトークンを取り除く。</br>浮遊機雷チットを持つなら、特殊タイミング（機雷）で任意の浮遊機雷トークン１枚を２マス強制移動できる。</br>浮遊機雷トークンは攻撃の対象にでき、ダメージも受ける（直ちに除去）。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "モンスターローラー", 
        "rank": "A",
        "type": "突撃",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "X",
        "damageType": "白兵",
        "mountPosition": "軽装甲×＆全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "３マスの突撃移動を行なう。突撃移動中、正面に他の機体が隣接した場合、その機体を対象とし、対象ごと残りの突撃移動を行なう（対象は強制移動される）。</br>移動終了時、この移動で自機の存在したマスはすべて高度０の平地となる（最大４マス）。</br>対象に対し、「自機の突撃ダメージ＋１」点、自機に「対象の被突撃ダメージ」点の白兵ダメージを与える。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "サクリファイスパイク", 
        "rank": "A",
        "type": "突撃",
        "range": "1",
        "minRange": "1",
        "maxRange": "1",
        "rangeType": "N",
        "damage": "X",
        "damageType": "白兵・実弾(💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "突撃移動を行ない、正面に隣接する機体を対象とする。</br>対象に「自機の突撃ダメージ＋２」点、自機に「対象の被突撃ダメージ＋１」点の白兵ダメージを与える。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "低空飛行ユニット(♠)", 
        "rank": "S",
        "type": "補助／その他",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "胴１＋全部位",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "使用したら補助エリアに置き、飛行状態となる。各ドローフェイズ終了時に飛行状態、不使用状態を決定する。不使用状態の間はこのカードを横向きにする。</br>飛行状態：移動：〇、突撃：〇、白兵：×。回避値＋４、移動値＋２、高低差を３まで無視、特殊地形の追加移動力なし。白兵や<u>腕のみ搭載の武装</u>使用不可。移動タイミング開始時「任意の方向を向く」or「正面方向に１マス移動」を行なう。",
        "maxLimit": 2,
        "edition" : "玉座"
      },
      {
        "name": "光学迷彩", 
        "rank": "S",
        "type": "移動",
        "range": "-",
        "minRange": "0",
        "maxRange": "0",
        "rangeType": "-",
        "damage": "-",
        "damageType": "-",
        "mountPosition": "胴",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "移動タイミング開始時に光学迷彩マーカーを自機のマスに設置し、機体コマをマップ上から取り除く（その間「突撃」や「機雷」のみ効果あり）。光学迷彩マーカーのマスは機体進入不可。</br>そのセグメントの特殊タイミング終了時、自機の光学迷彩マーカー上に自機の機体コマを戻す。そこから移動力を可能な限り消費しきるように移動し、光学迷彩マーカーを取り除く。",
        "maxLimit": 1,
        "edition" : "玉座"
      },
      {
        "name": "サテライトレーザー", 
        "rank": "S",
        "type": "射撃／補助",
        "range": "0～∞",
        "minRange": "0",
        "maxRange": "99",
        "rangeType": "N",
        "damage": "8",
        "damageType": "射撃・レーザー",
        "mountPosition": "全部位",
        "minLimit": 3,
        "equipSamePosition": false,
        "effect": "使用したら補助エリアに置く。２枚目なら下記の射撃を行ない２枚とも捨札にする。</br>このセグメントに移動していない全機体(自機も)のチームチットを混ぜ、ランダムに１枚引く。</br>マップ上の位置に関係なくそのチットの機体を対象とし命中する。</br>照準後なら、２枚引き１枚選べる。照準自体の効果は得ない。",
        "maxLimit": 3,
        "edition" : "玉座"
      },
      {
        "name": "グラビティボックス", 
        "rank": "S",
        "type": "その他",
        "range": "1～4",
        "minRange": "1",
        "maxRange": "4",
        "rangeType": "-",
        "damage": "X",
        "damageType": "射撃",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "機体ではなくマスが対象となる。対象のマスから２マス以内に存在するすべての機体は、そのイニシアチブ順に移動値に関わらず対象のマスに近づくように強制移動する。</br>この効果の範囲内の、移動可能な全機体は、「その全機体の非突撃ダメージの合計」ダメージⓈを受ける。",
        "maxLimit": 2,
        "edition" : "玉座"
      },

      // {
      //   "name": "軽装甲×＆全部位ダミー", //FIXME ダミーデータのため、後で削除すること。
      //   "rank": "S",
      //   "type": "射撃",
      //   "range": "-",
      //   "minRange": "0",
      //   "maxRange": "0",
      //   "rangeType": "-",
      //   "damage": "-",
      //   "damageType": "-",
      //   "mountPosition": "軽装甲×＆全部位",
      //   "minLimit": 1,
      //   "equipSamePosition": true,
      //   "effect": "ダミー",
      //   "maxLimit": 1
      // },
      // {
      //   "name": "脚×ダミー", //FIXME ダミーデータのため、後で削除すること。
      //   "rank": "S",
      //   "type": "射撃",
      //   "range": "-",
      //   "minRange": "0",
      //   "maxRange": "0",
      //   "rangeType": "-",
      //   "damage": "-",
      //   "damageType": "-",
      //   "mountPosition": "脚×",
      //   "minLimit": 1,
      //   "equipSamePosition": true,
      //   "effect": "ダミー",
      //   "maxLimit": 1
      // },
      // {
      //   "name": "胴1＋全部位ダミー", //FIXME ダミーデータのため、後で削除すること。
      //   "rank": "S",
      //   "type": "射撃",
      //   "range": "-",
      //   "minRange": "0",
      //   "maxRange": "0",
      //   "rangeType": "-",
      //   "damage": "-",
      //   "damageType": "-",
      //   "mountPosition": "胴１＋全部位",
      //   "minLimit": 2,
      //   "equipSamePosition": false,
      //   "effect": "ダミー",
      //   "maxLimit": 2
      // },
      // {
      //   "name": "ロケットパンチ１ダミー", //FIXME ダミーデータのため、後で削除すること。
      //   "rank": "S",
      //   "type": "射撃",
      //   "range": "-",
      //   "minRange": "0",
      //   "maxRange": "0",
      //   "rangeType": "-",
      //   "damage": "-",
      //   "damageType": "-",
      //   "mountPosition": "腕１（ロケットパンチ）",
      //   "minLimit": 1,
      //   "equipSamePosition": false,
      //   "effect": "ダミー",
      //   "maxLimit": 1
      // },
      // {
      //   "name": "ロケットパンチ２ダミー", //FIXME ダミーデータのため、後で削除すること。
      //   "rank": "S",
      //   "type": "射撃",
      //   "range": "-",
      //   "minRange": "0",
      //   "maxRange": "0",
      //   "rangeType": "-",
      //   "damage": "-",
      //   "damageType": "-",
      //   "mountPosition": "腕１（ロケットパンチ）",
      //   "minLimit": 1,
      //   "equipSamePosition": false,
      //   "effect": "ダミー",
      //   "maxLimit": 1
      // },
      // {
      //   "name": "射撃かつ近接ダミー", //FIXME ダミーデータのため、後で削除すること。
      //   "rank": "S",
      //   "type": "射撃／白兵",
      //   "range": "④～⑥／2",
      //   "minRange": "4／2",
      //   "maxRange": "6／2",
      //   "rangeType": "A／N",
      //   "damage": "2／2",
      //   "damageType": "射撃／白兵",
      //   "mountPosition": "脚×",
      //   "minLimit": 1,
      //   "equipSamePosition": false,
      //   "effect": "射撃タイミングでオープンする。射撃として使用しなかった場合、白兵タイミングで使用する。",
      //   "maxLimit": 1
      // },
    ]
  }
}
