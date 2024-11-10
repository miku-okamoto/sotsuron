  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore, doc, setDoc, collection, addDoc, getDoc, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

import { getStorage, ref, uploadBytes, getDownloadURL } from "https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.4/firebase-storage.js";

// Firebaseの自分用の設定を別ファイルから読み込む
import { firebaseConfig } from './firebaseMatching.js';

  const app = initializeApp(firebaseConfig);
  
  
  
const db = getFirestore(app);
const storage = getStorage(app);

const docId = localStorage.getItem('userCode'); // ここでuserCodeをdocIdとして使用

// グローバル変数として定義
let name, age, clas, zemi, born, live;

// Firestoreからデータを取得してフォームに反映
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // docIdが存在しない場合の処理
        if (!docId) {
            updateTable('ユーザーコードが存在しません');
            return;
        }

        // Firestoreからドキュメントを取得
        const docRef = doc(db, "users", docId);
        const docSnap = await getDoc(docRef);

        // ドキュメントが存在しない場合の処理
        if (!docSnap.exists()) {
            updateTable('該当する結果はありません');
            return;
        }

        // Firestoreから取得したデータをグローバル変数に格納
        const data = docSnap.data();
        name = data.name;
        age = data.age;
        clas = data.clas;
        zemi = data.zemi;
        born = data.born;
        live = data.live;

        // フォームの各フィールドにデータをセット
        document.getElementById("inputName").textContent = name || "";
        document.getElementById("inputAge").value = age || "";
        document.getElementById("inputClas").value = clas || "";
        document.getElementById("inputZemi").value = zemi || "";
        document.getElementById("inputBorn").value = born || "";
        document.getElementById("inputLive").value = live || "";

        // Firestore Storageから画像URLを取得
        const storageRef = ref(storage, `${docId}.jpeg`); // 画像パスは適宜変更
        const imageUrl = await getDownloadURL(storageRef);
        console.log("imegeUrl:" + imageUrl);

        // ページを更新
        updateTable(name, age, clas, zemi, born, live, imageUrl);
    } catch (e) {
        console.error("Error getting documents or images: ", e);
        updateTable('データの取得中にエラーが発生しました');
    }
});

// 保存ボタンのイベントリスナー
document.addEventListener("DOMContentLoaded", async () => {
    const saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", async () => {
        try {
            // ユーザーが入力したデータを取得
            const updatedName = document.getElementById("inputName").value;
            const updatedAge = document.getElementById("inputAge").value;
            const updatedClas = document.getElementById("inputClas").value;
            const updatedZemi = document.getElementById("inputZemi").value;
            const updatedBorn = document.getElementById("inputBorn").value;
            const updatedLive = document.getElementById("inputLive").value;

            // Firebaseにデータを上書き保存
            const docRef = doc(db, "users", docId);
            await setDoc(docRef, {
                name: updatedName,
                age: updatedAge,
                clas: updatedClas,
                zemi: updatedZemi,
                born: updatedBorn,
                live: updatedLive
            }, { merge: true });

            alert("データが更新されました！");

            // 元のHTMLページにリダイレクト
            window.location.href = "mypage.html";  // リダイレクト先のURLを指定
        } catch (error) {
            console.error("Error updating document: ", error);
            alert("データの保存に失敗しました。");
        }
    });
});

