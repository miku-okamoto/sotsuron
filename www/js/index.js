 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

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

/* ----- Authentication -----*/
const auth = getAuth();


/*  -----ログイン--------- */
document.querySelector("#logIn").addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.querySelector("#email2").value;
    const password = document.querySelector("#password2").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // ログイン成功
            const user = userCredential.user;


            // メールアドレスからドメインを除いた部分を取得
            const userCode = email.split('@')[0];
            
            // ユーザーコードをコンソールに表示
            console.log(`User code: ${userCode}`);
            
          // userCode をローカルストレージに保存
            localStorage.setItem('userCode', userCode);

            // ...
            alert("ログインしました");
            console.log(`login user: ${JSON.stringify(user)}`);
            
            // topSec.htmlに遷移
            window.location.href = "topSec.html";
        })
        .catch((error) => {
            // エラーハンドリング
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
            alert(`login error: Code=${errorCode}, Message=${errorMessage}`);
        });
});

/* ---- ユーザが認証（ログイン）しているかどうかを監視するリスナー -------- */

// 認証されている場合のみ画面表示するHTMLブロック
const loginUserEl = document.querySelector("#loginUser");

auth.onAuthStateChanged(function (user) {
    if (user) {
        // ユーザーがログインしている場合
        loginUserEl.style.display = 'block';
        console.log("User is authenticated");
    } else {
        // ユーザーがログアウトしている場合
        loginUserEl.style.display = 'none';
        console.log("User is not authenticated");
    }
});
