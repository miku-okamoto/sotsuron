// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

import { firebaseConfig } from './firebase0823.js';


// Initialize Firebase
let app;
try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialize success!");
} catch (error) {
    alert(`Firebase app initialize error: ${error}`);
}

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
    const usersRef = collection(db, "chat");
    const q = query(usersRef, orderBy("timestamp", "asc"));

    const mesPreviewContainer = document.querySelector('.mesPreview');
    const chatichiran = document.querySelector('#chatichiran');

    // URL からクエリパラメータを取得
    const params = new URLSearchParams(window.location.search);

    // gakuseki の値を取得
    const gakuseki = params.get('gakuseki');

    // qauserCode の値を取得
    const qauserCode = params.get('qauserCode');

    // chatindex の定義を if 文内で行う
    let chatindex;

    if (gakuseki !== null) {
        // gakuseki が null でない場合、その値を chatindex に設定
        chatindex = gakuseki;
    } else if (qauserCode !== null) {
        // gakuseki が null で、qauserCode が null でない場合、その値を chatindex に設定
        chatindex = qauserCode;
    } else {
        // 両方とも null の場合、chatindex は null に設定
        chatindex = null;
    }



    // ページが読み込まれたときに displayUserCode を呼び出す
    const userCode = getUserCode();
    displayUserCode(userCode);

    console.log("userCode:" + userCode);
    console.log("gakuseki (chatindex): " + chatindex);

    // 初期状態で '.chatContents' を非表示にする
    document.querySelectorAll('.chatContents').forEach(function (content) {
        content.style.display = 'none';
    });



    // gakusekiが存在すれば、chatindexに代入し、.chatBoxがクリックされたことにする
    if (gakuseki || qauserCode) {

        const chatindex = gakuseki || qauserCode || null;
        console.log("chatindex:" + chatindex);

        mesPreviewContainer.style.display = 'none';
        chatichiran.style.display = 'none';
        document.querySelectorAll('.chatContents').forEach(function (content) {
            content.style.display = 'none';
        });

        const targetElement = document.getElementById('chat' + chatindex);
        if (targetElement) {
            targetElement.style.display = 'block';
            console.log("displaysuccess");
        } else {
            console.warn(`Element with ID 'chat${chatindex}' not found.`);
        }

        // 書き込み シャボン玉から飛んだ時
        document.querySelectorAll('.MesSave').forEach(function (button) {
            // 対応する親要素の ID を取得
            const parentElement = button.closest('[id^="chat"]');
            if (parentElement && parentElement.id === 'chat' + chatindex) {
                // 親要素に対応するメッセージ入力フィールドの ID を設定
                const textInput = parentElement.querySelector('.MesText');
                if (textInput) {
                    textInput.id = 'mesText' + chatindex;
                } else {
                    console.warn(`Text input element not found in parent with ID 'chat${chatindex}'`);
                }

                // ボタンに ID を設定
                button.id = 'mesSave' + chatindex;

                button.addEventListener("click", async function () {
                    // 対応するメッセージ入力フィールドを取得
                    const textInput = document.querySelector(`#mesText${chatindex}`);

                    if (!textInput) {
                        console.warn(`Text input with ID 'mesText${chatindex}' not found.`);
                        return;
                    }

                    const message = textInput.value;

                    if (!message) {
                        console.warn("No message entered.");
                        return;
                    }

                    const targetParentElement = document.querySelector(`#chat${chatindex}`);

                    if (targetParentElement) {
                        try {
                            const docRef = await addDoc(collection(db, "chat"), {
                                message: message,
                                to: chatindex,
                                me: userCode,
                                timestamp: new Date()
                            });
                            console.log("Document written with ID: ", docRef.id);
                            textInput.value = ""; // メッセージ送信後に入力フィールドをクリア

                            // 対象の親要素を表示
                            targetParentElement.style.display = 'block';

                            // ページが完全に読み込まれてからスクロールを一番下に設定
                            setTimeout(() => {
                                const mesContentsElement = document.querySelector(`#mesContents${chatindex}`);
                                if (mesContentsElement) {
                                    // スクロールを調整
                                    function scrollToBottom() {
                                        mesContentsElement.scrollTop = mesContentsElement.scrollHeight;
                                        console.log("element.scrollTop after update: " + mesContentsElement.scrollTop);
                                    }
                                    // 1秒後にスクロール調整
                                    setTimeout(scrollToBottom, 500);
                                }
                            }, 50); // 遅延時間を短くしてみる

                        } catch (e) {
                            console.error("Error adding document: ", e);
                        }
                    } else {
                        console.warn(`Parent element with ID 'chat${chatindex}' not found.`);
                    }
                });
            }
        });

        // 読み取り　シャボン玉から飛んだ時
        const unsubscribeContents = onSnapshot(query(usersRef, orderBy("timestamp", "asc")), (querySnapshot) => {
            // すべての '.mesContents' 要素を取得
            const mesContentsElements = document.querySelectorAll('.mesContents');

            if (querySnapshot.empty) {
                mesContentsElements.forEach((element) => {
                    const parentElement = element.closest('[id^="chat"]');
                    if (parentElement && parentElement.id === 'chat' + chatindex) {
                        element.innerHTML = '<div>該当する結果はありません</div>';
                    }
                });
                return;
            }

            // メッセージのコンテンツを初期化
            mesContentsElements.forEach((element) => {
                const parentElement = element.closest('[id^="chat"]');
                if (parentElement && parentElement.id === 'chat' + chatindex) {
                    element.innerHTML = ''; // まずはコンテンツをクリア
                }
            });

            querySnapshot.forEach((doc) => {
                const me = doc.data().me;
                const to = doc.data().to;
                const timestamp = doc.data().timestamp.toDate(); // タイムスタンプをDateオブジェクトに変換

                // タイムスタンプをフォーマット
                const date = timestamp.toLocaleDateString(); // 日付を取得
                const time = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // 秒なしで時間を取得
                if ((me === userCode && to === chatindex) || (me === chatindex && to === userCode)) {
                    const item = document.createElement('div');
                    item.textContent = `${doc.data().message}`;

                    // メッセージをすべての '.mesContents' に追加
                    mesContentsElements.forEach((element) => {
                        const parentElement = element.closest('[id^="chat"]');
                        if (parentElement && parentElement.id === 'chat' + chatindex) {
                            if (me === userCode) {
                                item.classList.add('myMes');
                            } else if (to === userCode) {
                                item.classList.add('chatindexMes');
                            }

                            // タイムスタンプを追加
                            const timestampElement = document.createElement('div');
                            timestampElement.textContent = `${date} ${time}`;
                            timestampElement.classList.add('timestamp');

                            // メッセージとタイムスタンプを追加
                            item.appendChild(timestampElement);

                            // 対応する '.mesContents' 要素にメッセージを追加
                            element.appendChild(item.cloneNode(true)); // cloneNode() を使って複製することで、すべての .mesContents に追加
                        }
                    });
                }
            });



            // ページが完全に読み込まれてからスクロールを一番下に設定
            setTimeout(() => {
                const targetElement = document.querySelector(`#chat${chatindex} .mesContents`);
                if (targetElement) {
                    targetElement.scrollTop = targetElement.scrollHeight;
                    console.log("element.scrollTop after update: " + targetElement.scrollTop);
                }
            }, 50);

        }, (error) => {
            console.error("Error getting documents: ", error);
        });

        // ページを離れるときに購読を解除
        window.addEventListener("beforeunload", () => {
            unsubscribeContents();
        });

        document.querySelectorAll('.chatBack').forEach(function (button) {
            button.addEventListener('click', function () {
                window.location.href = 'chat.html';
            });
        });

    }






    // 読み取り: 最新のデータを表示　チャット一覧
    const unsubscribePreview = onSnapshot(q, (querySnapshot) => {
        mesPreviewContainer.innerHTML = "";

        if (querySnapshot.empty) {
            mesPreviewContainer.innerHTML = '<div>該当する結果はありません</div>';
            return;
        }

        // userCode 以外のユーザーを重複なく格納するセット
        const uniqueUsers = new Set();

        // 各ドキュメントの 'to' と 'me' を確認し、userCode 以外のユーザーをセットに追加
        querySnapshot.forEach((doc) => {
            const toValue = doc.data().to;
            const meValue = doc.data().me;

            console.log("toValue:" + toValue);
            console.log("meValue:" + meValue);

            if (toValue !== userCode) {
                uniqueUsers.add(toValue);
            }
            if (meValue !== userCode) {
                uniqueUsers.add(meValue);
            }
        });
        console.log("uniqueUsers:" + uniqueUsers);



        // ユーザーごとの最新メッセージを格納する配列
        const latestMessages = [];

        // セットの中の各ユーザーに対して処理を行う
        uniqueUsers.forEach((otherUser) => {
            // ユーザーごとの最新のメッセージを取得
            const userMessages = querySnapshot.docs.filter(doc => {
                const me = doc.data().me;
                const to = doc.data().to;

                // 条件: meがuserCodeでtoがotherUser、またはmeがotherUserでtoがuserCode
                return (me === userCode && to === otherUser) || (me === otherUser && to === userCode);
            });

            // メッセージをタイムスタンプでソート（降順）
            userMessages.sort((a, b) => b.data().timestamp.toMillis() - a.data().timestamp.toMillis());

            const latestDoc = userMessages[0]; // 最新のメッセージを取得

            if (latestDoc) {
                // 最新メッセージを配列に追加
                latestMessages.push({
                    otherUser: otherUser,
                    doc: latestDoc
                });
            }
        });

        // 最新メッセージをタイムスタンプでソート（降順）
        latestMessages.sort((a, b) => b.doc.data().timestamp.toMillis() - a.doc.data().timestamp.toMillis());



        latestMessages.forEach(({ otherUser, doc }) => {
            // チャットボックスリンクの要素を作成
            const link = document.createElement('a');
            link.href = '#';
            link.classList.add('chatBox');
            link.dataset.index = otherUser; // userCode以外のユーザーのコードを設定

            // メッセージの要素を作成
            const item = document.createElement('div');
            item.classList.add('box1');

            // 画像表示の要素を作成
            const iconBox = document.createElement('div');
            iconBox.classList.add('iconBox');

            // 画像要素を作成して、指定された画像を設定
            const imgElement = document.createElement('img');



            // テキスト部分をグループ化する要素を作成
            const textContainer = document.createElement('div');
            textContainer.classList.add('textContainer');

            // 名前とタイムスタンプを表示する要素を作成
            const nameAndTimestamp = document.createElement('div');
            nameAndTimestamp.classList.add('nameAndTimestamp');

            // 名前ラベルの要素を作成
            const nameLabel = document.createElement('div');
            nameLabel.classList.add('nameLabel'); // 名前にスタイルを追加するためのクラス

            // タイムスタンプの要素を作成
            const timestampLabel = document.createElement('div');
            timestampLabel.classList.add('timestampLabel'); // タイムスタンプにスタイルを追加するためのクラス

            // メッセージテキストの要素を作成
            const messageText = document.createElement('div');
            messageText.classList.add('messageText'); // メッセージにスタイルを追加するためのクラス


            // テキスト要素をテキストコンテナに追加
            nameAndTimestamp.appendChild(nameLabel);
            nameAndTimestamp.appendChild(timestampLabel);
            textContainer.appendChild(nameAndTimestamp);
            textContainer.appendChild(messageText);

            // 名前に基づくテキストを設定
            let name = '';
            if (otherUser === 'k21h2025') {
                name = 'みく';
            } else if (otherUser === 'k21h2078') {
                name = 'みう';
            } else if (otherUser === 'k99h9999') {
                name = 'てすと';
            } else if (otherUser === 'k44h4444') {
                name = 'よにんめ';
            } else if (otherUser === 'k24f2092') {
                name = 'りんご';
            } else if (otherUser === 'k24h2036') {
                name = '인생짱짱';
            } else if (otherUser === 'k22g4051') {
                name = 'ひなの';
            } else if (otherUser === 'k24h2079') {
                name = 'なてぃ';
            } else if (otherUser === 'k21h2101') {
                name = 'りんかーん';
            } else if (otherUser === 'k24h2051') {
                name = 'あかり';
            } else if (otherUser === 'k23e1056') {
                name = 'ちゃこ';
            } else if (otherUser === 'k24h2081') {
                name = 'ルーク';
            } else if (otherUser === 'k23f3085') {
                name = 'Birne';
            } else if (otherUser === 'k23h2074') {
                name = 'りな';
            } else if (otherUser === 'k23h2004') {
                name = 'ななな';
            } else if (otherUser === 'k23h2016') {
                name = 'みん';
            } else if (otherUser === 'k23h2070') {
                name = 'まさこ';
            } else if (otherUser === 'k23f2014') {
                name = 'えり';
            } else if (otherUser === 'd23v204') {
                name = 'pom';
            } else if (otherUser === 'k24h2102') {
                name = 'yul';
            } else if (otherUser === 'k24h2068') {
                name = 'まゆまゆ';
            } else if (otherUser === 'k24h2082') {
                name = 'ねね';
            } else if (otherUser === 'k23h2125') {
                name = 'み';
            } else if (otherUser === 'k22h2091') {
                name = 'はちどり';
            } else if (otherUser === 'k22h2702') {
                name = 'りん';
            } else if (otherUser === 'k23h2057') {
                name = 'ゆうみ';
            } else {
                name = '不明なユーザー'; // 未定義のユーザーの場合のデフォルト名
            }

            nameLabel.textContent = name;

            // メッセージのテキストを設定
            messageText.textContent = `${doc.data().message}`;

            // タイムスタンプをフォーマットする関数
            const formatTimestamp = (timestamp) => {
                const date = timestamp.toDate(); // Firestore Timestamp を JavaScript Date に変換

                // 二桁表示のための関数
                const pad = (number) => number.toString().padStart(2, '0');

                return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
            };

            // タイムスタンプを設定
            const timestamp = doc.data().timestamp; // Firestore のタイムスタンプを取得
            timestampLabel.textContent = formatTimestamp(timestamp);

            //画像を指定
            const imgName = "img/" + otherUser + ".jpeg"
            console.log(imgName);
            imgElement.src = imgName;
            imgElement.alt = "Icon";
            imgElement.classList.add('userIcon');  // アイコン用のスタイルを追加
            iconBox.appendChild(imgElement);

            // 画像ボックス、名前ラベル、メッセージテキストを 'box1' に追加
            item.appendChild(iconBox);      // 画像を表示するボックスを追加
            item.appendChild(textContainer);  // 名前とメッセージを追加

            // 'box1' をリンクに追加
            link.appendChild(item);

            // チャットプレビューコンテナにリンクを追加
            mesPreviewContainer.appendChild(link);
        });


        // クラス名 ".chatBox" を持つ全ての要素にクリックイベントリスナーを追加
        document.querySelectorAll('.chatBox').forEach(function (element) {
            element.addEventListener('click', function () {
                const chatindex = this.getAttribute('data-index');
                console.log("chatindex:" + chatindex);
                mesPreviewContainer.style.display = 'none';
                chatichiran.style.display = 'none';

                document.querySelectorAll('.chatContents').forEach(function (content) {
                    content.style.display = 'none';
                });

                const targetElement = document.getElementById('chat' + chatindex);
                if (targetElement) {
                    targetElement.style.display = 'block';
                    console.log("displaysuccess");
                } else {
                    console.warn(`Element with ID 'chat${chatindex}' not found.`);
                }

                // 書き込み
                document.querySelectorAll('.MesSave').forEach(function (button) {
                    // 対応する親要素の ID を取得
                    const parentElement = button.closest('[id^="chat"]');
                    if (parentElement && parentElement.id === 'chat' + chatindex) {
                        // 親要素に対応するメッセージ入力フィールドの ID を設定
                        const textInput = parentElement.querySelector('.MesText');
                        if (textInput) {
                            textInput.id = 'mesText' + chatindex;
                        } else {
                            console.warn(`Text input element not found in parent with ID 'chat${chatindex}'`);
                        }

                        // ボタンに ID を設定
                        button.id = 'mesSave' + chatindex;

                        button.addEventListener("click", async function () {
                            // 対応するメッセージ入力フィールドを取得
                            const textInput = document.querySelector(`#mesText${chatindex}`);

                            if (!textInput) {
                                console.warn(`Text input with ID 'mesText${chatindex}' not found.`);
                                return;
                            }

                            const message = textInput.value;

                            if (!message) {
                                console.warn("No message entered.");
                                return;
                            }

                            const targetParentElement = document.querySelector(`#chat${chatindex}`);

                            if (targetParentElement) {
                                try {
                                    const docRef = await addDoc(collection(db, "chat"), {
                                        message: message,
                                        to: chatindex,
                                        me: userCode,
                                        timestamp: new Date()
                                    });
                                    console.log("Document written with ID: ", docRef.id);
                                    textInput.value = ""; // メッセージ送信後に入力フィールドをクリア

                                    // 対象の親要素を表示
                                    targetParentElement.style.display = 'block';

                                    // ページが完全に読み込まれてからスクロールを一番下に設定
                                    setTimeout(() => {
                                        const mesContentsElement = document.querySelector(`#mesContents${chatindex}`);
                                        if (mesContentsElement) {
                                            // スクロールを調整
                                            function scrollToBottom() {
                                                mesContentsElement.scrollTop = mesContentsElement.scrollHeight;
                                                console.log("element.scrollTop after update: " + mesContentsElement.scrollTop);
                                            }
                                            // 1秒後にスクロール調整
                                            setTimeout(scrollToBottom, 500);
                                        }
                                    }, 50); // 遅延時間を短くしてみる

                                } catch (e) {
                                    console.error("Error adding document: ", e);
                                }
                            } else {
                                console.warn(`Parent element with ID 'chat${chatindex}' not found.`);
                            }
                        });
                    }
                });

                // 読み取り
                const unsubscribeContents = onSnapshot(query(usersRef, orderBy("timestamp", "asc")), (querySnapshot) => {
                    // すべての '.mesContents' 要素を取得
                    const mesContentsElements = document.querySelectorAll('.mesContents');

                    if (querySnapshot.empty) {
                        mesContentsElements.forEach((element) => {
                            const parentElement = element.closest('[id^="chat"]');
                            if (parentElement && parentElement.id === 'chat' + chatindex) {
                                element.innerHTML = '<div>該当する結果はありません</div>';
                            }
                        });
                        return;
                    }

                    // メッセージのコンテンツを初期化
                    mesContentsElements.forEach((element) => {
                        const parentElement = element.closest('[id^="chat"]');
                        if (parentElement && parentElement.id === 'chat' + chatindex) {
                            element.innerHTML = ''; // まずはコンテンツをクリア
                        }
                    });

                    querySnapshot.forEach((doc) => {
                        const me = doc.data().me;
                        const to = doc.data().to;
                        const timestamp = doc.data().timestamp.toDate(); // タイムスタンプをDateオブジェクトに変換

                        // タイムスタンプをフォーマット
                        const date = timestamp.toLocaleDateString(); // 日付を取得
                        const time = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // 秒なしで時間を取得
                        if ((me === userCode && to === chatindex) || (me === chatindex && to === userCode)) {
                            const item = document.createElement('div');
                            item.textContent = `${doc.data().message}`;

                            // メッセージをすべての '.mesContents' に追加
                            mesContentsElements.forEach((element) => {
                                const parentElement = element.closest('[id^="chat"]');
                                if (parentElement && parentElement.id === 'chat' + chatindex) {
                                    if (me === userCode) {
                                        item.classList.add('myMes');
                                    } else if (to === userCode) {
                                        item.classList.add('chatindexMes');
                                    }

                                    // タイムスタンプを追加
                                    const timestampElement = document.createElement('div');
                                    timestampElement.textContent = `${date} ${time}`;
                                    timestampElement.classList.add('timestamp');

                                    // メッセージとタイムスタンプを追加
                                    item.appendChild(timestampElement);

                                    // 対応する '.mesContents' 要素にメッセージを追加
                                    element.appendChild(item.cloneNode(true)); // cloneNode() を使って複製することで、すべての .mesContents に追加
                                }
                            });
                        }
                    });



                    // ページが完全に読み込まれてからスクロールを一番下に設定
                    setTimeout(() => {
                        const targetElement = document.querySelector(`#chat${chatindex} .mesContents`);
                        if (targetElement) {
                            targetElement.scrollTop = targetElement.scrollHeight;
                            console.log("element.scrollTop after update: " + targetElement.scrollTop);
                        }
                    }, 50);

                }, (error) => {
                    console.error("Error getting documents: ", error);
                });

                // ページを離れるときに購読を解除
                window.addEventListener("beforeunload", () => {
                    unsubscribeContents();
                });

                document.querySelectorAll('.chatBack').forEach(function (button) {
                    button.addEventListener('click', function () {
                        window.location.href = 'chat.html';
                    });
                });
            });
        });

    }, (error) => {
        console.error("Error getting documents: ", error);
    });

    window.addEventListener("beforeunload", () => {
        unsubscribePreview();
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



//テキストエリアを選択したときのフッターの処理
document.addEventListener('DOMContentLoaded', function () {
    const textareas = document.querySelectorAll('.chatContents .MesText');
    const footer = document.querySelector('.footer');

    textareas.forEach((textarea) => {
        const chatInput = textarea.closest('.chat-input');
        const mesContents = textarea.closest('.chatContents').querySelector('.mesContents');

        textarea.addEventListener('focus', function () {
            footer.style.display = 'none';  // navを非表示にする

            if (chatInput) {
                chatInput.style.bottom = '0';  // chat-inputを下部に固定する
                mesContents.style.margin = '0';
            }
        });

        textarea.addEventListener('blur', function () {
            footer.style.display = 'flex';  // navを再表示する
            if (chatInput) {
                chatInput.style.bottom = '';  // chat-inputのbottomを元に戻す
                mesContents.style.margin = '';
            }
        });
    });
});



window.addEventListener('resize', function () {
    const footer = document.querySelector('.footer');

    if (window.innerHeight < document.documentElement.clientHeight) {
        footer.style.display = 'none';  // キーボード表示時は非表示にする
    } else {
        footer.style.display = 'flex';  // キーボードが消えたら再表示
    }
});