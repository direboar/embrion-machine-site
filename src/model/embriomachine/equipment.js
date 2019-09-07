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

  constructor(name, rank, type, range, minRange, maxRange, rangeType, damage, damageType, mountPosition, minLimit, equipSamePosition, effect, maxLimit) {
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
        "maxLimit": 4
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
        "maxLimit": 13
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
        "maxLimit": 8
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "移動タイミングの開始時に射撃できる。<br/>命中した場合、この武装は破壊される。",
        "maxLimit": 2
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 4
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 3
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "射線が通っていなくても射撃できる",
        "maxLimit": 5
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "射線が通っていなくても射撃できる",
        "maxLimit": 5
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 5
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
        "maxLimit": 1
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
        "maxLimit": 2
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
        "maxLimit": 1
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
        "maxLimit": 2
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
        "maxLimit": 2
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
        "maxLimit": 1
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
        "damageType": "白兵",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": false,
        "effect": "(ダメージ適用後)対象は山札を２枚オープンし、誘爆チェックを行う。",
        "maxLimit": 6
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
        "damageType": "白兵・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "命中した場合、この武器は破壊される",
        "maxLimit": 4
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
        "damageType": "白兵・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "自機の周囲８マスに陸上機雷トークン２枚とダミートークン２枚を重ならないように配置する<br/>各タイミングの終了時に機体がトークン上に存在するか否かを確認する。存在する場合、そのトークンをオープンする。機雷だった場合はダメージを適用し、トークンを取り除く。",
        "maxLimit": 2
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
        "maxLimit": 2
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
        "maxLimit": 3
      },
      {
        "name": "バーニア",
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
        "effect": "１枚では使用不可。突撃には使用不可。<br/>移動、白兵時に高低差を１少ないものとして扱い、特殊地形への侵入に必要な移動力を無視できる。",
        "maxLimit": 12
      },
      {
        "name": "ホイール",
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
        "effect": "１枚では使用不可。白兵には使用不可。<br/>移動、突撃時に移動力を＋２できる。",
        "maxLimit": 4
      },
      {
        "name": "キャタピラ",
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
        "effect": "１枚では使用不可。白兵には使用不可。<br/>移動、突撃時に移動力を＋１し、瓦礫、砂地、水地への侵入に必要な追加移動力を無視できる。",
        "maxLimit": 2
      },
      {
        "name": "ムーブセンサー",
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
        "effect": "１枚では使用不可。バーニアと同時に使用できる。<br/>白兵攻撃直前に１マス移動できる。",
        "maxLimit": 2
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
        "maxLimit": 1
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
        "maxLimit": 2
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "対象が森に存在する場合、ダメージ＋１<br/>対象が水地に存在する場合、ダメージ－１<br/>（ダメージ適用後）対象は山札を４枚オープンし、誘爆チェックを行う。",
        "maxLimit": 1
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
        "effect": "ゲーム終了時まで対象の回避値を半分（切上）にする。この効果やサウンドストームの効果は累積しない。",
        "maxLimit": 1
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 3,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 3
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "対象は自分の手札またはプロットエリアにある種別「装甲」のカードを１枚選択し、破壊することで、この武装によるダメージをすべて防げる。",
        "maxLimit": 2
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 1
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "射線が通っていなくても射撃できる",
        "maxLimit": 2
      },
      {
        "name": "ミサイルシールド",
        "rank": "A",
        "type": "射撃",
        "range": "❺～❻",
        "minRange": "5",
        "maxRange": "6",
        "rangeType": "B",
        "damage": "3",
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "射線が通っていなくても射撃できる。<br/>手札にこの武装がある場合、破壊することで射撃ダメージを３点防げる。<br/>この武装がプロットエリアにある場合、たとえ射撃に使用した後であっても、上記をすべての種類のダメージに対して適用できる。",
        "maxLimit": 2
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2
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
        "damageType": "射撃・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "森によるダメージへの修正を受けない。<br/>機体ではなくマスが対象となる。目標のマスとその四辺に隣接しているすべての機体にダメージを与える。",
        "maxLimit": 2
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
        "maxLimit": 1
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
        "maxLimit": 1
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
        "maxLimit": 1
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
        "maxLimit": 2
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
        "maxLimit": 2
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
        "maxLimit": 2
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
        "maxLimit": 2
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
        "maxLimit": 1
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
        "maxLimit": 1
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
        "maxLimit": 1
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
        "damageType": "白兵",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2
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
        "damageType": "白兵・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "自機の周囲８マスに強化機雷トークン２枚とダミートークン２枚を重ならないように配置する<br/>各タイミングの終了時に機体がトークン上に存在するか否かを確認する。存在する場合、そのトークンをオープンする。機雷だった場合はダメージを適用し、トークンを取り除く。",
        "maxLimit": 2
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
        "maxLimit": 1
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
        "damageType": "白兵・実弾兵器",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "自機と周囲８マスに存在する機体に自機の耐久値の半分（切上）の白兵ダメージを与える。<br/>範囲内に種別「機雷」のトークンが存在する場合。すべてを作動させ、それらに含まれている機雷すべてのダメージをこの武装のダメージに追加する。<br/>この武装は使用後に破壊される。",
        "maxLimit": 1
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
        "damageType": "-",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "機体ではなくマスが対象となる。目標のマスとその四辺に隣接しているすべての機体は次のラウンドの間、回避値が＋６される。",
        "maxLimit": 1
      },
      {
        "name": "ホバー",
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
        "effect": "１枚では使用不可。白兵には使用不可。<br/>移動、突撃時に移動力を＋２し、瓦礫、砂地、水地への侵入に必要な追加移動力を無視できる。水地では高低差を無視し、水面の高度に存在するものとして扱う。",
        "maxLimit": 2
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
        "effect": "水地への侵入に必要な追加移動力を無視する",
        "maxLimit": 1
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
        "maxLimit": 1
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
        "effect": "このダメージは「装甲」の効果によって防ぐことができず、種別が「装甲」のみのカードでは受けられない。山札から「装甲」のみのカードがオープンされた場合、その「装甲」は捨札となり新たにカードをオープンする。山札に「装甲」のみのカードしかない場合、手札やプロット、補助へダメージを受ける。",
        "maxLimit": 1
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
        "maxLimit": 1
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
        "maxLimit": 2
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
        "damageType": "白兵・実弾兵器(💣💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "命中した場合、この武装は破壊される",
        "maxLimit": 2
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
        "effect": "白兵ダメージや「照準」された場合にも最初に使用できる。自機が受けたエネルギー武装⚡のダメージを、手札やプロットの「プレート」を１枚捨札にする、もしくは、このカード２枚を破壊することで、半分（切上）にできる。一度に複数回使用することはできない。",
        "maxLimit": 4
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
        "effect": "移動：〇、突撃：×、白兵：〇。常に、移動力を＋１し、高低差を１少ないものとして扱い、特殊地形の追加移動力を消費しない。",
        "maxLimit": 2
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
        "effect": "移動値＋６。移動力を可能な限り消費しきるように移動する。使用後この武装は破壊される。",
        "maxLimit": 2
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
        "effect": "自機の周囲８マスにトラバサミトークン２枚とダミートークン２枚を重ならないように設置する。各タイミングの終了時に機体がトークン上に存在する場合、そのトークンをオープンし取り除く。トラバサミだった場合はその機体にダメージを適用し、その機体のプロットエリアの両方に「キャンセル（▲▲▲）」チットを置く。このチットがある場合、「射撃」か「キャンセル（▲▲▲）チット２枚の除去」のどちらかを行なう。この効果を受けている間、強制移動を含む一切の移動が行なえない。",
        "maxLimit": 1
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
        "effect": "白兵ダメージや「照準」された場合にも使用できる。「プレート」を１枚捨札にする、もしくは、このカード１枚を破壊することで、すべての種類のダメージを１点防ぐことができる。一度に複数回使用することはできない。",
        "maxLimit": 2
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
        "effect": "この武装を搭載した部位と同じ部位に搭載される武装の必要搭載数の実数（同部位分）を丸数字として扱う（他の部位にも搭載できるようになる）。 注意：このチェックは本アプリでは未実装です。",
        "maxLimit": 2
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
        "damageType": "射撃・実弾兵器(💣）",
        "mountPosition": "全部位",
        "minLimit": 2,
        "equipSamePosition": true,
        "effect": "",
        "maxLimit": 2
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
        "damageType": "白兵・実弾兵器(💣）",
        "mountPosition": "全部位",
        "minLimit": 1,
        "equipSamePosition": true,
        "effect": "機体ではなくマスが対象となる。対象のマスとその四辺に隣接したマスに存在するすべての機体にダメージを与える。使用後この武装は破壊される。",
        "maxLimit": 2
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
        "effect": "機体ではなくマスが対象となる。対象のマスとその四辺に隣接したマスに存在するすべての機体にダメージを与える。使用後この武装は破壊される。",
        "maxLimit": 1
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
        "effect": "移動：×、突撃：×、白兵：〇。使用した場合、移動力２で白兵移動する。その際、白兵攻撃の対象に常に近づくように移動しなくてはならない。1枚不可。同じスート（♡）を持つ補助武装との同時使用不可。",
        "maxLimit": 4
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
        "effect": "移動：×、突撃：〇、白兵：×。１枚不可。使用した場合、突撃移動時に移動力を１消費することで、一度だけ機体の向きを好きな方向に変えることができる。使用後この武装は破壊される。",
        "maxLimit": 2
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
        "effect": "移動：〇、突撃：×、白兵：〇。使用した場合、高低差を１少ないものとして扱う。",
        "maxLimit": 2
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
