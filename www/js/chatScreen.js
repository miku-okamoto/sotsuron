// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, query, orderBy, onSnapshot, limit } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

import { firebaseConfig } from './firebase0823.js';


// Initialize Firebase
let app;
try {
    app = initializeApp(firebaseConfig);
    // 成功した場合の処理．今回はここでは何もしない．
    console.log("Firebase initialize success!");
} catch (error) {
    alert(`Firebase app initialize error: ${error}`);
}

// ====================================
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


// 書き込み
document.querySelector("#MesSave").addEventListener("click", async function () {
    const message = document.querySelector("#MesText").value;

    
    try {
        const docRef = await addDoc(collection(db, "users"), {
            message: message,
            to: "k21h2078",
            me: "k21h2025",
            timestamp: new Date()  // 現在の日時を追加
        });
        console.log("Document written with ID: ", docRef.id);
        document.querySelector("#MesText").value = "";
        
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});


// 読み取り
document.addEventListener("DOMContentLoaded", function () {
    // データベースの参照を作成
    const usersRef = collection(db, "users");

    // データを登録日時でソートするためのクエリ
    const q = query(usersRef, orderBy("timestamp", "asc"));

    const container = document.querySelector('.mesContents');




// ページが完全に読み込まれてからスクロールを一番下に設定
    window.onload = function () {
        // 少し遅らせてからスクロールを設定
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100); // 100ミリ秒の遅延
    };






    // クエリのスナップショットをリアルタイムで監視
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        // mesContentsクラスのdiv要素を取得
        //const container = document.querySelector('.mesContents');

        // 以前の内容をクリア
        container.innerHTML = "";

        // 該当するレコードがない場合の処理
        if (querySnapshot.empty) {
            container.innerHTML = '<div>該当する結果はありません</div>';
            return;
        }

        // div要素を生成してメッセージを表示
        querySnapshot.forEach((doc) => {
            const me = doc.data().me;

            if (me === "k21h2025" || me === "k21h2078") {
                const item = document.createElement('div');
                item.textContent = `${doc.data().message}`;

                // クラス名を追加
                if (me === "k21h2025") {
                    item.classList.add('myMes');
                } else if (me === "k21h2078") {
                    item.classList.add('k21h2078Mes');
                }

                container.appendChild(item);
            }
        });

         // DOMの更新が完了した後にスクロールを一番下に移動
        requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
        });

    }, (error) => {
        console.error("Error getting documents: ", error);
    });

    // 画面が閉じられるときにスナップショットの監視を停止
    window.addEventListener("beforeunload", () => {
        unsubscribe();
    });
});












/*

 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAy8AOWIJ53eM2u92Z8FAk9pArubKTrWaM",
    authDomain: "soturonn-87e60.firebaseapp.com",
    projectId: "soturonn-87e60",
    storageBucket: "soturonn-87e60.appspot.com",
    messagingSenderId: "58675145698",
    appId: "1:58675145698:web:a7f024d6b3b7e66862e7bb",
    measurementId: "G-020975BTGB"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

        // メッセージの参照
        const messagesRef = database.ref('messages');

        // 送信ボタンのクリックイベント
        document.getElementById('send-button').addEventListener('click', () => {
            const messageInput = document.getElementById('message-input').value;

            if (messageInput.trim() !== "") {
                // メッセージを保存する
                const newMessageRef = messagesRef.push();
                newMessageRef.set({
                    text: messageInput,
                    user: 'user1', // ここでユーザーの種類を決定
                    timestamp: Date.now()
                });

                // 入力欄をクリア
                document.getElementById('message-input').value = '';
            }
        });

        // メッセージをリアルタイムで受け取る
        messagesRef.on('child_added', (snapshot) => {
            const message = snapshot.val();
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');

            // ユーザーによってスタイルを変更
            if (message.user === 'user1') {
                messageElement.classList.add('user1');
            } else {
                messageElement.classList.add('user2');
            }

            const pElement = document.createElement('p');
            pElement.textContent = message.text;

            messageElement.appendChild(pElement);
            document.getElementById('chat-messages').appendChild(messageElement);

            // メッセージ表示領域をスクロール
            document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
        });

        */