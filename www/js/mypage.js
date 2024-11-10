// This is a JavaScript file

// This is a JavaScript file
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore, doc, collection, addDoc, getDoc, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

import { getStorage, ref, uploadBytes, getDownloadURL } from "https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.4/firebase-storage.js";

import { firebaseConfig } from './firebaseMatching.js';

  const app = initializeApp(firebaseConfig);
  
  
  
const db = getFirestore(app);
const storage = getStorage(app);


// ローカルストレージからuserCodeを取得
const docId = localStorage.getItem('userCode'); // ここでuserCodeをdocIdとして使用

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

        // Firestoreから取得したデータ
        const data = docSnap.data();

        // 各フィールドを個別に取得
        const name = data.name;
        const age = data.age;
        const clas = data.clas;
        const zemi = data.zemi;
        const born = data.born;
        const live = data.live;

        // Firestore Storageから画像URLを取得
        const storageRef = ref(storage, `${docId}.jpeg`); // 画像パスは適宜変更
        const imageUrl = await getDownloadURL(storageRef);
        console.log("storageRef:" + storageRef);

        // ページを更新
        updateTable(name, age, clas, zemi, born, live, imageUrl);
        console.log("imegeUrl:" + imageUrl);
    } catch (e) {
        console.error("Error getting documents or images: ", e);
        updateTable('データの取得中にエラーが発生しました');
    }
});



// テーブルの更新
function updateTable(name, age, clas, zemi, born, live, photo) {
    console.log("photo:" + photo);
    const dataname = document.querySelector("#name");
    if (name) {
        const dataRow = `<tr><td>${name}</td></tr>`;
        dataname.innerHTML = dataRow;
    } else {
        dataname.innerHTML = '<tr><td colspan="3">データがありません</td></tr>';
    }

    const dataage = document.querySelector("#age");
    if (age) {
        const dataRow = `<tr><td>${age}</td></tr>`;
        dataage.innerHTML = dataRow;
    } else {
        dataage.innerHTML = '<tr><td colspan="3">データがありません</td></tr>';
    }

    const dataclas = document.querySelector("#clas");
    if (clas) {
        const dataRow = `<tr><td>${clas}</td></tr>`;
        dataclas.innerHTML = dataRow;
    } else {
        dataclas.innerHTML = '<tr><td colspan="3">-</td></tr>';
    }

    const datazemi = document.querySelector("#zemi");
    if (zemi) {
        const dataRow = `<tr><td>${zemi}</td></tr>`;
        datazemi.innerHTML = dataRow;
    } else {
        datazemi.innerHTML = '<tr><td colspan="3">データがありません</td></tr>';
    }

    const databorn = document.querySelector("#born");
    if (born) {
        const dataRow = `<tr><td>${born}</td></tr>`;
        databorn.innerHTML = dataRow;
    } else {
        databorn.innerHTML = '<tr><td colspan="3">データがありません</td></tr>';
    }

    const datalive = document.querySelector("#live");
    if (live) {
        const dataRow = `<tr><td>${live}</td></tr>`;
        datalive.innerHTML = dataRow;
    } else {
        datalive.innerHTML = '<tr><td colspan="3">データがありません</td></tr>';
    }

    // 画像の表示処理
    const photoContainer = document.querySelector("#photo"); // 画像を表示する要素を取得

    if (photo) {
        const imgElement = document.createElement("img");
        imgElement.src = photo;
        imgElement.alt = "User Photo";
        photoContainer.innerHTML = "";      // 既存の内容をクリア
        photoContainer.appendChild(imgElement);
    } else {
        photoContainer.innerHTML = '<p>写真がありません</p>'; // 画像がない場合の表示
    }
}

