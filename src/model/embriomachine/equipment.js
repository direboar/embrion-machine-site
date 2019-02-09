// import abilityType from './abilityType'
import MountPosition from '@/model/embriomachine/mountposition'

export default class Equipment {

  constructor(name,rank,type,range,damage,damageType,mountPosition,minLimit,equipSamePosition,effect,maxLimit) {
    // 名前
    this.name = name
    // ランク A,B
    this.rank = rank
    // 種別 射撃、白兵、機雷、その他、補助
    this.type = type
    // 射程 1,3～4,➀～➁,➍～➏
    this.range = range
    // ダメージ
    this.damage = damage
    // ダメージタイプ
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

  get formatMinLimit(){
    if(this.equipSamePosition){
      return this.minLimit;
    }else{
      //FIXME とりあえず３まで対応
      if(this.minLimit === 1){
        return "①";
      }
      if(this.minLimit === 2){
        return "②";
      }
      if(this.minLimit === 3){
        return "③";
      }else{
        return this.minLimit;
      }
    }
  }

  //指定した部位に装備できるかを判定する。
  canEquip(equipmentPosition){
    //2-1.装備品の装備可能部位から、装備可能なポジションのリストを取得し、装備可能な位置に装備しているかをチェック。
   let machineEquipmentPositions = MountPosition.toMachineEquipmentPosition(this.mountPosition);
   if(machineEquipmentPositions.indexOf(equipmentPosition) < 0){
      return false;
    }
    return true;
  }
  
  //選択可能な装備を取得する
  static getEquipments(){
    return Equipment.assigns(Equipment.json());
  }


  static assigns(array){
    var retVal = [];
    array.forEach(obj => {
      var equipment = new Equipment()
      Object.assign(equipment,obj);
      retVal.push(equipment);
    });
    return retVal;

  }

  static json(){
    return [
      {
        "name":"スモールレーザー",
        "rank":"B",
        "type":"射撃",
        "range":"②～③",
        "damage":"2",
        "damageType":"射撃・レーザー",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":4
       },
       {
        "name":"ミドルレーザー",
        "rank":"B",
        "type":"射撃",
        "range":"③～④",
        "damage":"3",
        "damageType":"射撃・レーザー",
        "mountPosition":"頭×",
        "minLimit":2,
        "equipSamePosition":false,
        "effect":"",
        "maxLimit":13
       },
       {
        "name":"ラージレーザー",
        "rank":"B",
        "type":"射撃",
        "range":"④～⑤",
        "damage":"3",
        "damageType":"射撃・レーザー",
        "mountPosition":"頭×",
        "minLimit":2,
        "equipSamePosition":false,
        "effect":"",
        "maxLimit":8
       },
       {
        "name":"バルカン",
        "rank":"B",
        "type":"射撃",
        "range":"②",
        "damage":"1",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"移動タイミングの開始時の射撃できる。<br/>命中した場合、この武装は破壊される。",
        "maxLimit":2
       },
       {
        "name":"マシンガン",
        "rank":"B",
        "type":"射撃",
        "range":"②～④",
        "damage":"3",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":2,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":4
       },
       {
        "name":"ガトリングガン",
        "rank":"B",
        "type":"射撃",
        "range":"③～⑤",
        "damage":"3",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":2,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":2
       },
       {
        "name":"スナイパーライフル",
        "rank":"B",
        "type":"射撃",
        "range":"⑨～⑪",
        "damage":"3",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":2,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":3
       },
       {
        "name":"短距離ミサイル",
        "rank":"B",
        "type":"射撃",
        "range":"❺～❻",
        "damage":"3",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":2,
        "equipSamePosition":true,
        "effect":"射線が通っていなくても射撃できる",
        "maxLimit":5
       },
       {
        "name":"長距離ミサイル",
        "rank":"B",
        "type":"射撃",
        "range":"❽～❾",
        "damage":"3",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":2,
        "equipSamePosition":true,
        "effect":"射線が通っていなくても射撃できる",
        "maxLimit":5
       },
       {
        "name":"ロケット砲",
        "rank":"B",
        "type":"射撃",
        "range":"6～8",
        "damage":"4",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":2,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":5
       },
       {
        "name":"アンカー",
        "rank":"B",
        "type":"射撃",
        "range":"1～3",
        "damage":"0",
        "damageType":"射撃",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"射撃の前に期待の向きを変更できる。<br/>対象を時期の正面に移動させる。その際、対象の向きは変わらない。",
        "maxLimit":1
       },
       {
        "name":"クロー",
        "rank":"B",
        "type":"白兵",
        "range":"1",
        "damage":"2",
        "damageType":"白兵",
        "mountPosition":"腕・脚",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"（ダメージ適用前）対象の手札または補助、プロットエリアに種別「装甲」のカードがある場合、対象はそのうち２枚を選択し、破壊する。",
        "maxLimit":2
       },
       {
        "name":"ブレード",
        "rank":"B",
        "type":"白兵",
        "range":"1～2",
        "damage":"3",
        "damageType":"白兵",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":1
       },
       {
        "name":"ランス",
        "rank":"B",
        "type":"白兵",
        "range":"2～3",
        "damage":"3",
        "damageType":"白兵",
        "mountPosition":"腕",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":2
       },
       {
        "name":"アクス",
        "rank":"B",
        "type":"白兵",
        "range":"2",
        "damage":"4",
        "damageType":"白兵",
        "mountPosition":"腕",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":2
       },
       {
        "name":"メイス",
        "rank":"B",
        "type":"白兵",
        "range":"1",
        "damage":"4",
        "damageType":"白兵",
        "mountPosition":"腕",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":1
       },
       {
        "name":"ヒートソード",
        "rank":"B",
        "type":"白兵",
        "range":"1～2",
        "damage":"3",
        "damageType":"白兵",
        "mountPosition":"全部位",
        "minLimit":2,
        "equipSamePosition":false,
        "effect":"(ダメージ適用後)対象は山札を２枚オープンし、誘爆チェックを行う。",
        "maxLimit":6
       },
       {
        "name":"パイルバンカー",
        "rank":"B",
        "type":"白兵",
        "range":"1",
        "damage":"6",
        "damageType":"白兵",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"命中した場合、この武器は破壊される",
        "maxLimit":4
       },
       {
        "name":"陸上機雷",
        "rank":"B",
        "type":"機雷",
        "range":"-",
        "damage":"3",
        "damageType":"白兵",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"自機の周囲８マスに陸上機雷トークン２枚とダミートークン２枚を重ならないように配置する<br/>各タイミングの終了時に機体がトークン上に存在するか否かを確認する。存在する場合、そのトークンをオープンする。嫌いだった場合はダメージを適用し、トークンを取り除く。",
        "maxLimit":2
       },
       {
        "name":"スパイク",
        "rank":"B",
        "type":"突撃",
        "range":"1",
        "damage":"X",
        "damageType":"白兵",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"正面方向へ可能な限り（最大で移動値マス）直線移動する。<br/>正面に隣接する機体に対し、「自機の突撃ダメージ＋１」点、自機に「対象の火突撃ダメージー１」点の白兵ダメージを与える。",
        "maxLimit":2
       },
       {
        "name":"シールド",
        "rank":"B",
        "type":"装甲",
        "range":"-",
        "damage":"-",
        "damageType":"-",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"手札にこの武装がある場合、破壊することで射撃ダメージを４点まで防げる。<br/>この武装がプロットエリアにある場合、上記をすべての種類のダメージに対して適用できる。",
        "maxLimit":3
       },
       {
        "name":"バーニア",
        "rank":"B",
        "type":"補助",
        "range":"-",
        "damage":"-",
        "damageType":"-",
        "mountPosition":"胴２ or 脚各１",
        "minLimit":2,
        "equipSamePosition":false,
        "effect":"１枚では使用不可。突撃には使用不可。<br/>移動、白兵時に高低差を１少ないものとして扱い、特殊地形への侵入に必要な移動力を無視できる。",
        "maxLimit":12
       },
       {
        "name":"ホイール",
        "rank":"B",
        "type":"補助",
        "range":"-",
        "damage":"-",
        "damageType":"-",
        "mountPosition":"脚各１",
        "minLimit":2,
        "equipSamePosition":false,
        "effect":"１枚では使用不可。白兵には使用不可。<br/>移動、突撃時に移動力を＋２できる。",
        "maxLimit":4
       },
       {
        "name":"キャタピラ",
        "rank":"B",
        "type":"補助",
        "range":"-",
        "damage":"-",
        "damageType":"-",
        "mountPosition":"脚各１",
        "minLimit":2,
        "equipSamePosition":false,
        "effect":"１枚では使用不可。白兵には使用不可。<br/>移動、突撃時に移動力を＋１し、瓦礫、砂地、水地への侵入に必要な追加移動力を無視できる。",
        "maxLimit":2
       },
       {
        "name":"ムーブセンサー",
        "rank":"B",
        "type":"補助",
        "range":"-",
        "damage":"-",
        "damageType":"-",
        "mountPosition":"頭１＆胴１",
        "minLimit":2,
        "equipSamePosition":false,
        "effect":"１枚では使用不可。バーニアと同時に使用できる。<br/>白兵攻撃直前に１マス移動できる。",
        "maxLimit":2
       },
       {
        "name":"パルスレーザー",
        "rank":"A",
        "type":"射撃",
        "range":"③～⑤",
        "damage":"2",
        "damageType":"射撃・レーザー",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":1
       },
       {
        "name":"高圧縮レーザー",
        "rank":"A",
        "type":"射撃",
        "range":"④～⑤",
        "damage":"4",
        "damageType":"射撃・レーザー",
        "mountPosition":"頭×",
        "minLimit":2,
        "equipSamePosition":false,
        "effect":"",
        "maxLimit":2
       },
       {
        "name":"火炎放射器",
        "rank":"A",
        "type":"射撃",
        "range":"②～③",
        "damage":"2",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"対象が森に存在する場合、ダメージ＋１<br/>対象が水地に存在する場合、ダメージ－１<br/>（ダメージ適用後）対象は山札を４枚オープンし、誘爆チェックを行う。",
        "maxLimit":1
       },
       {
        "name":"サウンドウェーブ",
        "rank":"A",
        "type":"射撃",
        "range":"3～4",
        "damage":"0",
        "damageType":"射撃・レーザー",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"ゲーム終了時まで対象の回避値を半分（切上）にする。この効果やサウンドストームの効果は累積しない。",
        "maxLimit":1
       },
       {
        "name":"ガトリングカノン",
        "rank":"A",
        "type":"射撃",
        "range":"③～⑤",
        "damage":"4",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":3,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":3
       },
       {
        "name":"ショットガン",
        "rank":"A",
        "type":"射撃",
        "range":"①～③",
        "damage":"4",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":2,
        "equipSamePosition":true,
        "effect":"対象は自分の手札またはプロットエリアにある種別「装甲」のカードを１枚選択し、破壊することで、この武装によるダメージをすべて防げる。",
        "maxLimit":2
       },
       {
        "name":"高品質ライフル",
        "rank":"A",
        "type":"射撃",
        "range":"⑨～⑪",
        "damage":"3",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":1
       },
       {
        "name":"広射程ミサイル",
        "rank":"A",
        "type":"射撃",
        "range":"❻～❽",
        "damage":"3",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":2,
        "equipSamePosition":true,
        "effect":"射線が通っていなくても射撃できる",
        "maxLimit":2
       },
       {
        "name":"ミサイルシールド",
        "rank":"A",
        "type":"射撃",
        "range":"❺～❻",
        "damage":"3",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":2,
        "equipSamePosition":true,
        "effect":"射線が通っていなくても射撃できる。<br/>手札にこの武装がある場合、破壊することで射撃ダメージを３点防げる。<br/>この武装がプロットエリアにある場合、たとえ射撃に使用した後であっても、上記をすべての種類のダメージに対して適用できる。",
        "maxLimit":2
       },
       {
        "name":"高品質ロケット砲",
        "rank":"A",
        "type":"射撃",
        "range":"6～8",
        "damage":"4",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":2
       },
       {
        "name":"大口径ロケット砲",
        "rank":"A",
        "type":"射撃",
        "range":"6～8",
        "damage":"5",
        "damageType":"射撃・実弾兵器",
        "mountPosition":"全部位",
        "minLimit":2,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":2
       },
       {
        "name":"ロングアンカー",
        "rank":"A",
        "type":"射撃",
        "range":"1～4",
        "damage":"1",
        "damageType":"射撃",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"森によるダメージの修正を受けない。<br/>射撃の前に期待の向きを変更できる。<br/>対象を時期の正面に移動させる。その際、対象の向きは変わらない。",
        "maxLimit":1
       },
       {
        "name":"ボーラ",
        "rank":"A",
        "type":"射撃",
        "range":"1～4",
        "damage":"0",
        "damageType":"射撃",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"命中した場合、この武装は破壊される。<br/>対象が次のラウンドにプロットしたカードをそのアクションフェーズの開始時に捨て札にする。",
        "maxLimit":1
       },
       {
        "name":"ネット",
        "rank":"A",
        "type":"射撃",
        "range":"1～5",
        "damage":"0",
        "damageType":"射撃",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"命中した場合、この武装は破壊される。<br/>対象は次のラウンドの間、回避値と移動値が１になる。",
        "maxLimit":1
       },
       {
        "name":"ヒートクロー",
        "rank":"A",
        "type":"白兵",
        "range":"1",
        "damage":"2",
        "damageType":"白兵・レーザー",
        "mountPosition":"腕・脚",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"（ダメージ適用前）対象の手札または補助、プロットエリアに種別「装甲」のカードがある場合、対象はそのうち２枚を選択し、破壊する。<br/>(ダメージ適用後)対象は山札を２枚オープンし、誘爆チェックを行う。",
        "maxLimit":2
       },
       {
        "name":"チェーンブレード",
        "rank":"A",
        "type":"白兵",
        "range":"1～2",
        "damage":"4",
        "damageType":"白兵",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":2
       },
       {
        "name":"コルセスカ",
        "rank":"A",
        "type":"白兵",
        "range":"2～3",
        "damage":"4",
        "damageType":"白兵",
        "mountPosition":"腕",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":2
       },
       {
        "name":"バルディッシュ",
        "rank":"A",
        "type":"白兵",
        "range":"2",
        "damage":"5",
        "damageType":"白兵",
        "mountPosition":"腕",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":2
       },
       {
        "name":"ウォーハンマー",
        "rank":"A",
        "type":"白兵",
        "range":"1",
        "damage":"5",
        "damageType":"白兵",
        "mountPosition":"腕",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":1
       },
       {
        "name":"ジャイアントシザース",
        "rank":"A",
        "type":"白兵",
        "range":"1",
        "damage":"1",
        "damageType":"白兵",
        "mountPosition":"腕",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"（ダメージ適用前）対象は武装カードが出るまで山札を1枚ずつオープンする。出た武装カードを搭載する部位の武装をすべてデッキから抜き出し、破壊する。その後、山札をシャッフルする。同じ武装が複数の部位にある場合、対象が部位を決定する。",
        "maxLimit":1
       },
       {
        "name":"スタンウィップ",
        "rank":"A",
        "type":"白兵",
        "range":"1",
        "damage":"2",
        "damageType":"白兵",
        "mountPosition":"腕",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"対象が次のセグメントにプロットした種別「射撃」以外のカードをそのセグメントの開始時に捨て札にする。",
        "maxLimit":1
       },
       {
        "name":"リボルバンカー",
        "rank":"A",
        "type":"白兵",
        "range":"1",
        "damage":"6",
        "damageType":"白兵",
        "mountPosition":"全部位",
        "minLimit":2,
        "equipSamePosition":true,
        "effect":"",
        "maxLimit":2
       },
       {
        "name":"強化機雷",
        "rank":"A",
        "type":"機雷",
        "range":"-",
        "damage":"5",
        "damageType":"白兵",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"自機の周囲８マスに陸上機雷トークン２枚とダミートークン２枚を重ならないように配置する<br/>各タイミングの終了時に機体がトークン上に存在するか否かを確認する。存在する場合、そのトークンをオープンする。嫌いだった場合はダメージを適用し、トークンを取り除く。",
        "maxLimit":2
       },
       {
        "name":"サウンドストーム",
        "rank":"A",
        "type":"その他",
        "range":"-",
        "damage":"-",
        "damageType":"-",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"そのラウンドの間、自機以外の機体は回避値が半分（切上）になる。<br/>この効果やサウンドウェーブの効果は累積しない。",
        "maxLimit":1
       },
       {
        "name":"自爆装置",
        "rank":"A",
        "type":"その他",
        "range":"",
        "damage":"X",
        "damageType":"白兵",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"自機と周囲８マスに存在する機体に自機の耐久値の半分（切上）の白兵ダメージを与える。<br/>範囲内に種別「機雷」のトークンが存在する場合。すべてを作動させ、それらに含まれている機雷すべてのダメージをこの武装のダメージに追加する。<br/>この武装は使用後に破壊される。",
        "maxLimit":1
       },
       {
        "name":"スモークミサイル",
        "rank":"A",
        "type":"その他",
        "range":"0～5",
        "damage":"-",
        "damageType":"-",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"機体ではなくマスが対象となる。目標のマスとその四辺に隣接しているすべての機体は次のラウンドの間、回避値が＋６される。",
        "maxLimit":1
       },
       {
        "name":"ホバー",
        "rank":"A",
        "type":"補助",
        "range":"-",
        "damage":"-",
        "damageType":"-",
        "mountPosition":"脚各１",
        "minLimit":2,
        "equipSamePosition":false,
        "effect":"１枚では使用不可。白兵には使用不可。<br/>移動、突撃時に移動力を＋２し、瓦礫、砂地、水地への侵入に必要な追加移動力を無視できる。水地では高低差を無視し、水面の高度に存在するものとして扱う。",
        "maxLimit":2
       },
       {
        "name":"防水幕",
        "rank":"A",
        "type":"補助",
        "range":"-",
        "damage":"-",
        "damageType":"-",
        "mountPosition":"胴",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"水地への侵入に必要な追加移動力を無視する",
        "maxLimit":1
       },
       {
        "name":"追加装甲",
        "rank":"A",
        "type":"装甲",
        "range":"-",
        "damage":"-",
        "damageType":"-",
        "mountPosition":"全部位",
        "minLimit":1,
        "equipSamePosition":true,
        "effect":"手札にこの武装がある場合、破壊することで射撃ダメージを全て防げる。<br/>この武装がプロットエリアにある場合、上記をすべての種類のダメージに対して適用できる。<br/>この武装は複数搭載できない。",
        "maxLimit":1
       },
      ]
    }
}

