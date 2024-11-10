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

// 全ての box1 要素を取得
const box1Elements = document.querySelectorAll('.box1');



// 各 box1 要素に対して処理を実行
box1Elements.forEach(async (box1Element) => {
    // box1 の id 属性から docId を取得（最初の 8 文字を取得）
    const fullId = box1Element.id;
    const docId = fullId.substring(0, 8); // 最初の 8 文字を取得




    // 画像の URL を取得するコードに docId を使用
    try {
        const storageRef = ref(storage, `${docId}.jpeg`); // 画像パスは適宜変更
        const imageUrl = await getDownloadURL(storageRef);

        // 画像要素を作成
        const photoElement = document.createElement('img');
        photoElement.src = imageUrl; // 画像の URL を設定
        photoElement.alt = "User Photo"; // alt 属性を設定

        // 画像を HTML に表示
        // box1 要素内の id が ikon である要素を取得
        const photoContainer = box1Element.querySelector('.ikon');
        if (photoContainer) {
            photoContainer.innerHTML = ""; // 既存の内容をクリア
            photoContainer.appendChild(photoElement); // 画像要素を追加
        } else {
            console.warn(`写真表示用コンテナが見つかりません: ${docId}`);
        }
    } catch (e) {
        console.error(`Error getting image for ${docId}: `, e);

        // 画像がない場合の表示
        const photoContainer = box1Element.querySelector('.ikon');
        if (photoContainer) {
            photoContainer.innerHTML = '<p>写真がありません</p>'; // 画像がない場合の表示
        }
    }
});




document.querySelectorAll('.box1').forEach(box => {
  box.addEventListener('click', async function() {
    // box1のIDを取得
     const fullId = box.id;
    const docId = fullId.substring(0, 8);

    // IDが無ければ何もせず終了
    if (!docId) return;

    try {
        // Firestoreからドキュメントを取得
        const docRef = doc(db, "users", docId);
        const docSnap = await getDoc(docRef);

        // ドキュメントが存在しない場合の処理
        if (!docSnap.exists()) {
            tableBody.innerHTML = '<tr><td colspan="3">該当する結果はありません</td></tr>';
            return;
        }

        const data = docSnap.data();
        
        // Firestore Storageから画像URLを取得
        const storageRef = ref(storage, `${docId}.jpeg`); // 画像パスは適宜変更
        const imageUrl = await getDownloadURL(storageRef);

        // データをURLパラメータとして渡す
        const queryParams = new URLSearchParams({
            name: data.name,
            age: data.age,
            clas: data.clas,
            zemi: data.zemi,
            born: data.born,
            live: data.live,
            photo: imageUrl,  // 画像URLを追加
            gakuseki: data.gakuseki, 
            info: fullId  
        });

        // 新しいページにリダイレクト
        window.location.href = `profile.html?${queryParams.toString()}`;
    } catch (e) {
        console.error("Error getting documents or images: ", e);
        tableBody.innerHTML = '<tr><td colspan="3">データの取得中にエラーが発生しました</td></tr>';
    }
  });
});



// // This is a JavaScript file

//   // Import the functions you need from the SDKs you need
//   import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
//   // TODO: Add SDKs for Firebase products that you want to use
//   // https://firebase.google.com/docs/web/setup#available-libraries

// import { getFirestore, doc, collection, addDoc, getDoc, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

//   // Your web app's Firebase configuration
//   const firebaseConfig = {
//     apiKey: "AIzaSyAXFDuJo_HKFjcfvqvldnamjyp1Vrmihx4",
//     authDomain: "machining-5446a.firebaseapp.com",
//     projectId: "machining-5446a",
//     storageBucket: "machining-5446a.appspot.com",
//     messagingSenderId: "116660993049",
//     appId: "1:116660993049:web:523c1323924ddfc993be88"
//   };
//   const app = initializeApp(firebaseConfig);


// const db = getFirestore(app);


// document.querySelectorAll('.box1').forEach(box => {
//   box.addEventListener('click', async function() {
//     // box1のIDを取得
//     const docId = box.id;

//     // IDが無ければ何もせず終了
//     if (!docId) return;

//     try {
//         // Firestoreからドキュメントを取得
//         const docRef = doc(db, "users", docId);
//         const docSnap = await getDoc(docRef);

//         // ドキュメントが存在しない場合の処理
//         if (!docSnap.exists()) {
//             tableBody.innerHTML = '<tr><td colspan="3">該当する結果はありません</td></tr>';
//             return;
//         }

//         // データをURLパラメータとして渡す
//         const queryParams = new URLSearchParams({
//             name: docSnap.data().name,
//             age: docSnap.data().age,
//             clas: docSnap.data().clas,
//             zemi: docSnap.data().zemi,
//             born: docSnap.data().born,
//             live: docSnap.data().live
//         });

//         // 新しいページにリダイレクト
//         window.location.href = `profile.html?${queryParams.toString()}`;
//     } catch (e) {
//         console.error("Error getting documents: ", e);
//         tableBody.innerHTML = '<tr><td colspan="3">データの取得中にエラーが発生しました</td></tr>';
//     }
//   });
// });



