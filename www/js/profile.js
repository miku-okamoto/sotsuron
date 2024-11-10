document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const age = params.get('age');
    const clas = params.get('clas');
    const zemi = params.get('zemi');
    const born = params.get('born');
    const live = params.get('live');
    const photo = params.get('photo');
    const gakuseki = params.get('gakuseki');
    console.log("gakuseki:" + gakuseki);

    const dataname = document.querySelector("#name");
    if (name) {
        const dataRow = `<tr><td>${name}</td></tr>`;
        dataname.innerHTML = dataRow;
    } else {
        dataname.innerHTML = '<tr><td colspan="3">-</td></tr>';
    }

    const dataage = document.querySelector("#age");
    if (age) {
        const dataRow = `<tr><td>${age}</td></tr>`;
        dataage.innerHTML = dataRow;
    } else {
        dataage.innerHTML = '<tr><td colspan="3">-</td></tr>';
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
        datazemi.innerHTML = '<tr><td colspan="3">-</td></tr>';
    }

    const databorn = document.querySelector("#born");
    if (born) {
        const dataRow = `<tr><td>${born}</td></tr>`;
        databorn.innerHTML = dataRow;
    } else {
        databorn.innerHTML = '<tr><td colspan="3">-</td></tr>';
    }

    const datalive = document.querySelector("#live");
    if (live) {
        const dataRow = `<tr><td>${live}</td></tr>`;
        datalive.innerHTML = dataRow;
    } else {
        datalive.innerHTML = '<tr><td colspan="3">-</td></tr>';
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

    // .sendクラスのdivがクリックされた時の処理
    const sendButton = document.querySelector('.send');
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            // chat.htmlにgakusekiの値を渡して遷移
            if (gakuseki) {
                window.location.href = `chat.html?gakuseki=${encodeURIComponent(gakuseki)}`;
            } else {
                console.warn('gakusekiがありません');
            }
        });
    }
});



document.addEventListener("DOMContentLoaded", () => {
    const backButton = document.querySelector('.back2');
    
    backButton.addEventListener('click', () => {
        const params = new URLSearchParams(window.location.search);
        const info = params.get('info'); 

        if (info) {
            // 上8桁以外を抽出
            const extractedPart = info.substring(8);

            // ".html" を付けた定数を用意
            const targetPage = `${extractedPart}.html`;

            // 指定したHTMLページにリダイレクト
            window.location.href = targetPage;
        } else {
            console.error('No info parameter found.');
        }
    });
});
