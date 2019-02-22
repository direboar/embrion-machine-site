import Machine from "@/model/embriomachine/machine";
import firebase from "firebase";

export default class FirebaseStorage {
  constructor() {
    this.machines = []
    //realtime databaseのルートノード。configで設定。
    this.headerdb = process.env.HEADER_DB;
    this.detaildb = process.env.DETAIL_DB;
    this.pagesize = 15;
  }

  //FIXME 全般的にcallback、error見直したい
  getMachineHeaderAndDetail(id, callback, error) {
    firebase.database().ref(this.headerdb + "/" + id).once('value').then((snapshot) => {
      if (!snapshot.exists()) {
        error("指定されたIDの機体データが取得できません。")
        //detailがとれない。例外処理
      } else {
        let childData = snapshot.val();
        childData.id = snapshot.key;
        let header = Machine.fromRealtimeDatabaseToHeader(snapshot.key, childData);
        let retVal = this.getMachineDetail(header, callback, error)
        return retVal;
      }
    }).catch(function (e) {
      error("通信エラーが発生しました。" + JSON.stringify(e))
    });
  }

  async getMachineDetail(header, callback, error) {
    //1.編集対象のデータをdetailのDBからフェッチする。
    let query = firebase
      .database()
      .ref(this.detaildb)
      .orderByChild("id")
      .equalTo(header.id)
      .limitToFirst(1);

    try {
      let snapshot = await query.once("value");
      if (!snapshot.exists()) {
        error("機体データが取得できません。データが破損しています。")
        //detailがとれない。例外処理
      } else {
        //2.両方のDBのデータをマージしてモデルを復元する。
        snapshot.forEach(childSnapshot => {
          let detailKey = childSnapshot.key;
          let detail = childSnapshot.val();
          let machine = Machine.fromRealtimeDatabaseToEntity(
            header.id,
            header,
            detailKey,
            detail
          );
          //callbackメソッドを呼ぶ。
          callback(machine, detailKey);
        });
      }
    } catch (e) {
      error("通信エラーが発生しました。" + JSON.stringify(e))
    }
  }

  async loadFromFirebase(userName, machineName, showOwner, user, callback, error) {
    var query = firebase.database().ref(this.headerdb);
    if (userName !== "") {
      query = query.orderByChild("userName").equalTo(userName);
    } else if (machineName !== "") {
      query = query.orderByChild("name").equalTo(machineName);
    } else if (showOwner && user != null) {
      query = query.orderByChild("userId").equalTo(user.uid);
    } else {
      query = query.orderByChild("orderBy");
    }

    query = query.limitToFirst(this.pagesize);

    try {
      let snapshot = await query.once("value");
      let machines = [];
      snapshot.forEach(childSnapshot => {
        let key = childSnapshot.key;
        let childData = childSnapshot.val();

        childData.id = key;
        //一覧画面には、ヘッダDBのレコードをそのまま設定する。
        //ただしキーを保持できないので、レコードの属性に生成されたキーを追加する。
        machines.push(Machine.fromRealtimeDatabaseToHeader(key, childData));
        let hasNxtPage = machines.length == this.pagesize;
        callback(machines, hasNxtPage);
      });
    } catch (e) {
      error("通信エラーが発生しました。" + JSON.stringify(e))
    }
  }

