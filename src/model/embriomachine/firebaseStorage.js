import Machine from "@/model/embriomachine/machine";
import firebase from "firebase";

//FIXME つかってない。

export default class FirebaseStorage {
  constructor() {
    this.machines = []
    this.headerdb = "embriomachine/header";
    this.detaildb = "embriomachine/detail";
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

    query = query.limitToFirst(12);

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

      callback(machines);
    });
  }

  fetchNextPageFromFirebase(lastSearchedMachineHeader, userName, machineName, showOwner, user, callback) {
    var query = firebase.database().ref(this.headerdb);
    if (userName !== "") {
      query = query
        .orderByChild("userName")
        .startAt(userName, lastSearchedMachineHeader.id);
    } else if (machineName !== "") {
      query = query
        .orderByChild("name")
        .startAt(machineName, lastSearchedMachineHeader.id);
    } else if (showOwner && user != null) {
      query = query
        .orderByChild("userId")
        .startAt(user.uid, lastSearchedMachineHeader.id);
    } else {
      query = query
        .orderByChild("orderBy")
        .startAt(Machine.getOrderBy(lastSearchedMachineHeader), lastSearchedMachineHeader.id);
    }

    query = query.limitToFirst(13);

    query.once("value").then(snapshot => {
      let machines = [];
      snapshot.forEach(childSnapshot => {
        let key = childSnapshot.key;
        let childData = childSnapshot.val();
        //最終行のデータも取得されてしまうため、最終更新時間が同じデータは飛ばす。
        if (key === lastSearchedMachineHeader.id) {
        } else {
          if (!this.filter(childData,userName, machineName, showOwner, user)) {
            childData.id = key;
            machines.push(Machine.fromRealtimeDatabaseToHeader(key, childData));
          }
        }
      });
      callback(machines);
      // this.find = "";
    });
  }

  //ページングで、条件一致で検索した場合、equalTo(値、キー)で正しく実装できない。
  //そのため＜条件で取得し、プログラム側で名称が異なる場合は再取得しない処理を実装する。
  filter(machine,userName, machineName, showOwner, user) {
    if (userName !== "" && userName !== machine.userName) {
      return true;
    }
    if (machineName !== "" && name !== machine.name) {
      return true;
    }
    if (
      showOwner &&
      user != null &&
      user.uid !== machine.userId
    ) {
      return true;
    }
    return false;
  }

  saveToFirebase(machine, user, callback) {
    let userId = user === null ? "anonimous" : user.uid;
    let userName = user === null ? "anonimous" : user.displayName;

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
          orderBy: Machine.getOrderBy(updated)
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
              orderBy: Machine.getOrderBy(updated)
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
