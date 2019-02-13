import Machine from "@/model/embriomachine/machine";
import firebase from "firebase";

//FIXME つかってない。

export default class FirebaseStorage {
  constructor() {
    this.machines = []
    this.headerdb = "embriomachine/header";
    this.detaildb = "embriomachine/detail";
    this.pagesize = 15;
  }

  getMachineDetail(header, callback) {
    //1.編集対象のデータをdetailのDBからフェッチする。
    let query = firebase
      .database()
      .ref(this.detaildb)
      .orderByChild("id")
      .equalTo(header.id)
      .limitToFirst(1);

    query.once("value").then(snapshot => {
      //2.両方のDBのデータをマージしてモデルを復元する。
      snapshot.forEach(childSnapshot => {
        let detailKey = childSnapshot.key;
        let detail = childSnapshot.val();
        let machine = Machine.fromRealtimeDatabaseToEntity(
          header.id,
          header,
          detail
        );
        //callbackメソッドを呼ぶ。
        callback(machine, detailKey);
      });
    });
  }

  loadFromFirebase(userName, machineName, showOwner, user, callback) {
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

    query.once("value").then(snapshot => {
      let machines = [];
      snapshot.forEach(childSnapshot => {
        let key = childSnapshot.key;
        let childData = childSnapshot.val();

        childData.id = key;
        //一覧画面には、ヘッダDBのレコードをそのまま設定する。
        //ただしキーを保持できないので、レコードの属性に生成されたキーを追加する。
        machines.push(Machine.fromRealtimeDatabaseToHeader(key, childData));
      });

      let hasNxtPage = machines.length == this.pagesize ;
      callback(machines,hasNxtPage);
    });
  }

  fetchNextPageFromFirebase(lastSearchedMachineHeader, userName, machineName, showOwner, user, callback) {
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

    query.once("value").then(snapshot => {
      let machines = [];
      snapshot.forEach(childSnapshot => {
        let key = childSnapshot.key;
        let childData = childSnapshot.val();
        childData.id = key;
        machines.push(Machine.fromRealtimeDatabaseToHeader(key, childData));
        // alert(JSON.stringify(childData))
      });

      let hasNxtPage = machines.length == this.pagesize ;
      callback(machines,hasNxtPage);
      // this.find = "";
    });
  }

  saveToFirebase(machine, user, callback) {
    let userId = user === null ? "anonymous" : user.uid;
    let userName = user === null ? "anonymous" : user.displayName;

    machine.setUserIdAndUserName(userId, userName);
    machine.setLastUpdateTime(firebase.database.ServerValue.TIMESTAMP);

    //1.ヘッダを更新
    let updated = firebase
      .database()
      .ref(this.headerdb)
      .push(machine.toRealtimeDatabaseHeaderObject());

    let updatedQuery = firebase.database().ref(updated);

    updatedQuery.once("value").then(snapshot => {
      //2.登録日付順でソートする項目（update）を算出するためヘッダを再取得し、updatedを再計算して更新する。
      let updated = snapshot.val();
      let key = snapshot.key;
      machine.setId(key);

      updatedQuery
        .update({
          orderBy: Machine.calcOrderBy(updated)
        })
        .then(() => {
          //3.detailsを更新する。
          firebase
            .database()
            .ref(this.detaildb)
            .push(machine.toRealtimeDatabaseDetailObject());

          callback();
        });
    });

    //FIXME error
  }

  updateToFirebase(id, detailId, machine, callback) {
    machine.setLastUpdateTime(firebase.database.ServerValue.TIMESTAMP);
    //1.headerを更新する。

    let headerRef =
      firebase
      .database()
      .ref(this.headerdb + "/" + id);

    headerRef.set(machine.toRealtimeDatabaseHeaderObject())
      .then(() => {
        headerRef.once("value").then(snapshot => {
          //2.登録日付順でソートする項目（update）を算出するためヘッダを再取得し、updatedを再計算して更新する。
          let updated = snapshot.val();
          let key = snapshot.key;
          machine.setId(key);

          headerRef
            .update({
              orderBy: Machine.calcOrderBy(updated)
            })
            .then(() => {
              //detailを更新する。
              firebase
                .database()
                .ref(this.detaildb + "/" + detailId)
                .set(machine.toRealtimeDatabaseDetailObject())
                .then(() => {
                  callback();
                });
            });
        });
      });
  }

  deleteFromFirebase(id, detailId, callback) {
    firebase
      .database()
      .ref(this.headerdb + "/" + id)
      .remove()
      .then(() => {
        firebase
          .database()
          .ref(this.detaildb + "/" + detailId)
          .remove()
          .then(() => {
            callback();
          });
      });
  }


  // load(callback) {
  //   this.machines = [];

  //   var query = firebase
  //     .database()
  //     .ref("embriomachine")
  //     .orderByChild("orderBy")
  //     .limitToFirst(12);

  //   query.once("value").then(snapshot => {
  //     snapshot.forEach(childSnapshot => {
  //       let key = childSnapshot.key;
  //       let childData = childSnapshot.val();
  //       this.machines.push(
  //         Machine.fromRealtimeDatabaseObject(key, childData)
  //       );
  //     });
  //     callback();
  //     //   this.load = false;
  //   });
  // }

  // fetch(lastSearchedMachine, callback) {
  //   var query = firebase
  //     .database()
  //     .ref("embriomachine")
  //     .orderByChild("orderBy")
  //     .startAt(lastSearchedMachine.orderBy)
  //     .limitToFirst(13);

  //   query.once("value").then(snapshot => {
  //     snapshot.forEach(childSnapshot => {
  //       let key = childSnapshot.key;
  //       let childData = childSnapshot.val();

  //       //最終行のデータも取得されてしまうため、最終更新時間が同じデータは飛ばす。
  //       if (!(childData.lastUpdateTime === lastSearchedMachine.orderBy)) {
  //         this.machines.push(
  //           Machine.fromRealtimeDatabaseObject(key, childData)
  //         );
  //       }
  //     });
  //     //   this.seek = false;
  //     callback();
  //   });
  // }

  // save(machine) {
  //   machine.setLastUpdateTime(firebase.database.ServerValue.TIMESTAMP);

  //   let updated = firebase
  //     .database()
  //     .ref("embriomachine")
  //     .push(machine.toRealtimeDatabaseObject());

  //   let updatedQuery = firebase.database().ref(updated);

  //   updatedQuery.once("value").then(snapshot => {
  //     let updated = snapshot.val();

  //     updatedQuery
  //       .update({
  //         orderBy: Machine.getOrderBy(updated)
  //       })
  //       .then(() => {
  //         this.load = true;
  //       });
  //   });

  //   //FIXME error
  // }

  // update(id, machine) {
  //   machine.setLastUpdateTime(firebase.database.ServerValue.TIMESTAMP);
  //   firebase
  //     .database()
  //     .ref("embriomachine/" + id)
  //     .set(machine.toRealtimeDatabaseObject())
  //     .then(() => {
  //       this.load = true;
  //     });
  // }

  // delete(machine) {
  //   firebase
  //     .database()
  //     .ref("embriomachine/" + machine.id)
  //     .remove()
  //     .then(() => {
  //       this.load = true;
  //     });
  // }
}
