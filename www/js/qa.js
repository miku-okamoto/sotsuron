/*タブ選択*/

document.addEventListener('DOMContentLoaded', function () {
    // クラス名 ".qaSubIcon" を持つ全ての要素にクリックイベントリスナーを追加
    document.querySelectorAll('.qaSubIcon').forEach(function (element) {
        element.addEventListener('click', function () {
            const index = this.getAttribute('data-index');

            // クラス名 ".qaContents" を持つ全ての要素を非表示にする
            document.querySelectorAll('.qaContents').forEach(function (content) {
                content.style.display = 'none';
            });

            // 特定のIDを持つ要素を表示する
            document.getElementById('sub' + index).style.display = 'block';

            //クリックした要素の背景だけ.activeを追加
            document.getElementById('wrap1').classList.remove('active');
            document.getElementById('wrap2').classList.remove('active');
            document.getElementById('wrap3').classList.remove('active');
            document.getElementById('wrap4').classList.remove('active');
            document.getElementById('wrap5').classList.remove('active');
            document.getElementById('wrap' + index).classList.toggle('active');

        });
    });

    // クラス名 ".qaAllSubIcon" を持つ全ての要素にクリックイベントリスナーを追加
    document.querySelectorAll('.qaAllSubIcon').forEach(function (element) {
        element.addEventListener('click', function () {
            const index = this.getAttribute('data-index');

            // クラス名 ".qaAllContents" を持つ全ての要素を非表示にする
            document.querySelectorAll('.qaAllContents').forEach(function (content) {
                content.style.display = 'none';
            });

            // 特定のIDを持つ要素を表示する
            document.getElementById('all' + index).style.display = 'block';

            //クリックした要素の背景だけ.activeを追加
            document.getElementById('qaAll1').classList.remove('qaAllactive');
            document.getElementById('qaAll2').classList.remove('qaAllactive');
            document.getElementById('qaAll3').classList.remove('qaAllactive');
            document.getElementById('qaAll' + index).classList.toggle('qaAllactive');
        });
    });

    // クラス名 ".qaClassSubIcon" を持つ全ての要素にクリックイベントリスナーを追加
    document.querySelectorAll('.qaClassSubIcon').forEach(function (element) {
        element.addEventListener('click', function () {
            const index = this.getAttribute('data-index');

            // クラス名 ".qaAllContents" を持つ全ての要素を非表示にする
            document.querySelectorAll('.qaClassContents').forEach(function (content) {
                content.style.display = 'none';
            });

            // 特定のIDを持つ要素を表示する
            document.getElementById('class' + index).style.display = 'block';

            //クリックした要素の背景だけ.qaClassactiveを追加
            document.getElementById('qaClass1').classList.remove('qaClassactive');
            document.getElementById('qaClass2').classList.remove('qaClassactive');
            document.getElementById('qaClass' + index).classList.toggle('qaClassactive');
        });
    });

    // クラス名 ".qaCategoryIcon" を持つ全ての要素にクリックイベントリスナーを追加
    document.querySelectorAll('.qaCategoryIcon').forEach(function (element) {
        element.addEventListener('click', function () {
            const index = this.getAttribute('data-index');


            //クリックした要素の背景だけ.activeを追加
            document.getElementById('qaCategory1').classList.remove('qaCategoryactive');
            document.getElementById('qaCategory2').classList.remove('qaCategoryactive');
            document.getElementById('qaCategory3').classList.remove('qaCategoryactive');
            document.getElementById('selectClass').classList.remove('selectClassactive');
            document.getElementById('qaCategory' + index).classList.toggle('qaCategoryactive');
            if (index == 1) {
                document.getElementById('selectClass').classList.toggle('selectClassactive');
            }
        });
    });

    // クラス名 ".qaContents" を持つ全ての要素を非表示にする
    document.querySelectorAll('.qaContents').forEach(function (content) {
        content.style.display = 'none';
    });

    // クラス名 ".qaAllContents" を持つ全ての要素を非表示にする
    document.querySelectorAll('.qaAllContents').forEach(function (content) {
        content.style.display = 'none';
    });

    // クラス名 ".qaAllContents" を持つ全ての要素を非表示にする
    document.querySelectorAll('.qaClassContents').forEach(function (content) {
        content.style.display = 'none';
    });



    // IDが "sub1" の要素を表示する
    document.getElementById('sub1').style.display = 'block';
    // IDが "wrap1" の要素を表示する
    document.getElementById('wrap1').classList.toggle('active');

    // IDが "all1" の要素を表示する
    document.getElementById('all1').style.display = 'block';
    // IDが "qaAll1" の要素を表示する
    document.getElementById('qaAll1').classList.toggle('qaAllactive');

    // IDが "class1" の要素を表示する
    document.getElementById('class1').style.display = 'block';
    // IDが "qaClass1" の要素を表示する
    document.getElementById('qaClass1').classList.toggle('qaClassactive');
});

/*タブ選択ここまで*/










