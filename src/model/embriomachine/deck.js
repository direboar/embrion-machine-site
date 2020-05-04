import Card from "@/model/embriomachine/card";

export default class Deck {

  constructor() {
    // 名前
    this.cards = [];
    this.addAlignment();

    this.deck = []; //山札
    this.discardTag = []; //捨札
    this.shuffleCount = 0; //シャッフルした回数
    this.drowCardCount = 0; //カードを引いた回数
  }

  addEquipments(equipments) {
    equipments.forEach(equipment => {
      if (!equipment.isTypeOf("補助") || equipment.name == "サテライトレーザー" || equipment.name =="低空飛行ユニット") {
        let card = new Card(equipment.name, equipment);
        this.addCard(card);
      }
    });
  }

  setMovility(movility) {
    for (let i = 1; i <= movility; i++) {
      let card = new Card("移動" + i);
      this.addCard(card);
    }
  }

  setArmor(armor) {
    for (let i = 0; i < armor; i++) {
      let card = new Card("装甲");
      this.addCard(card);
    }
  }

  setSize(size) {
    //TODO machineType.chargeCountを使うように修正
    this.addCard(new Card("突撃"));
    if (size === "LL") {
      this.addCard(new Card("突撃"));
    }
  }

  setEvadeRate(evadeRate) {
    this.evadeRate = evadeRate;
  }

  addAlignment() {
    let card = new Card("照準");
    this.addCard(card);
  }

  addCard(card) {
    this.cards.push(card);
  }

  //ゲームを始める
  shuffle(hands) {
    if (hands === undefined) hands = [];

    //1.デッキに詰めるカードを管理する配列を作成（コピー）
    let tmp = this.cards.concat();
    //tmpから、手札を削除する
    tmp = tmp.filter(t => hands.indexOf(t) === -1);

    //2.デッキに残っている枚数を算出し、一時変数に保持
    let deckSize = tmp.length

    //3.ランダムにカードを並び変えて、デッキにセットする。
    for (let i = 0; i < deckSize; i++) {
      let random = this.getRandomIntInclusive(0, tmp.length - 1);
      let c = tmp[random];
      this.deck.push(c);
      tmp = tmp.filter(t => t !== c);
    }

    this.shuffleCount++;
  }

  drowCards() {
    let hands = [];
    for (let i = 1; i <= this.evadeRate; i++) {
      if (this.deck.length === 0) {
        this.shuffle(hands);
      }
      hands.push(this.deck.shift());
    }
    this.drowCardCount++;
    return hands;
  }

  //包括的に 2 つの値の間のランダムな整数を得る
  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }
}