  async fetchNextPageFromFirebase(lastSearchedMachineHeader, userName, machineName, showOwner, user, callback, error) {
    var query = firebase.database().ref(this.headerdb);
    if (userName !== "") {
      query = query
        .orderByChild("userName")
        //検索時に、＜を実現する場合に必要。@see https://firebase.google.com/docs/database/admin/retrieve-data?hl=ja
        .startAt(userName, lastSearchedMachineHeader.id + "\uf8ff")
        .endAt(userName);
    } else if (machineName !== "") {
      query = query
        .orderByChild("name")
        .startAt(machineName, lastSearchedMachineHeader.id + "\uf8ff")
        .endAt(machineName);
    } else if (showOwner && user != null) {
      query = query
        .orderByChild("userId")
        .startAt(user.uid, lastSearchedMachineHeader.id + "\uf8ff")
        .endAt(user.uid);
    } else {
      query = query
        .orderByChild("orderBy")
        //検索時に、＜を実現する場合に必要。（数値型のためインクリメント。）
        .startAt(lastSearchedMachineHeader.orderBy, lastSearchedMachineHeader.id + "\uf8ff");
    }

    query = query.limitToFirst(this.pagesize);

    try {
      let snapshot = await query.once("value");
      let machines = [];
      snapshot.forEach(childSnapshot => {
        let key = childSnapshot.key;
        let childData = childSnapshot.val();
        childData.id = key;
        machines.push(Machine.fromRealtimeDatabaseToHeader(key, childData));
        // alert(JSON.stringify(childData))
      });

      let hasNxtPage = machines.length == this.pagesize;
      callback(machines, hasNxtPage);

    } catch (e) {
      error("通信エラーが発生しました。" + JSON.stringify(e))
    }
  }

  async saveToFirebase(machine, user, callback, error) {
    let userId = user === null ? "anonymous" : user.uid;
    let userName = user === null ? "anonymous" : user.displayName;

    machine.setUserIdAndUserName(userId, userName);
    machine.setLastUpdateTime(firebase.database.ServerValue.TIMESTAMP);

    try {
      //1.ヘッダをINSERT(Push)
      let updatedHeader = await firebase.database().ref(this.headerdb).push(machine.toRealtimeDatabaseHeaderObject());
      //2.登録日付順でソートする項目（update）を算出するためヘッダを再取得
      let updatedQuery = await firebase.database().ref(updatedHeader);
      let snapshot = await updatedQuery.once("value");

      //3.updatedを再計算してヘッダを再更新する。
      let updated = snapshot.val();
      let key = snapshot.key;
      machine.setId(key);
      await updatedQuery
        .update({
          orderBy: Machine.calcOrderBy(updated)
        });

      //4.detailをINSERT(Push)
      await firebase
        .database()
        .ref(this.detaildb)
        .push(machine.toRealtimeDatabaseDetailObject());

      callback();

    } catch (e) {
      error("通信エラーが発生しました。" + JSON.stringify(e))
      alert(e)
      return;
    }
  }

  async updateToFirebase(machine, callback, error) {
    machine.setLastUpdateTime(firebase.database.ServerValue.TIMESTAMP);
    //1.headerを更新する。

    let id = machine.getId();
    let detailId = machine.getDetailId();

    try {
      let headerRef =
        await firebase
        .database()
        .ref(this.headerdb + "/" + id);

      //1.headerを更新
      await headerRef.set(machine.toRealtimeDatabaseHeaderObject());
      //2.登録日付順でソートする項目（update）を算出するためヘッダを再取得
      let header = await headerRef.once("value");
      let updated = header.val();
      let key = header.key;
      machine.setId(key);
      //3.updatedを再計算してヘッダを再更新する。
      await headerRef
        .update({
          orderBy: Machine.calcOrderBy(updated)
        })
      //4.detailを更新(Push)
      await firebase
        .database()
        .ref(this.detaildb + "/" + detailId)
        .set(machine.toRealtimeDatabaseDetailObject());

      callback();

    } catch (e) {
      error("通信エラーが発生しました。" + JSON.stringify(e))
      return;
      //FIXME rollback
    }
  }

  async deleteFromFirebase(machine, callback, error) {
    let id = machine.getId()
    let detailId = machine.getDetailId()

    try {
      await firebase
        .database()
        .ref(this.headerdb + "/" + id)
        .remove();

      await firebase
        .database()
        .ref(this.detaildb + "/" + detailId)
        .remove();

      callback();

    } catch (e) {
      error("通信エラーが発生しました。" + JSON.stringify(e))
      return;
      //FIXME rollback
    }
  }

}