/*ここからFirebase 質問*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, query, orderBy, onSnapshot, where, limit } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

import { getStorage, ref, uploadBytes, getDownloadURL } from "https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.4/firebase-storage.js";

import { firebaseConfig } from './firebaseMatching.js';


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
const storage = getStorage(app);
console.log("storage:" + storage);

// 書き込み
document.querySelector("#QAsave").addEventListener("click", async function () {

    //投稿ボタンを押したときに displayUserCode を呼び出す
    const userCode = getUserCode();
    displayUserCode(userCode);

    const shitsumon = document.querySelector("#qaText").value;
    //const last = document.querySelector("#lastName").value;
    //const born = parseInt(document.querySelector("#birthYear").value, 10);

    // 質問が入力されていない場合の処理
    if (shitsumon.trim() === "") {
        alert("質問が入力されていません");
        return; // 処理を中断
    }

    // .qaCategoryactiveクラスを持つ要素を取得
    let category = 0; // デフォルト値
    let jyugyou = null; // デフォルト値


    if (document.querySelector("#qaCategory1.qaCategoryactive")) {
        category = 1;
        let selectElement = document.querySelector("#selectClass");
        let selectedValue = selectElement.value;  // 選択されているoptionのvalueを取得
        jyugyou = selectElement.value;  // 選択されているoptionのvalueを取得
        console.log("選択されたoptionのvalue:", selectedValue);
    } else if (document.querySelector("#qaCategory2.qaCategoryactive")) {
        category = 2;
    } else if (document.querySelector("#qaCategory3.qaCategoryactive")) {
        category = 3;
    }

    // カテゴリーが選択されていない場合の処理
    if (category === null) {
        alert("カテゴリーが選択されていません");
        return; // 処理を中断
    }

    try {
        const docRef = await addDoc(collection(db, "qa"), {
            shitsumon: shitsumon,
            category: category,
            jyugyou: jyugyou,
            kaiketsu: 0,
            timestamp: new Date(),  // ここでタイムスタンプを追加
            userCode: userCode
        });
        console.log("Document written with ID: ", docRef.id);
        document.querySelector("#qaText").value = "";
        document.getElementById('qaCategory1').classList.remove('qaCategoryactive');
        document.getElementById('qaCategory2').classList.remove('qaCategoryactive');
        document.getElementById('qaCategory3').classList.remove('qaCategoryactive');
        document.getElementById('selectClass').classList.remove('selectClassactive');
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});




//読み込み


// 返信データを読み込む関数
async function loadReplies(docId) {
    const replyCollection = collection(db, "replay");
    const q = query(replyCollection, orderBy("timestamp", "asc"));

    const qaWrap = document.querySelector('.qaWrap');
    if (!qaWrap) {
        console.error("Element with class 'qaWrap' not found.");
        return;
    }

    // 既存の返信データをクリア
    document.querySelectorAll('.replyItem').forEach(function (item) {
        item.remove();
    });

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No replies found.");
            return;
        }

        querySnapshot.forEach((doc) => {
            const replyData = doc.data();
            // データ内の shitsumondocId が現在の docId と一致する場合にのみ表示
            if (replyData.shitsumondocId === docId) {
                const replyTimestamp = new Date(replyData.timestamp.seconds * 1000);
                const formattedReplyTimestamp = replyTimestamp.toLocaleString('ja-JP', {
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                // replayUserCode に基づいて表示名を決定
                let userName;
                if (replyData.replayUserCode === 'k21h2025') {
                    userName = 'みく';
                } else if (replyData.replayUserCode === 'k21h2078') {
                    userName = 'みう';
                } else if (replyData.replayUserCode === 'k99h9999') {
                    userName = 'てすと';
                } else if (replyData.replayUserCode === 'k44h4444') {
                    userName = 'よにんめ';
                } else if (replyData.replayUserCode === 'k24f2092') {
                    userName = 'りんご';
                } else if (replyData.replayUserCode === 'k24h2036') {
                    userName = '인생짱짱';
                } else if (replyData.replayUserCode === 'k22g4051') {
                    userName = 'ひなの';
                } else if (replyData.replayUserCode === 'k24h2079') {
                    userName = 'なてぃ';
                } else if (replyData.replayUserCode === 'k21h2101') {
                    userName = 'りんかーん';
                } else if (replyData.replayUserCode === 'k24h2051') {
                    userName = 'あかり';
                } else if (replyData.replayUserCode === 'k23e1056') {
                    userName = 'ちゃこ';
                } else if (replyData.replayUserCode === 'k24h2081') {
                    userName = 'ルーク';
                } else if (replyData.replayUserCode === 'k23f3085') {
                    userName = 'Birne';
                } else if (replyData.replayUserCode === 'k23h2074') {
                    userName = 'りな';
                } else if (replyData.replayUserCode === 'k23h2004') {
                    userName = 'ななな';
                } else if (replyData.replayUserCode === 'k23h2016') {
                    userName = 'みん';
                } else if (replyData.replayUserCode === 'k23h2070') {
                    userName = 'まさこ';
                } else if (replyData.replayUserCode === 'k23f2014') {
                    userName = 'えり';
                } else if (replyData.replayUserCode === 'd23v204') {
                    userName = 'pom';
                } else if (replyData.replayUserCode === 'k24h2102') {
                    userName = 'yul';
                } else if (replyData.replayUserCode === 'k24h2068') {
                    userName = 'まゆまゆ';
                } else if (replyData.replayUserCode === 'k24h2082') {
                    userName = 'ねね';
                } else if (replyData.replayUserCode === 'k23h2125') {
                    userName = 'み';
                } else if (replyData.replayUserCode === 'k22h2091') {
                    userName = 'はちどり';
                } else if (replyData.replayUserCode === 'k22h2702') {
                    userName = 'りん';
                } else if (replyData.replayUserCode === 'k23h2057') {
                    userName = 'ゆうみ';
                } else {
                    userName = replyData.replayUserCode;
                }

                // replayUserCode に基づいて画像のパスを生成
                const imagePath = `img/${replyData.replayUserCode}.jpeg`;

                // 新しい返信を表示するための div 要素を生成
                const replyItem = document.createElement('div');
                replyItem.classList.add('replyItem');
                replyItem.innerHTML = `
                <div class="replyDetail">
                    <div class="replayWithIcon">
                        <div class="replayFaceIconBox"><img src="${imagePath}" alt="${replyData.replayUserCode}" class="icon" id="${replyData.replayUserCode}"></div>
                        <p class="replyUser">${userName}</p> 
                    </div>
                    <div class="replyText">${replyData.replayText}</div>
                    <div class="replyTimestamp">${formattedReplyTimestamp}</div>
                </div>

            `;

                // .qaWrap 要素に返信を追加
                qaWrap.appendChild(replyItem);

                
    // .icon クラスの img 要素がクリックされた時の処理
document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('click', function() {
        // クリックされた img 要素の id を取得
        const qauserCode = this.id;
        
        if (qauserCode) {
            // 取得した id を qauserCode として URL パラメータに追加
            window.location.href = `chat.html?qauserCode=${encodeURIComponent(qauserCode)}`;
        } else {
            console.warn('クリックされた img 要素に id が設定されていません');
        }
    });
});

            }
        });

    } catch (e) {
        console.error("Error loading replies: ", e);
    }
}





// 詳細情報を表示する関数
function showDetail(qaContentId, docId, category, shitsumon, kaiketsu, timestamp, userCode) {
    // 全ての.qaContents要素を非表示にする
    document.querySelectorAll('.qaContents').forEach(function (content) {
        content.style.display = 'none';
    });

    const qaWrap = document.querySelector('.qaWrap');
    if (!qaWrap) {
        console.error("Element with class 'qaWrap' not found.");
        return;
    }

    let nickname;
    if (userCode === "k21h2078") {
        nickname = "みう";
    } else if (userCode === "k21h2025") {
        nickname = "みく";
    } else if (userCode === 'k99h9999') {
        nickname = 'てすと';
    } else if (userCode === 'k44h4444') {
        nickname = 'よにんめ';
    } else if (userCode === 'k24f2092') {
        nickname = 'りんご';
    } else if (userCode === 'k24h2036') {
        nickname = '인생짱짱';
    } else if (userCode === 'k22g4051') {
        nickname = 'ひなの';
    } else if (userCode === 'k24h2079') {
        nickname = 'なてぃ';
    } else if (userCode === 'k21h2101') {
        nickname = 'りんかーん';
    } else if (userCode === 'k24h2051') {
        nickname = 'あかり';
    } else if (userCode === 'k23e1056') {
        nickname = 'ちゃこ';
    } else if (userCode === 'k24h2081') {
        nickname = 'ルーク';
    } else if (userCode === 'k23f3085') {
        nickname = 'Birne';
    } else if (userCode === 'k23h2074') {
        nickname = 'りな';
    } else if (userCode === 'k23h2004') {
        nickname = 'ななな';
    } else if (userCode === 'k23h2016') {
        nickname = 'みん';
    } else if (userCode === 'k23h2070') {
        nickname = 'まさこ';
    } else if (userCode === 'k23f2014') {
        nickname = 'えり';
    } else if (userCode === 'd23v204') {
        nickname = 'pom';
    } else if (userCode === 'k24h2102') {
        nickname = 'yul';
    } else if (userCode === 'k24h2068') {
        nickname = 'まゆまゆ';
    } else if (userCode === 'k24h2082') {
        nickname = 'ねね';
    } else if (userCode === 'k23h2125') {
        nickname = 'み';
    } else if (userCode === 'k22h2091') {
        nickname = 'はちどり';
    } else if (userCode === 'k22h2702') {
        nickname = 'りん';
    } else if (userCode === 'k23h2057') {
        nickname = 'ゆうみ';
    } else {
        nickname = "デフォルトのニックネーム";
    }
    let categoryName;
    if (category === 1) {
        categoryName = "授業";
    } else if (category === 2) {
        categoryName = "授業以外";
    } else if (category === 3) {
        categoryName = "マッチング";
    } else {
        categoryName = "デフォルト";
    }

    const date = new Date(timestamp.seconds * 1000);
    const formattedTimestamp = date.toLocaleString('ja-JP', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });


    // qaWrapにバックボタンを追加
const backButton = document.createElement('div');
backButton.classList.add('qaDetailBack');
backButton.textContent = '←'; // ボタンのテキスト

// qaWrapの最初にバックボタンを挿入
qaWrap.insertBefore(backButton, qaWrap.firstChild);

    const newDetailDiv = document.createElement('div');
    newDetailDiv.classList.add('qaDetail');
    newDetailDiv.id = docId;

    newDetailDiv.innerHTML = `
     <div class="qaDetailWithIcon">
       <img src="img/${userCode}.jpeg" alt="${userCode}" class="icon" id="${userCode}">
        <div class="qaDetailBox1">
            <div class="qaDetailItem">${nickname}</div>
            <div class="qaDetailBox2">
                <div class="qaDetailItem">${formattedTimestamp}</div>
                <div class="qaDetailItem">${categoryName}</div>
            </div>
        </div>
    </div>
    <div class="qaDetailItemS">${shitsumon}</div>
    `;

    qaWrap.appendChild(newDetailDiv);

const qauserCode = userCode;
    // iconクラスのimgがクリックされた時の処理
    const sendButton = document.querySelector('.icon');
    if (sendButton) {
        sendButton.addEventListener('click', () => {
             if (qauserCode) {
                window.location.href = `chat.html?qauserCode=${encodeURIComponent(qauserCode)}`;
            } else {
                console.warn('qauserCodeがありません');
            }
        });
    }



// バックボタンのクリックイベント
    backButton.addEventListener('click', function () {
        // qaDetailを削除
        newDetailDiv.remove();

        // 保存しておいた qaContentId に基づいてその要素だけ再表示
        if (qaContentId) {
            const previousContent = document.getElementById(qaContentId);
            if (previousContent) {
                previousContent.style.display = 'block'; // 以前表示していた qaContents を再表示
            }
        }

        // バックボタン自体も削除
        backButton.remove();
    });


    

    const replyDiv = document.createElement('div');
    replyDiv.classList.add('replyButton');
    replyDiv.innerHTML = `
    <div class="replay">
    <div class="replayiconBox"><img src="img/replayicon.png" class="replayicon"></div>
        <p>返信する</p>
        </div>
    `;

    qaWrap.appendChild(replyDiv);

    const replyInputDiv = document.createElement('div');
    replyInputDiv.classList.add('replay-input');
    replyInputDiv.style.display = 'none'; // 初期状態では非表示
    replyInputDiv.innerHTML = `
    <div class="qa-input">
        <input type="text" placeholder="返信を入力..." class="RepText">
        <button class="RepSave">送信</button>
        </div>
    `;

    qaWrap.appendChild(replyInputDiv);

    replyDiv.addEventListener('click', function () {
        replyInputDiv.style.display = replyInputDiv.style.display === 'none' ? 'block' : 'none';
    });
    

    // 「送信」ボタンのクリックイベントを追加
    document.querySelector(".RepSave").addEventListener("click", async function () {
        const replyText = document.querySelector(".RepText").value;

        if (replyText.trim() === "") {
            alert("返信内容を入力してください");
            return;
        }

        const replayUserCode = getUserCode();
        displayUserCode(replayUserCode);

        try {
            const docRef = await addDoc(collection(db, "replay"), {
                replayUserCode: replayUserCode,
                replayText: replyText,
                shitsumondocId: docId,
                timestamp: new Date()
            });
            console.log("Document written with ID: ", docRef.id);

            // 入力フィールドをクリア
            document.querySelector(".RepText").value = "";

            // 返信を再読み込みして最新の状態を表示
            loadReplies(docId);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    });

    // 初回読み込み時に既存の返信を表示
    loadReplies(docId);
}





//読み込み

document.addEventListener("DOMContentLoaded", function () {
    const qaRef = collection(db, "qa");

    // displayUserCode を呼び出す
    const userCode = getUserCode();
    displayUserCode(userCode);

    // Firestoreのデータをリアルタイムで監視
    onSnapshot(qaRef, function (querySnapshot) {


        // すべてのqaAllSubIconを取得してループ(#wrap1)
        document.querySelectorAll('.qaAllSubIcon').forEach(function (icon) {
            icon.addEventListener('click', function () {
                const qaContentId = "sub1";
                console.log("qaContentId:" + qaContentId);
                const index = this.getAttribute('data-index');
                const container = document.querySelector(`#all${index}`);

                

                // 以前の内容をクリア
                container.innerHTML = "";

                // 該当するレコードがない場合の処理
                if (querySnapshot.empty) {
                    container.innerHTML += '<div class="nameItem">該当する結果はありません</div>';
                    return;
                }

                // データを条件に応じて表示
                querySnapshot.forEach((docSnapshot) => {
                    const category = docSnapshot.data().category;
                    const kaiketsu = docSnapshot.data().kaiketsu;
                    const shitsumon = docSnapshot.data().shitsumon;
                    const timestamp = docSnapshot.data().timestamp;
                    const usercode = docSnapshot.data().userCode;
                    const docId = docSnapshot.id; // FirebaseのドキュメントID

                    //ユーザーコードをニックネームに変換
                    let nickname;
                    if (usercode === "k21h2078") {
                        nickname = "みう";
                    } else if (usercode === "k21h2025") {
                        nickname = "みく";
                    } else if (usercode === 'k99h9999') {
                        nickname = 'てすと';
                    } else if (usercode === 'k44h4444') {
                        nickname = 'よにんめ';
                    } else if (usercode === 'k24f2092') {
                        nickname = 'りんご';
                    } else if (usercode === 'k24h2036') {
                        nickname = '인생짱짱';
                    } else if (usercode === 'k22g4051') {
                        nickname = 'ひなの';
                    } else if (usercode === 'k24h2079') {
                        nickname = 'なてぃ';
                    } else if (usercode === 'k21h2101') {
                        nickname = 'りんかーん';
                    } else if (usercode === 'k24h2051') {
                        nickname = 'あかり';
                    } else if (usercode === 'k23e1056') {
                        nickname = 'ちゃこ';
                    } else if (usercode === 'k24h2081') {
                        nickname = 'ルーク';
                    } else if (usercode === 'k23f3085') {
                        nickname = 'Birne';
                    } else if (usercode === 'k23h2074') {
                        nickname = 'りな';
                    } else if (usercode === 'k23h2004') {
                        nickname = 'ななな';
                    } else if (usercode === 'k23h2016') {
                        nickname = 'みん';
                    } else if (usercode === 'k23h2070') {
                        nickname = 'まさこ';
                    } else if (usercode === 'k23f2014') {
                        nickname = 'えり';
                    } else if (usercode === 'd23v204') {
                        nickname = 'pom';
                    } else if (usercode === 'k24h2102') {
                        nickname = 'yul';
                    } else if (usercode === 'k24h2068') {
                        nickname = 'まゆまゆ';
                    } else if (usercode === 'k24h2082') {
                        nickname = 'ねね';
                    } else if (usercode === 'k23h2125') {
                        nickname = 'み';
                    } else if (usercode === 'k22h2091') {
                        nickname = 'はちどり';
                    } else if (usercode === 'k22h2702') {
                        nickname = 'りん';
                    } else if (usercode === 'k23h2057') {
                        nickname = 'ゆうみ';
                    } else {
                        nickname = "デフォルトのニックネーム"; // 他のuserCodeの場合の処理（必要に応じて変更）
                    }

                    //数値をカテゴリー名に変換
                    let categoyname;
                    if (category === 1) {
                        categoyname = "授業";
                    } else if (category === 2) {
                        categoyname = "授業以外";
                    } else if (category === 3) {
                        categoyname = "マッチング";
                    } else {
                        categoyname = "デフォルト";
                    }



                    // 大きなdiv要素
                    const item = document.createElement('div');

                    // 横並びにするためのラッパー要素を作成
                    const headerWrapper = document.createElement('div');
                    headerWrapper.classList.add('headerWrapper');

                    // ここからnicknameを追加
                    const nicknameElement = document.createElement('p');
                    nicknameElement.textContent = nickname;
                    nicknameElement.classList.add('nicknameClass'); // ニックネーム用のクラスを追加

                    // ここからcategoynameを追加
                    const categoynameElement = document.createElement('p');
                    categoynameElement.textContent = categoyname;
                    categoynameElement.classList.add('categoryClass'); // カテゴリー用のクラスを追加

                    // ラッパー要素に追加
                    headerWrapper.appendChild(nicknameElement);
                    headerWrapper.appendChild(categoynameElement);
                    item.appendChild(headerWrapper);

                    // ここからshitsumonを追加
                    const shitsumonElement = document.createElement('p');
                    shitsumonElement.textContent = shitsumon;
                    shitsumonElement.classList.add('shitsumonClass'); // 質問用のクラスを追加
                    item.appendChild(shitsumonElement);

                    // ここからtimestampを追加
                    const timestampElement = document.createElement('p');
                    const date = new Date(timestamp.seconds * 1000);
                    const formattedTimestamp = date.toLocaleString('ja-JP', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    timestampElement.textContent = `${formattedTimestamp}`;
                    timestampElement.classList.add('timestampClass'); // タイムスタンプ用のクラスを追加
                    item.appendChild(timestampElement);

                    // クラスやIDを設定
                    item.classList.add('qaDisplay'); // 大きなdivのクラス
                    item.id = docId; // IDにドキュメントIDを設定








                    // 条件に応じてデータを追加
                    if (index === "1" && kaiketsu === 0) {
                        container.appendChild(item);
                        item.addEventListener('click', function (event) {
                            event.preventDefault();
                            showDetail(qaContentId, docId, category, shitsumon, kaiketsu, timestamp, usercode);
                        });
                    } else if (index === "2" && kaiketsu === 1) {
                        container.appendChild(item);
                        item.addEventListener('click', function (event) {
                            event.preventDefault();
                            showDetail(qaContentId, docId, category, shitsumon, kaiketsu, timestamp, usercode);
                        });
                    } else if (index === "3" && (kaiketsu === 0 || kaiketsu === 1)) {
                        container.appendChild(item);
                        item.addEventListener('click', function (event) {
                            event.preventDefault();
                            showDetail(qaContentId, docId, category, shitsumon, kaiketsu, timestamp, usercode);
                        });
                    }
                });
            });
        });


        // すべてのqaClassSubIconを取得してループ(#wrap2)
        document.querySelectorAll('.qaClassSubIcon').forEach(function (icon) {
            icon.addEventListener('click', async function () {
                const qaContentId = "sub2";
                console.log("qaContentId:" + qaContentId);
                const index = this.getAttribute('data-index');
                const container = document.querySelector(`#class${index}`);

                // Firebase Firestoreからリアルタイムでデータを取得する
                try {
                    // Firestoreのusersコレクションからユーザーの情報を取得
                    const usersRef = collection(db, "users");
                    const querySnapshot = await getDocs(usersRef);

                    let userDocId = null; // userDocIdを初期化
                    let risyuu = []; // risyuuを初期化
                    querySnapshot.forEach((docSnapshot) => {
                        const data = docSnapshot.data();
                        const gakuseki = data.gakuseki;

                        if (gakuseki === userCode) {
                            risyuu = data.risyuu || []; // risyuuが未定義の場合は空配列
                            userDocId = docSnapshot.id;
                            console.log("userDocId:" + userDocId);
                        }
                    });

                    // qaコレクションのデータをリアルタイムで監視
                    const qaRef = collection(db, "qa");
                    const q = query(qaRef); // 必要に応じてクエリを設定
                    console.log("risyuu:" + risyuu);

                    // FirebaseのonSnapshotを使ってデータの更新を監視
                    const unsubscribe = onSnapshot(q, (qaSnapshot) => {
                        // コンテナを毎回リセットして、重複した表示を防ぐ
                        container.innerHTML = "";

                        const existingDocIds = new Set(); // 既存のドキュメントIDを追跡するセット

                        qaSnapshot.forEach((qaDocSnapshot) => {
                            const qaData = qaDocSnapshot.data();
                            const category = qaData.category;
                            const jyugyou = qaData.jyugyou;
                            const kaiketsu = qaData.kaiketsu;
                            const shitsumon = qaData.shitsumon;
                            let timestamp = qaData.timestamp;
                            const usercode = qaData.userCode;
                            const docId = qaDocSnapshot.id;

                            // index に応じたデータの表示
                            if ((index === "1" && risyuu.includes(jyugyou)) || (index === "2" && category === 1)) {
                                if (!existingDocIds.has(docId)) { // 既に表示されている場合はスキップ
                                    existingDocIds.add(docId); // docIdをセットに追加

                                    // ユーザーコードをニックネームに変換
                                    let nickname;
                                    if (usercode === "k21h2078") {
                                        nickname = "みう";
                                    } else if (usercode === "k21h2025") {
                                        nickname = "みく";
                                    } else if (usercode === 'k99h9999') {
                                        nickname = 'てすと';
                                    } else if (usercode === 'k44h4444') {
                                        nickname = 'よにんめ';
                                    } else if (usercode === 'k24f2092') {
                                        nickname = 'りんご';
                                    } else if (usercode === 'k24h2036') {
                                        nickname = '인생짱짱';
                                    } else if (usercode === 'k22g4051') {
                                        nickname = 'ひなの';
                                    } else if (usercode === 'k24h2079') {
                                        nickname = 'なてぃ';
                                    } else if (usercode === 'k21h2101') {
                                        nickname = 'りんかーん';
                                    } else if (usercode === 'k24h2051') {
                                        nickname = 'あかり';
                                    } else if (usercode === 'k23e1056') {
                                        nickname = 'ちゃこ';
                                    } else if (usercode === 'k24h2081') {
                                        nickname = 'ルーク';
                                    } else if (usercode === 'k23f3085') {
                                        nickname = 'Birne';
                                    } else if (usercode === 'k23h2074') {
                                        nickname = 'りな';
                                    } else if (usercode === 'k23h2004') {
                                        nickname = 'ななな';
                                    } else if (usercode === 'k23h2016') {
                                        nickname = 'みん';
                                    } else if (usercode === 'k23h2070') {
                                        nickname = 'まさこ';
                                    } else if (usercode === 'k23f2014') {
                                        nickname = 'えり';
                                    } else if (usercode === 'd23v204') {
                                        nickname = 'pom';
                                    } else if (usercode === 'k24h2102') {
                                        nickname = 'yul';
                                    } else if (usercode === 'k24h2068') {
                                        nickname = 'まゆまゆ';
                                    } else if (usercode === 'k24h2082') {
                                        nickname = 'ねね';
                                    } else if (usercode === 'k23h2125') {
                                        nickname = 'み';
                                    } else if (usercode === 'k22h2091') {
                                        nickname = 'はちどり';
                                    } else if (usercode === 'k22h2702') {
                                        nickname = 'りん';
                                    } else if (usercode === 'k23h2057') {
                                        nickname = 'ゆうみ';
                                    } else {
                                        nickname = "デフォルトのニックネーム";
                                    }

                                    // カテゴリー名を設定
                                    let categoryName;
                                    if (category === 1) {
                                        categoryName = "授業";
                                    } else if (category === 2) {
                                        categoryName = "授業以外";
                                    } else if (category === 3) {
                                        categoryName = "マッチング";
                                    } else {
                                        categoryName = "デフォルト";
                                    }

                                    // 大きなdiv要素
                                    const item = document.createElement('div');

                                    // ヘッダーラッパー
                                    const headerWrapper = document.createElement('div');
                                    headerWrapper.classList.add('headerWrapper');

                                    // ニックネームを追加
                                    const nicknameElement = document.createElement('p');
                                    nicknameElement.textContent = nickname;
                                    nicknameElement.classList.add('nicknameClass');

                                    // カテゴリー名を追加
                                    const categoryNameElement = document.createElement('p');
                                    categoryNameElement.textContent = categoryName;
                                    categoryNameElement.classList.add('categoryClass');

                                    headerWrapper.appendChild(nicknameElement);
                                    headerWrapper.appendChild(categoryNameElement);
                                    item.appendChild(headerWrapper);

                                    // 質問を追加
                                    const shitsumonElement = document.createElement('p');
                                    shitsumonElement.textContent = shitsumon;
                                    shitsumonElement.classList.add('shitsumonClass');
                                    item.appendChild(shitsumonElement);

                                    // タイムスタンプを追加
                                    const timestampElement = document.createElement('p');
                                    if (timestamp && timestamp.seconds) {
                                        const date = new Date(timestamp.seconds * 1000);
                                        const formattedTimestamp = date.toLocaleString('ja-JP', {
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        });
                                        timestampElement.textContent = `${formattedTimestamp}`;
                                    } else {
                                        timestampElement.textContent = "タイムスタンプなし";
                                    }
                                    timestampElement.classList.add('timestampClass');
                                    item.appendChild(timestampElement);

                                    // クラスやIDを設定
                                    item.classList.add('qaDisplay');
                                    item.id = docId;

                                    container.appendChild(item);

                                    // クリックイベントリスナーを追加
                                    item.addEventListener('click', function (event) {
                                        event.preventDefault();
                                        showDetail(qaContentId, docId, category, shitsumon, kaiketsu, timestamp, usercode);
                                    });
                                }
                            }
                        });
                    }, (error) => {
                        console.error("Error getting documents: ", error);
                        container.innerHTML += '<div class="nameItem">データの取得中にエラーが発生しました</div>';
                    });

                    // ページから離れる際にリスナーを解除
                    window.addEventListener("beforeunload", () => {
                        unsubscribe();
                    });

                } catch (error) {
                    console.error("Error getting user documents: ", error);
                }
            });
        });










        // #wrap3がクリックされたときにデータを即座に表示
        const wrap3 = document.querySelector('#wrap3');
        if (wrap3) {
            wrap3.addEventListener('click', function () {
                const qaContentId = "sub3";
                console.log("qaContentId:" + qaContentId);
                const container = document.querySelector('#notClass');
                if (container) {
                    // 以前の内容をクリア
                    container.innerHTML = "";

                    // 該当するレコードがない場合の処理
                    if (querySnapshot.empty) {
                        container.innerHTML += '<div class="nameItem">該当する結果はありません</div>';
                        return;
                    }

                    querySnapshot.forEach((docSnapshot) => {
                        const category = docSnapshot.data().category;
                        const kaiketsu = docSnapshot.data().kaiketsu;
                        const shitsumon = docSnapshot.data().shitsumon;
                        const timestamp = docSnapshot.data().timestamp;
                        const usercode = docSnapshot.data().userCode;
                        const docId = docSnapshot.id; // FirebaseのドキュメントID

                        // 条件に応じてデータを追加
                        if (category === 2) {
                            //ユーザーコードをニックネームに変換
                            let nickname;
                            if (usercode === "k21h2078") {
                                nickname = "みう";
                            } else if (usercode === "k21h2025") {
                                nickname = "みく";
                            } else if (usercode === 'k99h9999') {
                                nickname = 'てすと';
                            } else if (usercode === 'k44h4444') {
                                nickname = 'よにんめ';
                            } else if (usercode === 'k24f2092') {
                                nickname = 'りんご';
                            } else if (usercode === 'k24h2036') {
                                nickname = '인생짱짱';
                            } else if (usercode === 'k22g4051') {
                                nickname = 'ひなの';
                            } else if (usercode === 'k24h2079') {
                                nickname = 'なてぃ';
                            } else if (usercode === 'k21h2101') {
                                nickname = 'りんかーん';
                            } else if (usercode === 'k24h2051') {
                                nickname = 'あかり';
                            } else if (usercode === 'k23e1056') {
                                nickname = 'ちゃこ';
                            } else if (usercode === 'k24h2081') {
                                nickname = 'ルーク';
                            } else if (usercode === 'k23f3085') {
                                nickname = 'Birne';
                            } else if (usercode === 'k23h2074') {
                                nickname = 'りな';
                            } else if (usercode === 'k23h2004') {
                                nickname = 'ななな';
                            } else if (usercode === 'k23h2016') {
                                nickname = 'みん';
                            } else if (usercode === 'k23h2070') {
                                nickname = 'まさこ';
                            } else if (usercode === 'k23f2014') {
                                nickname = 'えり';
                            } else if (usercode === 'd23v204') {
                                nickname = 'pom';
                            } else if (usercode === 'k24h2102') {
                                nickname = 'yul';
                            } else if (usercode === 'k24h2068') {
                                nickname = 'まゆまゆ';
                            } else if (usercode === 'k24h2082') {
                                nickname = 'ねね';
                            } else if (usercode === 'k23h2125') {
                                nickname = 'み';
                            } else if (usercode === 'k22h2091') {
                                nickname = 'はちどり';
                            } else if (usercode === 'k22h2702') {
                                nickname = 'りん';
                            } else if (usercode === 'k23h2057') {
                                nickname = 'ゆうみ';
                            } else {
                                nickname = "デフォルトのニックネーム"; // 他のuserCodeの場合の処理（必要に応じて変更）
                            }

                            //数値をカテゴリー名に変換
                            let categoyname;
                            if (category === 1) {
                                categoyname = "授業";
                            } else if (category === 2) {
                                categoyname = "授業以外";
                            } else if (category === 3) {
                                categoyname = "マッチング";
                            } else {
                                categoyname = "デフォルト";
                            }

                            // 大きなdiv要素
                            const item = document.createElement('div');

                            // 横並びにするためのラッパー要素を作成
                            const headerWrapper = document.createElement('div');
                            headerWrapper.classList.add('headerWrapper');

                            // ここからnicknameを追加
                            const nicknameElement = document.createElement('p');
                            nicknameElement.textContent = nickname;
                            nicknameElement.classList.add('nicknameClass'); // ニックネーム用のクラスを追加

                            // ここからcategoynameを追加
                            const categoynameElement = document.createElement('p');
                            categoynameElement.textContent = categoyname;
                            categoynameElement.classList.add('categoryClass'); // カテゴリー用のクラスを追加

                            // ラッパー要素に追加
                            headerWrapper.appendChild(nicknameElement);
                            headerWrapper.appendChild(categoynameElement);
                            item.appendChild(headerWrapper);

                            // ここからshitsumonを追加
                            const shitsumonElement = document.createElement('p');
                            shitsumonElement.textContent = shitsumon;
                            shitsumonElement.classList.add('shitsumonClass'); // 質問用のクラスを追加
                            item.appendChild(shitsumonElement);

                            // ここからtimestampを追加
                            const timestampElement = document.createElement('p');
                            const date = new Date(timestamp.seconds * 1000);
                            const formattedTimestamp = date.toLocaleString('ja-JP', {
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            timestampElement.textContent = `${formattedTimestamp}`;
                            timestampElement.classList.add('timestampClass'); // タイムスタンプ用のクラスを追加
                            item.appendChild(timestampElement);

                            // クラスやIDを設定
                            item.classList.add('qaDisplay'); // 大きなdivのクラス
                            item.id = docId; // IDにドキュメントIDを設定

                            container.appendChild(item);
                            item.addEventListener('click', function (event) {
                                event.preventDefault();
                                showDetail(qaContentId, docId, category, shitsumon, kaiketsu, timestamp, usercode);
                            });
                        }
                    });

                }
            });
        }


        // #wrap4がクリックされたときにデータを即座に表示
        const wrap4 = document.querySelector('#wrap4');
        if (wrap4) {
            wrap4.addEventListener('click', function () {
                const qaContentId = "sub4";
                console.log("qaContentId:" + qaContentId);
                const container = document.querySelector('#Match');
                if (container) {
                    // 以前の内容をクリア
                    container.innerHTML = "";

                    // 該当するレコードがない場合の処理
                    if (querySnapshot.empty) {
                        container.innerHTML += '<div class="nameItem">該当する結果はありません</div>';
                        return;
                    }

                    querySnapshot.forEach((docSnapshot) => {
                        const category = docSnapshot.data().category;
                        const kaiketsu = docSnapshot.data().kaiketsu;
                        const shitsumon = docSnapshot.data().shitsumon;
                        const timestamp = docSnapshot.data().timestamp;
                        const usercode = docSnapshot.data().userCode;
                        const docId = docSnapshot.id; // FirebaseのドキュメントID

                        // 条件に応じてデータを追加
                        if (category === 3) {
                            //ユーザーコードをニックネームに変換
                            let nickname;
                            if (usercode === "k21h2078") {
                                nickname = "みう";
                            } else if (usercode === "k21h2025") {
                                nickname = "みく";
                            } else if (usercode === 'k99h9999') {
                                nickname = 'てすと';
                            } else if (usercode === 'k44h4444') {
                                nickname = 'よにんめ';
                            } else if (usercode === 'k24f2092') {
                                nickname = 'りんご';
                            } else if (usercode === 'k24h2036') {
                                nickname = '인생짱짱';
                            } else if (usercode === 'k22g4051') {
                                nickname = 'ひなの';
                            } else if (usercode === 'k24h2079') {
                                nickname = 'なてぃ';
                            } else if (usercode === 'k21h2101') {
                                nickname = 'りんかーん';
                            } else if (usercode === 'k24h2051') {
                                nickname = 'あかり';
                            } else if (usercode === 'k23e1056') {
                                nickname = 'ちゃこ';
                            } else if (usercode === 'k24h2081') {
                                nickname = 'ルーク';
                            } else if (usercode === 'k23f3085') {
                                nickname = 'Birne';
                            } else if (usercode === 'k23h2074') {
                                nickname = 'りな';
                            } else if (usercode === 'k23h2004') {
                                nickname = 'ななな';
                            } else if (usercode === 'k23h2016') {
                                nickname = 'みん';
                            } else if (usercode === 'k23h2070') {
                                nickname = 'まさこ';
                            } else if (usercode === 'k23f2014') {
                                nickname = 'えり';
                            } else if (usercode === 'd23v204') {
                                nickname = 'pom';
                            } else if (usercode === 'k24h2102') {
                                nickname = 'yul';
                            } else if (usercode === 'k24h2068') {
                                nickname = 'まゆまゆ';
                            } else if (usercode === 'k24h2082') {
                                nickname = 'ねね';
                            } else if (usercode === 'k23h2125') {
                                nickname = 'み';
                            } else if (usercode === 'k22h2091') {
                                nickname = 'はちどり';
                            } else if (usercode === 'k22h2702') {
                                nickname = 'りん';
                            } else if (usercode === 'k23h2057') {
                                nickname = 'ゆうみ';
                            } else {
                                nickname = "デフォルトのニックネーム"; // 他のuserCodeの場合の処理（必要に応じて変更）
                            }

                            //数値をカテゴリー名に変換
                            let categoyname;
                            if (category === 1) {
                                categoyname = "授業";
                            } else if (category === 2) {
                                categoyname = "授業以外";
                            } else if (category === 3) {
                                categoyname = "マッチング";
                            } else {
                                categoyname = "デフォルト";
                            }

                            // 大きなdiv要素
                            const item = document.createElement('div');

                            // 横並びにするためのラッパー要素を作成
                            const headerWrapper = document.createElement('div');
                            headerWrapper.classList.add('headerWrapper');

                            // ここからnicknameを追加
                            const nicknameElement = document.createElement('p');
                            nicknameElement.textContent = nickname;
                            nicknameElement.classList.add('nicknameClass'); // ニックネーム用のクラスを追加

                            // ここからcategoynameを追加
                            const categoynameElement = document.createElement('p');
                            categoynameElement.textContent = categoyname;
                            categoynameElement.classList.add('categoryClass'); // カテゴリー用のクラスを追加

                            // ラッパー要素に追加
                            headerWrapper.appendChild(nicknameElement);
                            headerWrapper.appendChild(categoynameElement);
                            item.appendChild(headerWrapper);

                            // ここからshitsumonを追加
                            const shitsumonElement = document.createElement('p');
                            shitsumonElement.textContent = shitsumon;
                            shitsumonElement.classList.add('shitsumonClass'); // 質問用のクラスを追加
                            item.appendChild(shitsumonElement);

                            // ここからtimestampを追加
                            const timestampElement = document.createElement('p');
                            const date = new Date(timestamp.seconds * 1000);
                            const formattedTimestamp = date.toLocaleString('ja-JP', {
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            timestampElement.textContent = `${formattedTimestamp}`;
                            timestampElement.classList.add('timestampClass'); // タイムスタンプ用のクラスを追加
                            item.appendChild(timestampElement);

                            // クラスやIDを設定
                            item.classList.add('qaDisplay'); // 大きなdivのクラス
                            item.id = docId; // IDにドキュメントIDを設定

                            container.appendChild(item);
                            item.addEventListener('click', function (event) {
                                event.preventDefault();
                                showDetail(qaContentId, docId, category, shitsumon, kaiketsu, timestamp, usercode);
                            });
                        }
                    });
                }
            });
        }


        // #wrap5がクリックされたときにデータを即座に表示
        const wrap5 = document.querySelector('#wrap5');
        if (wrap5) {
            wrap5.addEventListener('click', function () {
                const container = document.querySelector('#Sended');
                if (container) {
                    // 以前の内容をクリア
                    container.innerHTML = "";

                    // データを条件に応じて表示
                    querySnapshot.forEach((docSnapshot) => {
                        const kaiketsu = docSnapshot.data().kaiketsu;
                        const shitsumon = docSnapshot.data().shitsumon;
                        const usercode = docSnapshot.data().userCode;

                        // firebaseのusercodeがログイン時のuserCodeと一致するものを表示
                        if (usercode == userCode) {
                            const item = document.createElement('div');
                            item.textContent = shitsumon;
                            item.classList.add('qaDisplay');

                            // ボタンを追加
                            const button = document.createElement('div');
                            button.classList.add('kaiketsuButton');
                            if (kaiketsu === 0) {
                                button.textContent = '＜現在：回答受付中＞解決済みにする';
                            } else {
                                button.textContent = '＜現在：解決済み＞回答受付中にする';
                            }

                            // ボタンのクリックイベントを設定
                            button.addEventListener('click', async function () {
                                try {
                                    const docId = docSnapshot.id;
                                    const docRef = doc(db, "qa", docId);

                                    // kaiketsuの値を切り替える
                                    const newKaiketsu = (kaiketsu === 0) ? 1 : 0;
                                    await updateDoc(docRef, { kaiketsu: newKaiketsu });

                                    // ボタンの表示を更新
                                    button.textContent = (newKaiketsu === 0) ? '＜現在：回答受付中＞解決済みにする' : '＜現在：解決済み＞回答受付中にする';
                                } catch (e) {
                                    console.error("Error updating document: ", e);
                                }
                            });

                            item.appendChild(button);
                            container.appendChild(item);
                        }
                    });
                }
            });
        }

        // ページがロードされたら最初にqaAll1がクリックされたことにする
        const firstIcon = document.querySelector('#qaAll1');
        if (firstIcon) {
            firstIcon.click();
        }

        // #wrap2がクリックされたときに#qaClass1をクリックさせる
        const wrap2 = document.querySelector('#wrap2');
        if (wrap2) {
            wrap2.addEventListener('click', function () {
                const qaClass1 = document.querySelector('#qaClass1');
                if (qaClass1) {
                    qaClass1.click(); // #qaClass1のクリックイベントをトリガー
                }
            });
        }
    });
});



function displayUserCode(userCode) {
    const loginUserElement = document.querySelector('.loginUser');
    if (loginUserElement) {
        loginUserElement.textContent = userCode;
    }
}

function getUserCode() {
    return localStorage.getItem('userCode') || 'デフォルトユーザーコード';
}


document.addEventListener('click', function (event) {

    if (!event.target.closest('.qaDisplay') && !event.target.closest('.qaWrap')) {
        // .qaWrap を取得
        const qaWrap = document.querySelector('.qaWrap');

        if (qaWrap) {
            // .qaWrap の中身を空にする
            qaWrap.innerHTML = '';
        }
    }
});


