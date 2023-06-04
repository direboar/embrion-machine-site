import Machine from "@/model/embriomachine/machine";
import firebase from "firebase";

export default class FirebaseStorage {
  constructor() {
    this.machines = []
    //realtime databaseのルートノード。configで設定。
    this.headerdb = process.env.HEADER_DB;
    this.detaildb = process.env.DETAIL_DB;
    this.fileUploadDir = process.env.FILE_UPLOAD_DIR;
    this.pagesize = 15;
  }

  //FIXME コールバックを取るのではなく外側でハンドリングさせる
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

  //FIXME コールバックを取るのではなく外側でハンドリングさせる
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

  async loadFromFirebase(userName, machineName) {
    var query = firebase.database().ref(this.headerdb);
    if (userName !== "") {
      query = query.orderByChild("userName").equalTo(userName);
    } else if (machineName !== "") {
      query = query.orderByChild("name").equalTo(machineName);
      // } else if (showOwner && user != null) {
      //   query = query.orderByChild("userId").equalTo(user.uid);
    } else {
      query = query.orderByChild("orderBy");
    }

    query = query.limitToFirst(this.pagesize);

    //    try {
    let snapshot = await query.once("value");
    let machines = [];
    snapshot.forEach(childSnapshot => {
      let key = childSnapshot.key;
      let childData = childSnapshot.val();

      childData.id = key;
      //一覧画面には、ヘッダDBのレコードをそのまま設定する。
      //ただしキーを保持できないので、レコードの属性に生成されたキーを追加する。
      machines.push(Machine.fromRealtimeDatabaseToHeader(key, childData));
    });
    let hasNextPage = machines.length == this.pagesize;
    return {
      machines: machines,
      hasNextPage: hasNextPage
    };
  }

  async fetchNextPageFromFirebase(lastSearchedMachineHeader, userName, machineName) {
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
      // } else if (showOwner && user != null) {
      //   query = query
      //     .orderByChild("userId")
      //     .startAt(user.uid, lastSearchedMachineHeader.id + "\uf8ff")
      //     .endAt(user.uid);
    } else {
      query = query
        .orderByChild("orderBy")
        //検索時に、＜を実現する場合に必要。（数値型のためインクリメント。）
        .startAt(lastSearchedMachineHeader.orderBy, lastSearchedMachineHeader.id + "\uf8ff");
    }

    query = query.limitToFirst(this.pagesize);

    let snapshot = await query.once("value");
    let machines = [];
    snapshot.forEach(childSnapshot => {
      let key = childSnapshot.key;
      let childData = childSnapshot.val();
      childData.id = key;
      machines.push(Machine.fromRealtimeDatabaseToHeader(key, childData));
    });

    let hasNxtPage = machines.length == this.pagesize;
    return {
      machines: machines,
      hasNextPage: hasNxtPage
    };

  }

  async saveToFirebase(machine, userName) {
    if (userName === null) userName = "anonimous";
    // let userId = user === null ? "anonymous" : user.uid;
    // let userName = user === null ? "anonymous" : user.displayName;

    machine.setUserIdAndUserName(userName, userName);
    machine.setLastUpdateTime(firebase.database.ServerValue.TIMESTAMP);

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

    return machine;
  }

  async updateToFirebase(machine) {
    machine.setLastUpdateTime(firebase.database.ServerValue.TIMESTAMP);
    //1.headerを更新する。

    let id = machine.getId();
    let detailId = machine.getDetailId();

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

    return machine;
  }

  //FIXME コールバックを取るのではなく外側でハンドリングさせる
  async deleteFromFirebase(machine, callback, error) {
    let id = machine.getId()
    let detailId = machine.getDetailId()

    //削除時に、idがnullであるとrootのノードが削除される可能性があるので、念のためチェックする。
    if (!id) {
      error("削除対象のIDが取得できませんでした。削除を中断します。");
      return;
    }
    if (!detailId) {
      error("削除対象のdetailIdが取得できませんでした。削除を中断します。");
      return;
    }

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

  //同期処理とする必要はないので、非同期とする。
  //id: machineのid,file:アップロードするBLOB Data
  uploadFile(id, file, contentType, callback, error) {
    console.log("111")
    error("ファイルのアップロードのサポートを停止しました")
    // let storageRef = firebase.storage().ref();
    // let imageRef = storageRef.child(this.fileUploadDir + "/" + id);

    // //JavaScriptのbase64表現のヘッダを削除する。
    // //https://qiita.com/weal/items/1a2af81138cd8f49937d 「data:mime/type;base64,...Base64String...という形式なのでカンマ以降を抜き出せばよい。」
    // let base64 = file.replace(/data:.*\/*;base64,/, "");
    // imageRef.putString(base64, "base64").then(() => {
    //   let newMetadata = {
    //     contentType: contentType,
    //     cacheControl: 'public,max-age=300',
    //   };
    //   imageRef.updateMetadata(newMetadata).catch((e)=>{alert(e)});
    //   callback()
    // }).catch((e) => {
    //   error(e)
    // })

  }

  //同期処理とする必要はないので、非同期とする。
  readFile(id, callback, error) {
    // let storage = firebase.storage();
    // let pathReference = storage.ref(this.fileUploadDir + "/" + id);
    // pathReference
    //   .getDownloadURL()
    //   .then(url => {
    //     //Axiosを使いたかったが以下のIssueにハマったのでやめる。
    //     //https://github.com/axios/axios/issues/1392

    //     var xhr = new XMLHttpRequest();
    //     xhr.responseType = "blob";
    //     xhr.onload = () => {
    //       let fileReader = new FileReader();
    //       fileReader.onload = data => {
    //         // //発生しないはずだが念のため。
    //         // if (xhr.status === 200) {
    //           let file = data.target.result;
    //           callback(file);
    //         // }
    //       };
    //       fileReader.readAsDataURL(xhr.response);
    //     };
    //     xhr.open("GET", url);
    //     xhr.send();
    //   })
    //   .catch(function (e) {
    //     if (e.code_ === "storage/object-not-found") {
    //       //status400の場合。
    //       //登録されていないだけなので無視
    //     } else {
    //       error(e);
    //     }
    //   });
  }

}
